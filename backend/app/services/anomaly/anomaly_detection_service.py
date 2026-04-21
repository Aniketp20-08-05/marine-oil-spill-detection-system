from app.models.anomaly_event import AnomalyEvent
from app.repositories.anomaly_repository import AnomalyRepository
from app.services.anomaly.anomaly_rules import evaluate_anomaly_rules


class AnomalyDetectionService:
    def __init__(self, db):
        self.db = db
        self.anomaly_repository = AnomalyRepository(db)

    def detect_anomaly(self, vessel_data: dict) -> dict:
        return evaluate_anomaly_rules(vessel_data)

    def store_anomaly(self, vessel_id: int, anomaly_result: dict) -> AnomalyEvent:
        anomaly = AnomalyEvent(
            vessel_id=vessel_id,
            anomaly_score=anomaly_result["anomaly_score"],
            reason=anomaly_result["reason"],
        )
        return self.anomaly_repository.create(anomaly)