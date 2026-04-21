def calculate_spill_confidence(vessel_data: dict, anomaly_result: dict) -> float:
    score = 0.0
    vessel_type = (vessel_data.get("type") or "").lower()

    if vessel_type in {"tanker", "chemical"}:
        score += 35

    score += anomaly_result["anomaly_score"] * 0.5

    if (vessel_data.get("sog") or 0) < 1.5:
        score += 10

    return round(min(score, 100.0), 2)