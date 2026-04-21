from sqlalchemy import Column, Float, Integer
from sqlalchemy.orm import relationship

from app.db.session import Base


class RiskZone(Base):
    __tablename__ = "risk_zones"

    zone_id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)

    spill_detections = relationship("SpillDetection", back_populates="risk_zone")
    alerts = relationship("Alert", back_populates="risk_zone")