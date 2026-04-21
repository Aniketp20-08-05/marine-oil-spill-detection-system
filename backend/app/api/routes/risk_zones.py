from fastapi import APIRouter

router = APIRouter(prefix="/risk-zones", tags=["Risk Zones"])


@router.get("/")
def get_risk_zones():
    return [
        {
            "id": 1,
            "latitude": 19.0200,
            "longitude": 72.8400,
            "risk_score": 82,
            "zone_type": "spill_suspected",
        },
        {
            "id": 2,
            "latitude": 18.9100,
            "longitude": 72.7600,
            "risk_score": 68,
            "zone_type": "high_risk",
        },
    ]