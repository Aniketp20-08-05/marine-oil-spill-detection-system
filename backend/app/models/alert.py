from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, index=True)
    risk_zone_id = Column(Integer, ForeignKey("risk_zones.zone_id"), nullable=False)
    message = Column(String, nullable=False)
    status = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    risk_zone = relationship("RiskZone", back_populates="alerts")
    response_actions = relationship(
        "ResponseAction",
        back_populates="alert",
        cascade="all, delete-orphan",
    )