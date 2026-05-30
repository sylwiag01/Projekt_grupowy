import json
from flask import Blueprint, jsonify
from datetime import datetime
from models import db, Activity

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/activity/<int:child_id>/today_progress')
def get_today_progress(child_id):
    today = datetime.utcnow().date()
    
    activities_today = Activity.query.filter(
        Activity.child_id == child_id,
        Activity.activity_type == 'meal',
        db.func.date(Activity.created_at) == today
    ).all()

    total_ww = 0.0
    correct_calculations = 0
    total_meals = len(activities_today)

    for act in activities_today:
        # score traktujemy jako ilość wpisanego WW
        if act.score is not None:
            total_ww += act.score
            
        # Z formatu Text() dekodujemy JSON, by sprawdzić poprawność
        if act.details:
            try:
                details_dict = json.loads(act.details)
                if details_dict.get('is_correct') == True:
                    correct_calculations += 1
            except json.JSONDecodeError:
                pass # Pomijamy jeśli details to nie jest poprawny JSON

    incorrect_calculations = total_meals - correct_calculations

    return jsonify({
        "total_ww": round(total_ww, 1),
        "daily_limit_ww": 15, 
        "correct_calculations": correct_calculations,
        "incorrect_calculations": incorrect_calculations,
        "total_meals": total_meals
    })
