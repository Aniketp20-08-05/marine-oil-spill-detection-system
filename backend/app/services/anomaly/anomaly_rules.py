def evaluate_anomaly_rules(vessel_data: dict) -> dict:
    sog = vessel_data.get("sog", 0) or 0
    cog = vessel_data.get("cog", 0) or 0
    vessel_type = (vessel_data.get("type") or "").lower()

    score = 0.0
    reasons: list[str] = []

    if sog < 1.0:
        score += 45
        reasons.append("Very low speed detected")

    if vessel_type in {"tanker", "chemical"} and sog < 2.0:
        score += 25
        reasons.append("Sensitive vessel type moving abnormally slow")

    if cog > 300 or cog < 20:
        score += 15
        reasons.append("Unusual course heading")

    if vessel_data.get("destination", "").lower() in {"offshore holding", "unknown", ""}:
        score += 10
        reasons.append("Unclear destination pattern")

    anomaly_detected = score >= 40

    return {
        "anomaly_detected": anomaly_detected,
        "anomaly_score": round(score, 2),
        "reason": ", ".join(reasons) if reasons else "Normal movement pattern",
    }