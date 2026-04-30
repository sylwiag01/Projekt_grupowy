import json
import time
from datetime import datetime

import requests as http
from flask import Flask, flash, jsonify, redirect, render_template, request, send_from_directory, url_for
from flask_login import current_user, login_required, login_user, logout_user
from sqlalchemy import inspect, text

from extensions import db, login_manager
from models import Activity, Child, ChildStats, Dish, Meal, Parent, Produce, UserProgress
from progression_service import LEVELS, award_game_stars, award_xp, get_progress_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///glikokids.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'glikokids-secret-key-2026-change-in-prod'

db.init_app(app)
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Parent, int(user_id))


PRODUCE_CATEGORIES = [
    ('Owoce', 'en:fruits'),
    ('Warzywa', 'en:vegetables'),
    ('Nabiał', 'en:dairies'),
    ('Mięso', 'en:meats'),
    ('Pieczywo', 'en:breads'),
    ('Zboża', 'en:cereals-and-potatoes'),
]

DISH_CATEGORIES = [
    ('Zupy', 'en:soups'),
    ('Dania gotowe', 'en:meals'),
    ('Sałatki', 'en:salads'),
    ('Desery', 'en:desserts'),
    ('Przekąski', 'en:snacks'),
]

_OFF_HEADERS = {'User-Agent': 'GlikoKids/1.0 (educational app for diabetic children)'}
PER_PAGE = 20


def _calc_ww(carbs):
    return round(float(carbs) / 10, 1) if carbs else 0.0


def _calc_wbt(protein, fat):
    return round((float(protein or 0) * 4 + float(fat or 0) * 9) / 100, 1)


def _calc_daily_targets(stats):
    age = stats.age_years if stats else None
    weight = stats.weight_kg if stats else None
    if not age and not weight:
        return None
    daily_kcal = (1000 + 100 * age) if age else round(weight * 35)
    carb_g = (daily_kcal * 0.50) / 4
    daily_ww = round(carb_g / 10, 1)
    daily_wbt = round(daily_kcal * 0.50 / 100, 1)
    return {'kcal': round(daily_kcal), 'ww': daily_ww, 'wbt': daily_wbt}


def _fetch_off(tag, page_size=500):
    all_products = []
    page = 1
    while True:
        try:
            r = http.get(
                'https://world.openfoodfacts.org/cgi/search.pl',
                params={
                    'action': 'process',
                    'tagtype_0': 'categories', 'tag_contains_0': 'contains', 'tag_0': tag,
                    'tagtype_1': 'languages', 'tag_contains_1': 'contains', 'tag_1': 'pl',
                    'json': '1', 'page': page, 'page_size': page_size,
                    'sort_by': 'unique_scans_n',
                    'fields': 'product_name_pl,nutriments',
                },
                headers=_OFF_HEADERS,
                timeout=30,
            )
            r.raise_for_status()
            r.encoding = 'utf-8'
            data = r.json()
            products = data.get('products', [])
            all_products.extend(products)
            if len(products) < page_size:
                break
            page += 1
            time.sleep(0.5)
        except Exception as e:
            return all_products, str(e)
    return all_products, None


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
    carbs = float(n.get('carbohydrates_100g') or 0)
    protein = float(n.get('proteins_100g') or 0)
    fat = float(n.get('fat_100g') or 0)
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
        'is_custom': getattr(item, 'is_custom', False),
    }


def _migrate_db():
    inspector = inspect(db.engine)

    existing_stats = {col['name'] for col in inspector.get_columns('child_stats')}
    with db.engine.begin() as conn:
        if 'insulin_to_carb_ratio' not in existing_stats:
            conn.execute(text('ALTER TABLE child_stats ADD COLUMN insulin_to_carb_ratio FLOAT'))
        if 'blood_sugar_target' not in existing_stats:
            conn.execute(text('ALTER TABLE child_stats ADD COLUMN blood_sugar_target FLOAT'))

    for table in ('produce', 'dish'):
        if inspector.has_table(table):
            existing = {col['name'] for col in inspector.get_columns(table)}
            if 'is_custom' not in existing:
                with db.engine.begin() as conn:
                    conn.execute(text(f'ALTER TABLE {table} ADD COLUMN is_custom BOOLEAN NOT NULL DEFAULT 0'))


@app.route('/style/<path:filename>')
def serve_style(filename):
    return send_from_directory('style', filename)


@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('rodzic'))
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        parent = Parent.query.filter_by(email=email).first()
        if parent and parent.check_password(password):
            login_user(parent)
            return redirect(url_for('rodzic'))
        flash('Nieprawidłowy adres e-mail lub hasło.', 'danger')
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('rodzic'))
    if request.method == 'POST':
        parent_name = request.form.get('parent_name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm = request.form.get('confirm_password', '')
        child_name = request.form.get('child_name', '').strip()
        weight = request.form.get('weight_kg', type=float)
        height = request.form.get('height_cm', type=float)
        age = request.form.get('age_years', type=int)
        insulin_ratio = request.form.get('insulin_to_carb_ratio', type=float)
        blood_sugar = request.form.get('blood_sugar_target', type=float)

        if not parent_name or not email or not password or not child_name:
            flash('Wypełnij wszystkie wymagane pola.', 'danger')
            return render_template('register.html')
        if password != confirm:
            flash('Hasła nie są identyczne.', 'danger')
            return render_template('register.html')
        if len(password) < 6:
            flash('Hasło musi mieć co najmniej 6 znaków.', 'danger')
            return render_template('register.html')
        if Parent.query.filter_by(email=email).first():
            flash('Konto z tym adresem e-mail już istnieje.', 'danger')
            return render_template('register.html')

        child = Child(name=child_name)
        db.session.add(child)
        db.session.flush()

        parent = Parent(name=parent_name, email=email, child_id=child.id)
        parent.set_password(password)
        db.session.add(parent)

        stats = ChildStats(
            child_id=child.id,
            weight_kg=weight,
            height_cm=height,
            age_years=age,
            insulin_to_carb_ratio=insulin_ratio,
            blood_sugar_target=blood_sugar,
        )
        db.session.add(stats)
        db.session.commit()

        login_user(parent)
        return redirect(url_for('rodzic'))

    return render_template('register.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))



@app.route('/')
@app.route('/dziecko')
@login_required
def dziecko():
    progress = get_progress_data(current_user.child_id)
    return render_template('dziecko.html', child=current_user.child, progress=progress)


@app.route('/quiz')
@login_required
def quiz():
    return render_template('quiz.html', user_id=current_user.child_id)


@app.route('/gra')
@login_required
def gra():
    return render_template('gra.html', user_id=current_user.child_id)


@app.route('/posilek')
@login_required
def posilek():
    stats = ChildStats.query.filter_by(child_id=current_user.child_id) \
        .order_by(ChildStats.recorded_at.desc()).first()
    targets = _calc_daily_targets(stats)
    return render_template('posilek.html', user_id=current_user.child_id, targets=targets)


@app.route('/rodzic')
@login_required
def rodzic():
    return render_template('rodzic.html', parent=current_user, child=current_user.child)


@app.route('/historia_rodzic')
@login_required
def historia_rodzic():
    stats = ChildStats.query.filter_by(child_id=current_user.child_id) \
        .order_by(ChildStats.recorded_at.desc()).first()
    targets = _calc_daily_targets(stats)
    return render_template('historia_rodzic.html', user_id=current_user.child_id, targets=targets)


@app.route('/aktywnosc_dziecka')
@login_required
def aktywnosc_dziecka():
    return render_template('aktywnosc_dziecka.html', child_id=current_user.child_id)


@app.route('/baza_rodzic')
@login_required
def baza_rodzic():
    return render_template('baza_rodzic.html',
                           produce_cats=[c[0] for c in PRODUCE_CATEGORIES],
                           dish_cats=[c[0] for c in DISH_CATEGORIES])



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
        insulin_to_carb_ratio=data.get('insulin_to_carb_ratio'),
        blood_sugar_target=data.get('blood_sugar_target'),
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({'id': entry.id}), 201


def _serialize_stats(e):
    return {
        'id': e.id, 'child_id': e.child_id,
        'weight_kg': e.weight_kg, 'height_cm': e.height_cm, 'age_years': e.age_years,
        'insulin_to_carb_ratio': e.insulin_to_carb_ratio,
        'blood_sugar_target': e.blood_sugar_target,
        'recorded_at': e.recorded_at.isoformat(),
    }


@app.route('/api/child_stats/<int:child_id>')
def get_child_stats(child_id):
    entries = ChildStats.query.filter_by(child_id=child_id) \
        .order_by(ChildStats.recorded_at.desc()).all()
    return jsonify([_serialize_stats(e) for e in entries])


@app.route('/api/child_stats/<int:child_id>/latest')
def get_child_stats_latest(child_id):
    entry = ChildStats.query.filter_by(child_id=child_id) \
        .order_by(ChildStats.recorded_at.desc()).first()
    if not entry:
        return jsonify(None)
    return jsonify(_serialize_stats(entry))


@app.route('/api/child_stats/<int:entry_id>', methods=['DELETE'])
def delete_child_stats(entry_id):
    entry = db.get_or_404(ChildStats, entry_id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'ok': True})



def _serialize_activity(a):
    return {
        'id': a.id,
        'child_id': a.child_id,
        'activity_type': a.activity_type,
        'score': a.score,
        'details': json.loads(a.details) if a.details else {},
        'created_at': a.created_at.isoformat(),
    }


@app.route('/api/activity', methods=['POST'])
def save_activity():
    data = request.get_json()
    if not data or not data.get('child_id') or not data.get('activity_type'):
        return jsonify({'error': 'child_id and activity_type are required'}), 400
    entry = Activity(
        child_id=data['child_id'],
        activity_type=data['activity_type'],
        score=data.get('score'),
        details=json.dumps(data.get('details', {})),
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({'id': entry.id}), 201


@app.route('/user/progress')
@login_required
def user_progress():
    return jsonify(get_progress_data(current_user.child_id))


@app.route('/quiz/result', methods=['POST'])
@login_required
def quiz_result():
    data = request.get_json()
    if not data or 'correct_answers' not in data:
        return jsonify({'error': 'correct_answers jest wymagane'}), 400
    correct = max(0, int(data['correct_answers']))
    result = award_xp(current_user.child_id, correct)
    return jsonify(result), 200


@app.route('/game/result', methods=['POST'])
@login_required
def game_result():
    data = request.get_json()
    if not data or 'stars' not in data:
        return jsonify({'error': 'stars jest wymagane'}), 400
    stars = max(0, min(3, int(data['stars'])))
    result = award_game_stars(current_user.child_id, stars)
    return jsonify(result), 200


@app.route('/levels')
def levels():
    return jsonify(LEVELS)


@app.route('/api/activity/<int:child_id>/today')
def get_activities_today(child_id):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    items = (Activity.query
             .filter_by(child_id=child_id)
             .filter(Activity.created_at >= today)
             .order_by(Activity.created_at.desc())
             .limit(5).all())
    return jsonify([_serialize_activity(a) for a in items])


@app.route('/api/activity/<int:child_id>')
def get_activities(child_id):
    per_page = 10
    page = request.args.get('page', 1, type=int)
    q = (Activity.query
         .filter_by(child_id=child_id)
         .order_by(Activity.created_at.desc()))
    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify({
        'items': [_serialize_activity(a) for a in items],
        'total': total,
        'page': page,
        'pages': max(1, (total + per_page - 1) // per_page),
    })



def _paginate(query, model_cls):
    search = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()
    page = request.args.get('page', 1, type=int)
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


@app.route('/api/produce', methods=['POST'])
@login_required
def add_produce():
    data = request.get_json()
    if not data or not data.get('name') or data.get('calories') is None or data.get('carbs') is None:
        return jsonify({'error': 'name, calories i carbs są wymagane'}), 400
    carbs = float(data['carbs'])
    protein = float(data.get('protein') or 0)
    fat = float(data.get('fat') or 0)
    item = Produce(
        name=str(data['name'])[:200],
        category=data.get('category', ''),
        calories=round(float(data['calories']), 1),
        carbs=round(carbs, 1),
        protein=round(protein, 1),
        fat=round(fat, 1),
        ww=_calc_ww(carbs),
        wbt=_calc_wbt(protein, fat),
        is_custom=True,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(_serialize(item)), 201


@app.route('/api/dish', methods=['POST'])
@login_required
def add_dish():
    data = request.get_json()
    if not data or not data.get('name') or data.get('calories') is None or data.get('carbs') is None:
        return jsonify({'error': 'name, calories i carbs są wymagane'}), 400
    carbs = float(data['carbs'])
    protein = float(data.get('protein') or 0)
    fat = float(data.get('fat') or 0)
    item = Dish(
        name=str(data['name'])[:200],
        category=data.get('category', ''),
        calories=round(float(data['calories']), 1),
        carbs=round(carbs, 1),
        protein=round(protein, 1),
        fat=round(fat, 1),
        ww=_calc_ww(carbs),
        wbt=_calc_wbt(protein, fat),
        is_custom=True,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(_serialize(item)), 201


@app.route('/api/purge', methods=['DELETE'])
def purge_all():
    Produce.query.delete()
    Dish.query.delete()
    db.session.commit()
    return jsonify({'ok': True})



@app.route('/api/sync', methods=['POST'])
def sync_products():
    errors, added_produce, added_dishes = [], 0, 0

    seen = set()
    Produce.query.filter_by(is_custom=False).delete()
    for cat_name, tag in PRODUCE_CATEGORIES:
        products, err = _fetch_off(tag)
        if err:
            errors.append(f'{cat_name}: {err}')
        for p in products:
            parsed = _parse(p, cat_name)
            if parsed and parsed['name'] not in seen:
                seen.add(parsed['name'])
                db.session.add(Produce(**parsed))
                added_produce += 1
        time.sleep(0.5)

    seen = set()
    Dish.query.filter_by(is_custom=False).delete()
    for cat_name, tag in DISH_CATEGORIES:
        products, err = _fetch_off(tag)
        if err:
            errors.append(f'{cat_name}: {err}')
        for p in products:
            parsed = _parse(p, cat_name)
            if parsed and parsed['name'] not in seen:
                seen.add(parsed['name'])
                db.session.add(Dish(**parsed))
                added_dishes += 1
        time.sleep(0.5)

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
            'name': p.get('product_name'),
            'name_en': p.get('product_name_en'),
            'kcal': n.get('energy-kcal_100g'),
            'kj': n.get('energy-kj_100g'),
            'energy': n.get('energy_100g'),
            'carbs': n.get('carbohydrates_100g'),
            'parsed': _parse(p, 'Owoce'),
        })
    return jsonify({'fetched': len(products), 'error': err, 'sample': sample})



with app.app_context():
    db.create_all()
    _migrate_db()

if __name__ == '__main__':
    app.run(debug=True)
