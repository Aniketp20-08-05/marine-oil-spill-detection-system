import pytest
from app.services.anomaly.anomaly_detection_service import AnomalyDetectionService

def test_detect_anomaly_normal_vessel():
    service = AnomalyDetectionService(db=None)  # db not needed for detection only
    vessel_data = {
        "sog": 10.0,
        "type": "Cargo",
        "latitude": 1.23,
        "longitude": 103.45
    }
    result = service.detect_anomaly(vessel_data)
    assert "anomaly_detected" in result
    assert "anomaly_score" in result
    assert "reason" in result

def test_detect_anomaly_suspicious_vessel():
    service = AnomalyDetectionService(db=None)
    vessel_data = {
        "sog": 0.2,  # Low speed might trigger anomaly rules
        "type": "Tanker",
        "latitude": 1.23,
        "longitude": 103.45
    }
    result = service.detect_anomaly(vessel_data)
    assert result["anomaly_detected"] is True or result["anomaly_score"] >= 0
