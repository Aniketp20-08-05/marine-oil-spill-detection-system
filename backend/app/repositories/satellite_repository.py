from sqlalchemy.orm import Session

from app.models.satellite_image import SatelliteImage


class SatelliteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[SatelliteImage]:
        return self.db.query(SatelliteImage).all()

    def create(self, image: SatelliteImage) -> SatelliteImage:
        self.db.add(image)
        self.db.commit()
        self.db.refresh(image)
        return image