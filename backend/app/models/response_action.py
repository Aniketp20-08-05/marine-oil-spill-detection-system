from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class ResponseAction(Base):
    __tablename__ = "response_actions"

    action_id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.alert_id"), nullable=False)
    action_type = Column(String, nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending, executing, completed, failed
    description = Column(String, nullable=True)
    triggered_by = Column(String, default="system", nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    alert = relationship("Alert", back_populates="response_actions")