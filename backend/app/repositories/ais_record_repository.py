from sqlalchemy.orm import Session

from app.models.ais_record import AISRecord


class AISRecordRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[AISRecord]:
        return self.db.query(AISRecord).all()

    def create(self, ais_record: AISRecord) -> AISRecord:
        self.db.add(ais_record)
        self.db.commit()
        self.db.refresh(ais_record)
        return ais_record

    def get_latest_for_vessel(self, vessel_id: int) -> AISRecord | None:
        return (
            self.db.query(AISRecord)
            .filter(AISRecord.vessel_id == vessel_id)
            .order_by(AISRecord.record_id.desc())
            .first()
        )