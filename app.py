from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///glikokids.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Child(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    meals = db.relationship('Meal', backref='child', lazy=True)


class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    meal_name = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    calories = db.Column(db.Float)
    ww = db.Column(db.Float)
    wbt = db.Column(db.Float)
    actual_ww = db.Column(db.Float)
    actual_wbt = db.Column(db.Float)


@app.route('/style/<path:filename>')
def serve_style(filename):
    return send_from_directory('style', filename)


@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)


@app.route('/rodzic')
def rodzic():
    return render_template('rodzic.html')


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


@app.route('/historia_rodzic')
def historia_rodzic():
    user_id = request.args.get('user_id', 1, type=int)
    return render_template('historia_rodzic.html', user_id=user_id)


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


@app.route('/api/meals/<int:child_id>', methods=['GET'])
def get_meals(child_id):
    meals = Meal.query.filter_by(child_id=child_id).order_by(Meal.timestamp.desc()).all()
    return jsonify([{
        'id': m.id,
        'meal_name': m.meal_name,
        'timestamp': m.timestamp.isoformat(),
        'calories': m.calories,
        'ww': m.ww,
        'wbt': m.wbt,
        'actual_ww': m.actual_ww,
        'actual_wbt': m.actual_wbt,
    } for m in meals])


with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True)
