def calculate_spill_confidence(vessel_data: dict, anomaly_result: dict) -> float:
    score = 0.0
    vessel_type = (vessel_data.get("type") or "").lower()

    # High-risk vessel types get full bonus
    if vessel_type in {"tanker", "chemical"}:
        score += 35
    # Unknown vessels still get a partial risk score (live AIS often reports Unknown)
    elif vessel_type in {"", "unknown"}:
        score += 15
    # Other vessel types get a small bonus
    else:
        score += 10

    # Anomaly score contributes heavily to confidence
    score += anomaly_result["anomaly_score"] * 0.55

    # Bonus for very low/stopped vessels
    if (vessel_data.get("sog") or 0) < 1.0:
        score += 15
    elif (vessel_data.get("sog") or 0) < 2.0:
        score += 8

    return round(min(score, 100.0), 2)