from pydantic import BaseModel


class SpillDetectionBase(BaseModel):
    image_id: int
    confidence_score: float
    risk_zone_id: int | None = None


class SpillDetectionCreate(SpillDetectionBase):
    pass


class SpillDetectionRead(SpillDetectionBase):
    detection_id: int

    class Config:
        from_attributes = True