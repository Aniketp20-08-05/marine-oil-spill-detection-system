class RiskScoreService:
    def calculate_risk_score(self, anomaly_score: float, confidence_score: float) -> dict:
        risk_score = (anomaly_score * 0.45) + (confidence_score * 0.55)

        if risk_score >= 75:
            risk_level = "High"
        elif risk_score >= 45:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return {
            "risk_score": round(risk_score, 2),
            "risk_level": risk_level,
        }