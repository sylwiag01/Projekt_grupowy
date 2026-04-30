from datetime import datetime

from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db


class Child(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    meals      = db.relationship('Meal',       backref='child', lazy=True)
    stats      = db.relationship('ChildStats', backref='child', lazy=True,
                                 order_by='ChildStats.recorded_at')
    activities = db.relationship('Activity',   backref='child', lazy=True,
                                 order_by='Activity.created_at')


class Parent(UserMixin, db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(100), nullable=False)
    email         = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    child_id      = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=True)
    child         = db.relationship('Child', backref=db.backref('parent', uselist=False))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


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
    id                    = db.Column(db.Integer, primary_key=True)
    child_id              = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    weight_kg             = db.Column(db.Float)
    height_cm             = db.Column(db.Float)
    age_years             = db.Column(db.Integer)
    insulin_to_carb_ratio = db.Column(db.Float)
    blood_sugar_target    = db.Column(db.Float)
    recorded_at           = db.Column(db.DateTime, default=datetime.utcnow)


class Activity(db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    child_id      = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    activity_type = db.Column(db.String(20), nullable=False)
    score         = db.Column(db.Float)
    details       = db.Column(db.Text)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)


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
