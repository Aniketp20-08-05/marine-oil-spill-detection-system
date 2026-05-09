from pydantic import BaseModel
from typing import Optional


class SpillDetectionBase(BaseModel):
    image_id: int
    confidence_score: float
    risk_zone_id: Optional[int] = None


class SpillDetectionCreate(SpillDetectionBase):
    pass


class SpillDetectionRead(SpillDetectionBase):
    detection_id: int

    class Config:
        from_attributes = True