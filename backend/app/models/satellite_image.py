from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class SatelliteImage(Base):
    __tablename__ = "satellite_images"

    image_id = Column(Integer, primary_key=True, index=True)
    anomaly_id = Column(Integer, ForeignKey("anomaly_events.anomaly_id"), nullable=False, unique=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    reason = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    anomaly_event = relationship("AnomalyEvent", back_populates="satellite_image")
    spill_detection = relationship(
        "SpillDetection",
        back_populates="satellite_image",
        uselist=False,
        cascade="all, delete-orphan",
    )