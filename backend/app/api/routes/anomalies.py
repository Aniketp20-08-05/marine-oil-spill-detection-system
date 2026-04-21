from fastapi import APIRouter

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])


@router.get("/")
def get_anomalies():
    return [
        {
            "vessel_id": 1,
            "vessel_name": "MV Samudra Devi",
            "anomaly_score": 91,
            "reason": "Unexpected speed drop and route deviation",
            "latitude": 19.0760,
            "longitude": 72.8777,
            "timestamp": "2026-01-26T13:00:00Z",
        },
        {
            "vessel_id": 2,
            "vessel_name": "MT Kaveri",
            "anomaly_score": 77,
            "reason": "Prolonged unusual stop in monitored sector",
            "latitude": 18.9500,
            "longitude": 72.8100,
            "timestamp": "2026-01-26T13:05:00Z",
        },
    ]