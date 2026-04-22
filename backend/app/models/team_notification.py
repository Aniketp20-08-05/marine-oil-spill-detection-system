from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class TeamNotification(Base):
    __tablename__ = "team_notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, ForeignKey("response_actions.action_id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.team_id"), nullable=False)
    message = Column(String, nullable=False)
    status = Column(String, default="sent", nullable=False)  # sent, pending, failed, delivered
    delivery_method = Column(String, nullable=False)  # sms, email, push
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    action = relationship("ResponseAction")
    team = relationship("Team")
