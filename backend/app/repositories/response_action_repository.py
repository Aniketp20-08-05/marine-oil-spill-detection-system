from sqlalchemy.orm import Session

from app.models.response_action import ResponseAction
from app.schemas.response_action import ResponseActionCreate


class ResponseActionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[ResponseAction]:
        return self.db.query(ResponseAction).all()

    def get_by_alert(self, alert_id: int) -> list[ResponseAction]:
        return self.db.query(ResponseAction).filter(ResponseAction.alert_id == alert_id).all()

    def get_by_id(self, action_id: int) -> ResponseAction | None:
        return self.db.query(ResponseAction).filter(ResponseAction.action_id == action_id).first()

    def create(self, action_data: ResponseActionCreate) -> ResponseAction:
        response_action = ResponseAction(
            alert_id=action_data.alert_id,
            action_type=action_data.action_type,
            status=action_data.status,
            description=action_data.description,
            triggered_by=action_data.triggered_by,
        )
        self.db.add(response_action)
        self.db.commit()
        self.db.refresh(response_action)
        return response_action

    def update_status(self, action_id: int, status: str) -> ResponseAction | None:
        action = self.get_by_id(action_id)
        if action:
            action.status = status
            self.db.commit()
            self.db.refresh(action)
        return action