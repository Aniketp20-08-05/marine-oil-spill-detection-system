from sqlalchemy.orm import Session

from app.models.risk_zone import RiskZone


class RiskZoneRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[RiskZone]:
        return self.db.query(RiskZone).all()

    def get_latest(self, limit: int = 20) -> list[RiskZone]:
        return (
            self.db.query(RiskZone)
            .order_by(RiskZone.zone_id.desc())
            .limit(limit)
            .all()
        )

    def create(self, risk_zone: RiskZone) -> RiskZone:
        self.db.add(risk_zone)
        self.db.commit()
        self.db.refresh(risk_zone)
        return risk_zone