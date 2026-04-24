import time

import requests as http
from flask import Flask, jsonify, render_template, request, send_from_directory

from extensions import db
from models import Child, ChildStats, Dish, Meal, Produce

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///glikokids.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


# ── OpenFoodFacts sync helpers ────────────────────────────────────────────────

PRODUCE_CATEGORIES = [
    ('Owoce',    'en:fruits'),
    ('Warzywa',  'en:vegetables'),
    ('Nabiał',   'en:dairies'),
    ('Mięso',    'en:meats'),
    ('Pieczywo', 'en:breads'),
    ('Zboża',    'en:cereals-and-potatoes'),
]

DISH_CATEGORIES = [
    ('Zupy',         'en:soups'),
    ('Dania gotowe', 'en:meals'),
    ('Sałatki',      'en:salads'),
    ('Desery',       'en:desserts'),
    ('Przekąski',    'en:snacks'),
]

_OFF_HEADERS = {'User-Agent': 'GlikoKids/1.0 (educational app for diabetic children)'}
PER_PAGE = 20


def _calc_ww(carbs):
    return round(float(carbs) / 10, 1) if carbs else 0.0


def _calc_wbt(protein, fat):
    return round((float(protein or 0) * 4 + float(fat or 0) * 9) / 100, 1)


def _fetch_off(tag, page_size=50):
    try:
        r = http.get(
            'https://world.openfoodfacts.org/cgi/search.pl',
            params={
                'action': 'process',
                'tagtype_0': 'categories', 'tag_contains_0': 'contains', 'tag_0': tag,
                'tagtype_1': 'languages',  'tag_contains_1': 'contains', 'tag_1': 'pl',
                'json': '1', 'page_size': page_size, 'sort_by': 'unique_scans_n',
                'fields': 'product_name_pl,nutriments',
            },
            headers=_OFF_HEADERS,
            timeout=20,
        )
        r.raise_for_status()
        r.encoding = 'utf-8'
        return r.json().get('products', []), None
    except Exception as e:
        return [], str(e)


def _parse(p, category):
    name = (p.get('product_name_pl') or '').strip()
    if not name or len(name) < 2:
        return None
    n = p.get('nutriments', {})
    kcal = n.get('energy-kcal_100g')
    if kcal is None:
        kj = n.get('energy-kj_100g') or n.get('energy_100g')
        if kj is not None:
            kcal = float(kj) / 4.184
    if kcal is None:
        return None
    carbs   = float(n.get('carbohydrates_100g') or 0)
    protein = float(n.get('proteins_100g') or 0)
    fat     = float(n.get('fat_100g') or 0)
    return dict(
        name=name[:200], category=category,
        calories=round(float(kcal), 1),
        carbs=round(carbs, 1), protein=round(protein, 1), fat=round(fat, 1),
        ww=_calc_ww(carbs), wbt=_calc_wbt(protein, fat),
    )


def _serialize(item):
    return {
        'id': item.id, 'name': item.name, 'category': item.category,
        'calories': item.calories, 'carbs': item.carbs,
        'protein': item.protein, 'fat': item.fat,
        'ww': item.ww, 'wbt': item.wbt,
    }


# ── Static files ──────────────────────────────────────────────────────────────

@app.route('/style/<path:filename>')
def serve_style(filename):
    return send_from_directory('style', filename)


@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)


# ── Pages ─────────────────────────────────────────────────────────────────────

@app.route('/')
@app.route('/dziecko')
def dziecko():
    return render_template('dziecko.html')


@app.route('/quiz')
def quiz():
    return render_template('quiz.html')


@app.route('/gra')
def gra():
    return render_template('gra.html')


@app.route('/posilek')
def posilek():
    user_id = request.args.get('user_id', 1, type=int)
    return render_template('posilek.html', user_id=user_id)


@app.route('/rodzic')
def rodzic():
    return render_template('rodzic.html')


@app.route('/historia_rodzic')
def historia_rodzic():
    user_id = request.args.get('user_id', 1, type=int)
    return render_template('historia_rodzic.html', user_id=user_id)


@app.route('/baza_rodzic')
def baza_rodzic():
    return render_template('baza_rodzic.html',
                           produce_cats=[c[0] for c in PRODUCE_CATEGORIES],
                           dish_cats=[c[0] for c in DISH_CATEGORIES])


# ── Meal API ──────────────────────────────────────────────────────────────────

@app.route('/api/meal', methods=['POST'])
def save_meal():
    data = request.get_json()
    if not data or not data.get('meal_name') or not data.get('child_id'):
        return jsonify({'error': 'meal_name and child_id are required'}), 400
    meal = Meal(
        child_id=data['child_id'],
        meal_name=data['meal_name'],
        calories=data.get('calories'),
        ww=data.get('ww'),
        wbt=data.get('wbt'),
        actual_ww=data.get('actual_ww'),
        actual_wbt=data.get('actual_wbt'),
    )
    db.session.add(meal)
    db.session.commit()
    return jsonify({'id': meal.id}), 201


@app.route('/api/meal/<int:meal_id>', methods=['PATCH'])
def update_meal(meal_id):
    meal = db.get_or_404(Meal, meal_id)
    data = request.get_json()
    if 'actual_ww' in data:
        meal.actual_ww = data['actual_ww']
    if 'actual_wbt' in data:
        meal.actual_wbt = data['actual_wbt']
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/api/meals/<int:child_id>')
def get_meals(child_id):
    meals = Meal.query.filter_by(child_id=child_id).order_by(Meal.timestamp.desc()).all()
    return jsonify([{
        'id': m.id, 'meal_name': m.meal_name,
        'timestamp': m.timestamp.isoformat(),
        'calories': m.calories, 'ww': m.ww, 'wbt': m.wbt,
        'actual_ww': m.actual_ww, 'actual_wbt': m.actual_wbt,
    } for m in meals])


# ── Child stats API ───────────────────────────────────────────────────────────

@app.route('/api/child_stats', methods=['POST'])
def save_child_stats():
    data = request.get_json()
    if not data or not data.get('child_id'):
        return jsonify({'error': 'child_id is required'}), 400
    entry = ChildStats(
        child_id=data['child_id'],
        weight_kg=data.get('weight_kg'),
        height_cm=data.get('height_cm'),
        age_years=data.get('age_years'),
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({'id': entry.id}), 201


@app.route('/api/child_stats/<int:child_id>')
def get_child_stats(child_id):
    entries = ChildStats.query.filter_by(child_id=child_id) \
                              .order_by(ChildStats.recorded_at.desc()).all()
    return jsonify([{
        'id': e.id, 'child_id': e.child_id,
        'weight_kg': e.weight_kg, 'height_cm': e.height_cm, 'age_years': e.age_years,
        'recorded_at': e.recorded_at.isoformat(),
    } for e in entries])


@app.route('/api/child_stats/<int:child_id>/latest')
def get_child_stats_latest(child_id):
    entry = ChildStats.query.filter_by(child_id=child_id) \
                            .order_by(ChildStats.recorded_at.desc()).first()
    if not entry:
        return jsonify(None)
    return jsonify({
        'id': entry.id, 'child_id': entry.child_id,
        'weight_kg': entry.weight_kg, 'height_cm': entry.height_cm,
        'age_years': entry.age_years, 'recorded_at': entry.recorded_at.isoformat(),
    })


@app.route('/api/child_stats/<int:entry_id>', methods=['DELETE'])
def delete_child_stats(entry_id):
    entry = db.get_or_404(ChildStats, entry_id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'ok': True})


# ── Product API ───────────────────────────────────────────────────────────────

def _paginate(query, model_cls):
    search   = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()
    page     = request.args.get('page', 1, type=int)
    if search:
        query = query.filter(model_cls.name.ilike(f'%{search}%'))
    if category:
        query = query.filter(model_cls.category == category)
    total = query.count()
    items = query.order_by(model_cls.name).offset((page - 1) * PER_PAGE).limit(PER_PAGE).all()
    return jsonify({'items': [_serialize(i) for i in items],
                    'total': total, 'page': page,
                    'pages': max(1, (total + PER_PAGE - 1) // PER_PAGE)})


@app.route('/api/produce')
def get_produce():
    return _paginate(Produce.query, Produce)


@app.route('/api/dishes')
def get_dishes():
    return _paginate(Dish.query, Dish)


@app.route('/api/products/search')
def search_products():
    q = request.args.get('q', '').strip()
    if len(q) < 2:
        return jsonify([])
    results = []
    for item in Produce.query.filter(Produce.name.ilike(f'%{q}%')).limit(8):
        results.append({**_serialize(item), 'type': 'produce'})
    for item in Dish.query.filter(Dish.name.ilike(f'%{q}%')).limit(8):
        results.append({**_serialize(item), 'type': 'dish'})
    return jsonify(results[:15])


@app.route('/api/produce/<int:item_id>', methods=['DELETE'])
def delete_produce(item_id):
    db.session.delete(db.get_or_404(Produce, item_id))
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/api/dish/<int:item_id>', methods=['DELETE'])
def delete_dish(item_id):
    db.session.delete(db.get_or_404(Dish, item_id))
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/api/purge', methods=['DELETE'])
def purge_all():
    Produce.query.delete()
    Dish.query.delete()
    db.session.commit()
    return jsonify({'ok': True})


# ── Sync API ──────────────────────────────────────────────────────────────────

@app.route('/api/sync', methods=['POST'])
def sync_products():
    errors, added_produce, added_dishes = [], 0, 0

    seen = set()
    Produce.query.delete()
    for cat_name, tag in PRODUCE_CATEGORIES:
        products, err = _fetch_off(tag, 50)
        if err:
            errors.append(f'{cat_name}: {err}')
        for p in products:
            parsed = _parse(p, cat_name)
            if parsed and parsed['name'] not in seen:
                seen.add(parsed['name'])
                db.session.add(Produce(**parsed))
                added_produce += 1
        time.sleep(0.3)

    seen = set()
    Dish.query.delete()
    for cat_name, tag in DISH_CATEGORIES:
        products, err = _fetch_off(tag, 50)
        if err:
            errors.append(f'{cat_name}: {err}')
        for p in products:
            parsed = _parse(p, cat_name)
            if parsed and parsed['name'] not in seen:
                seen.add(parsed['name'])
                db.session.add(Dish(**parsed))
                added_dishes += 1
        time.sleep(0.3)

    db.session.commit()
    return jsonify({'added_produce': added_produce, 'added_dishes': added_dishes, 'errors': errors})


@app.route('/api/sync/debug')
def sync_debug():
    products, err = _fetch_off('en:fruits', 3)
    sample = []
    for p in products:
        n = p.get('nutriments', {})
        sample.append({
            'name_pl': p.get('product_name_pl'),
            'name':    p.get('product_name'),
            'name_en': p.get('product_name_en'),
            'kcal':    n.get('energy-kcal_100g'),
            'kj':      n.get('energy-kj_100g'),
            'energy':  n.get('energy_100g'),
            'carbs':   n.get('carbohydrates_100g'),
            'parsed':  _parse(p, 'Owoce'),
        })
    return jsonify({'fetched': len(products), 'error': err, 'sample': sample})


# ── Init ──────────────────────────────────────────────────────────────────────

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
