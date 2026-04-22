from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.response.response_action_service import ResponseActionService
from app.schemas.response_action import ResponseActionRead

router = APIRouter(prefix="/actions", tags=["Actions"])


class ActionTriggerRequest(BaseModel):
    alert_id: int
    action_type: str
    triggered_by: str = "system"


class ActionStatusUpdate(BaseModel):
    status: str


class ActionTriggerResponse(BaseModel):
    action: ResponseActionRead
    team_notifications: list[dict]


@router.post("/", response_model=ActionTriggerResponse)
def trigger_action(payload: ActionTriggerRequest, db: Session = Depends(get_db)):
    """Trigger a new response action and notify teams"""
    print(f"DEBUG: Triggering action {payload.action_type} for alert {payload.alert_id}")
    service = ResponseActionService(db)
    return service.trigger_response_action(
        alert_id=payload.alert_id,
        action_type=payload.action_type,
        triggered_by=payload.triggered_by,
    )


@router.get("/", response_model=list[ResponseActionRead])
def get_all_actions(db: Session = Depends(get_db)):
    """Get all response actions"""
    service = ResponseActionService(db)
    return service.get_all_actions()


@router.get("/alert/{alert_id}", response_model=list[ResponseActionRead])
def get_actions_by_alert(alert_id: int, db: Session = Depends(get_db)):
    """Get all response actions for a specific alert"""
    service = ResponseActionService(db)
    return service.get_actions_for_alert(alert_id)


@router.patch("/{action_id}", response_model=ResponseActionRead)
def update_action_status(
    action_id: int, payload: ActionStatusUpdate, db: Session = Depends(get_db)
):
    """Update the status of a response action"""
    service = ResponseActionService(db)
    action = service.update_action_status(action_id, payload.status)
    if not action:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Action not found")
    return action