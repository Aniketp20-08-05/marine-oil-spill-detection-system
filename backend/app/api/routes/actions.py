from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/actions", tags=["Actions"])


class ActionRequest(BaseModel):
    action: str


@router.post("/")
def trigger_action(payload: ActionRequest):
    return {
        "success": True,
        "message": f"Action '{payload.action}' triggered successfully."
    }