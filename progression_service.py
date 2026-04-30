LEVELS = [
    {"id": 1,  "name": "Mały Odkrywca",       "animal_icon": "🐣",  "xp_required": 50},
    {"id": 2,  "name": "Szybki Króliczek",    "animal_icon": "🐰",  "xp_required": 60},
    {"id": 3,  "name": "Wesoły Miś",          "animal_icon": "🐻",  "xp_required": 75},
    {"id": 4,  "name": "Puszysty Lis",        "animal_icon": "🦊",  "xp_required": 90},
    {"id": 5,  "name": "Dzielny Żółwik",      "animal_icon": "🐢",  "xp_required": 110},
    {"id": 6,  "name": "Skoczna Żabka",       "animal_icon": "🐸",  "xp_required": 130},
    {"id": 7,  "name": "Zwinny Kotek",        "animal_icon": "🐱",  "xp_required": 155},
    {"id": 8,  "name": "Bystry Szczeniak",    "animal_icon": "🐶",  "xp_required": 180},
    {"id": 9,  "name": "Latający Motyl",      "animal_icon": "🦋",  "xp_required": 210},
    {"id": 10, "name": "Złoty Rybek",         "animal_icon": "🐠",  "xp_required": 245},
    {"id": 11, "name": "Mądra Sowa",          "animal_icon": "🦉",  "xp_required": 285},
    {"id": 12, "name": "Radosny Pingwin",     "animal_icon": "🐧",  "xp_required": 325},
    {"id": 13, "name": "Odważny Lew",         "animal_icon": "🦁",  "xp_required": 375},
    {"id": 14, "name": "Sprytna Panda",       "animal_icon": "🐼",  "xp_required": 430},
    {"id": 15, "name": "Latający Orzeł",      "animal_icon": "🦅",  "xp_required": 495},
    {"id": 16, "name": "Ciekawski Jeż",       "animal_icon": "🦔",  "xp_required": 565},
    {"id": 17, "name": "Silny Słonik",        "animal_icon": "🐘",  "xp_required": 650},
    {"id": 18, "name": "Groźny Wilk",         "animal_icon": "🐺",  "xp_required": 745},
    {"id": 19, "name": "Dziki Tygrys",        "animal_icon": "🐯",  "xp_required": 855},
    {"id": 20, "name": "Mądry Delfin",        "animal_icon": "🐬",  "xp_required": 980},
    {"id": 21, "name": "Magiczny Jednorożec", "animal_icon": "🦄",  "xp_required": 1125},
    {"id": 22, "name": "Ognisty Smok",        "animal_icon": "🐲",  "xp_required": 1290},
    {"id": 23, "name": "Wielki Bohater",      "animal_icon": "🦸",  "xp_required": 1480},
    {"id": 24, "name": "Strażnik Lasu",       "animal_icon": "🦌",  "xp_required": 1700},
    {"id": 25, "name": "Władca Niebios",      "animal_icon": "🦚",  "xp_required": 1950},
    {"id": 26, "name": "Mistrz Gwiazd",       "animal_icon": "🌟",  "xp_required": 2240},
    {"id": 27, "name": "Genialny Szop",       "animal_icon": "🦝",  "xp_required": 2570},
    {"id": 28, "name": "Potężny Goryl",       "animal_icon": "🦍",  "xp_required": 2955},
    {"id": 29, "name": "Strażnik Cukru",      "animal_icon": "🦩",  "xp_required": 3395},
    {"id": 30, "name": "Legenda GlikoKids",   "animal_icon": "🏆",  "xp_required": 9999},
]

XP_PER_CORRECT = 8
COINS_PER_CORRECT = 2
XP_PER_STAR = 10
COINS_PER_STAR = 3


def _level_for_total_xp(total_xp):
    cumulative = 0
    for lv in LEVELS[:-1]:
        next_threshold = cumulative + lv["xp_required"]
        if total_xp < next_threshold:
            return lv, total_xp - cumulative, lv["xp_required"]
        cumulative = next_threshold
    last = LEVELS[-1]
    return last, total_xp - cumulative, last["xp_required"]


def _build_progress_dict(progress):
    level, xp_in_level, xp_for_next = _level_for_total_xp(progress.total_xp)
    pct = round((xp_in_level / xp_for_next) * 100) if xp_for_next > 0 else 100
    next_level = LEVELS[level["id"]] if level["id"] < len(LEVELS) else None
    return {
        "level_id":        level["id"],
        "level_name":      level["name"],
        "animal_icon":     level["animal_icon"],
        "total_xp":        progress.total_xp,
        "xp_in_level":     xp_in_level,
        "xp_for_next":     xp_for_next,
        "xp_percent":      pct,
        "coins":           progress.coins,
        "next_level_name": next_level["name"]        if next_level else None,
        "next_level_icon": next_level["animal_icon"] if next_level else None,
    }


def get_progress_data(child_id):
    from models import UserProgress
    from extensions import db

    progress = UserProgress.query.filter_by(child_id=child_id).first()
    if not progress:
        progress = UserProgress(child_id=child_id, total_xp=0, coins=0)
        db.session.add(progress)
        db.session.commit()

    return _build_progress_dict(progress)


def award_game_stars(child_id, stars):
    from models import UserProgress
    from extensions import db

    xp_earned    = stars * XP_PER_STAR
    coins_earned = stars * COINS_PER_STAR

    progress = UserProgress.query.filter_by(child_id=child_id).first()
    if not progress:
        progress = UserProgress(child_id=child_id, total_xp=0, coins=0)
        db.session.add(progress)

    old_level_id      = _level_for_total_xp(progress.total_xp)[0]["id"]
    progress.total_xp += xp_earned
    progress.coins    += coins_earned
    db.session.commit()

    new_level_data = _level_for_total_xp(progress.total_xp)
    leveled_up     = new_level_data[0]["id"] > old_level_id

    result = _build_progress_dict(progress)
    result["xp_earned"]      = xp_earned
    result["coins_earned"]   = coins_earned
    result["leveled_up"]     = leveled_up
    result["new_level_name"] = new_level_data[0]["name"]        if leveled_up else None
    result["new_level_icon"] = new_level_data[0]["animal_icon"] if leveled_up else None
    return result


def award_xp(child_id, correct_answers):
    from models import UserProgress
    from extensions import db

    xp_earned    = correct_answers * XP_PER_CORRECT
    coins_earned = correct_answers * COINS_PER_CORRECT

    progress = UserProgress.query.filter_by(child_id=child_id).first()
    if not progress:
        progress = UserProgress(child_id=child_id, total_xp=0, coins=0)
        db.session.add(progress)

    old_level_id      = _level_for_total_xp(progress.total_xp)[0]["id"]
    progress.total_xp += xp_earned
    progress.coins    += coins_earned
    db.session.commit()

    new_level_data = _level_for_total_xp(progress.total_xp)
    leveled_up     = new_level_data[0]["id"] > old_level_id

    result = _build_progress_dict(progress)
    result["xp_earned"]      = xp_earned
    result["coins_earned"]   = coins_earned
    result["leveled_up"]     = leveled_up
    result["new_level_name"] = new_level_data[0]["name"]        if leveled_up else None
    result["new_level_icon"] = new_level_data[0]["animal_icon"] if leveled_up else None
    return result
