from sqlalchemy.orm import Session

from app.repositories.response_action_repository import ResponseActionRepository
from app.schemas.response_action import ResponseActionCreate, ResponseActionRead
from app.services.response.team_notification_service import TeamNotificationService


class ResponseActionService:
    def __init__(self, db: Session):
        self.repository = ResponseActionRepository(db)
        self.team_notifier = TeamNotificationService(db)
        self.db = db

    def trigger_response_action(
        self, alert_id: int, action_type: str, triggered_by: str = "system"
    ) -> dict:
        """Trigger a new response action and notify relevant teams"""
        action_data = ResponseActionCreate(
            alert_id=alert_id,
            action_type=action_type,
            status="executing",
            triggered_by=triggered_by,
            description=f"Action: {action_type}",
        )
        response_action = self.repository.create(action_data)

        # Send notifications to relevant teams
        team_notifications = self.team_notifier.notify_teams_for_action(
            action_id=response_action.action_id, action_type=action_type, alert_id=alert_id
        )

        return {
            "action": ResponseActionRead.model_validate(response_action),
            "team_notifications": team_notifications,
        }

    def get_actions_for_alert(self, alert_id: int) -> list[ResponseActionRead]:
        """Get all response actions for an alert"""
        actions = self.repository.get_by_alert(alert_id)
        return [ResponseActionRead.model_validate(action) for action in actions]

    def get_all_actions(self) -> list[ResponseActionRead]:
        """Get all response actions"""
        actions = self.repository.get_all()
        return [ResponseActionRead.model_validate(action) for action in actions]

    def update_action_status(self, action_id: int, status: str) -> ResponseActionRead | None:
        """Update status of a response action"""
        action = self.repository.update_status(action_id, status)
        if action:
            return ResponseActionRead.model_validate(action)
        return None