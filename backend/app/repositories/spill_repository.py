from sqlalchemy.orm import Session

from app.models.spill_detection import SpillDetection


class SpillRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[SpillDetection]:
        return self.db.query(SpillDetection).all()

    def create(self, spill: SpillDetection) -> SpillDetection:
        self.db.add(spill)
        self.db.commit()
        self.db.refresh(spill)
        return spill