from fastapi import APIRouter

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/")
def get_alerts():
    return [
        {
            "id": 1,
            "message": "Possible oil spill detected near Sector A",
            "status": "sent",
            "time": "13:10 UTC",
        },
        {
            "id": 2,
            "message": "Anomalous vessel movement detected: MT Kaveri",
            "status": "sent",
            "time": "13:12 UTC",
        },
    ]