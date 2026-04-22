from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_notification import TeamNotification
from app.schemas.team import TeamCreate


class TeamRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Team]:
        return self.db.query(Team).filter(Team.is_active == "active").all()

    def get_by_id(self, team_id: int) -> Team | None:
        return self.db.query(Team).filter(Team.team_id == team_id).first()

    def get_by_name(self, name: str) -> Team | None:
        return self.db.query(Team).filter(Team.name == name).first()

    def create(self, team_data: TeamCreate) -> Team:
        team = Team(**team_data.model_dump())
        self.db.add(team)
        self.db.commit()
        self.db.refresh(team)
        return team


class TeamNotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self, action_id: int, team_id: int, message: str, delivery_method: str
    ) -> TeamNotification:
        notification = TeamNotification(
            action_id=action_id,
            team_id=team_id,
            message=message,
            delivery_method=delivery_method,
            status="sent",
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def get_by_action(self, action_id: int) -> list[TeamNotification]:
        return (
            self.db.query(TeamNotification)
            .filter(TeamNotification.action_id == action_id)
            .all()
        )
