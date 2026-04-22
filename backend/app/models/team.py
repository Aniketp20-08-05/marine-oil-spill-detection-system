from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String
from app.db.session import Base


class Team(Base):
    __tablename__ = "teams"

    team_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Coast Guard, Oil Boom Team, etc.
    telegram_chat_id = Column(String, nullable=True)
    email = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    location = Column(String, nullable=True)
    is_active = Column(String, default="active", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
