from sqlalchemy import Column, Float, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Vessel(Base):
    __tablename__ = "vessels"

    vessel_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    imo_number = Column(String, unique=True, nullable=False, index=True)
    type = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    sog = Column(Float, nullable=True)
    cog = Column(Float, nullable=True)
    heading = Column(Float, nullable=True)
    destination = Column(String, nullable=True)

    ais_records = relationship("AISRecord", back_populates="vessel", cascade="all, delete-orphan")
    anomaly_events = relationship("AnomalyEvent", back_populates="vessel", cascade="all, delete-orphan")