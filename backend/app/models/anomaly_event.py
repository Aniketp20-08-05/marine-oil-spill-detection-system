from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class AnomalyEvent(Base):
    __tablename__ = "anomaly_events"

    anomaly_id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.vessel_id"), nullable=False)
    anomaly_score = Column(Float, nullable=False)
    reason = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    vessel = relationship("Vessel", back_populates="anomaly_events")
    satellite_image = relationship(
        "SatelliteImage",
        back_populates="anomaly_event",
        uselist=False,
        cascade="all, delete-orphan",
    )