from sqlalchemy import Column, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.session import Base


class SpillDetection(Base):
    __tablename__ = "spill_detections"

    detection_id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("satellite_images.image_id"), nullable=False, unique=True)
    confidence_score = Column(Float, nullable=False)
    risk_zone_id = Column(Integer, ForeignKey("risk_zones.zone_id"), nullable=True)

    satellite_image = relationship("SatelliteImage", back_populates="spill_detection")
    risk_zone = relationship("RiskZone", back_populates="spill_detections")