from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "backend",
        "message": "Marine Oil Spill Detection System API is healthy"
    }