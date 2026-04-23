from app.services.risk.risk_score_service import RiskScoreService

def test_calculate_risk_score_low():
    service = RiskScoreService()
    result = service.calculate_risk_score(20, 30)
    assert result["risk_score"] == 25.5
    assert result["risk_level"] == "Low"

def test_calculate_risk_score_medium():
    service = RiskScoreService()
    result = service.calculate_risk_score(50, 60)
    assert result["risk_score"] == 55.5
    assert result["risk_level"] == "Medium"

def test_calculate_risk_score_high():
    service = RiskScoreService()
    result = service.calculate_risk_score(80, 90)
    assert result["risk_score"] == 85.5
    assert result["risk_level"] == "High"
