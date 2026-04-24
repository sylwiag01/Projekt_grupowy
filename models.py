from datetime import datetime
from extensions import db


class Child(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(100), nullable=False)
    meals    = db.relationship('Meal',       backref='child', lazy=True)
    stats    = db.relationship('ChildStats', backref='child', lazy=True,
                               order_by='ChildStats.recorded_at')


class Meal(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    child_id   = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    meal_name  = db.Column(db.String(200), nullable=False)
    timestamp  = db.Column(db.DateTime, default=datetime.utcnow)
    calories   = db.Column(db.Float)
    ww         = db.Column(db.Float)
    wbt        = db.Column(db.Float)
    actual_ww  = db.Column(db.Float)
    actual_wbt = db.Column(db.Float)


class ChildStats(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    child_id    = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    weight_kg   = db.Column(db.Float)
    height_cm   = db.Column(db.Float)
    age_years   = db.Column(db.Integer)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)


class Produce(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    calories = db.Column(db.Float)
    carbs    = db.Column(db.Float)
    protein  = db.Column(db.Float)
    fat      = db.Column(db.Float)
    ww       = db.Column(db.Float)
    wbt      = db.Column(db.Float)


class Dish(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    calories = db.Column(db.Float)
    carbs    = db.Column(db.Float)
    protein  = db.Column(db.Float)
    fat      = db.Column(db.Float)
    ww       = db.Column(db.Float)
    wbt      = db.Column(db.Float)
