from sqlalchemy.orm import Session

from app.models.anomaly_event import AnomalyEvent


class AnomalyRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[AnomalyEvent]:
        return self.db.query(AnomalyEvent).all()

    def get_latest(self, limit: int = 50) -> list[AnomalyEvent]:
        return (
            self.db.query(AnomalyEvent)
            .order_by(AnomalyEvent.anomaly_id.desc())
            .limit(limit)
            .all()
        )

    def get_count(self) -> int:
        return self.db.query(AnomalyEvent).count()

    def create(self, anomaly: AnomalyEvent) -> AnomalyEvent:
        self.db.add(anomaly)
        self.db.commit()
        self.db.refresh(anomaly)
        return anomaly