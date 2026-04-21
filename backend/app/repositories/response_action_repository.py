from sqlalchemy.orm import Session

from app.models.response_action import ResponseAction


class ResponseActionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[ResponseAction]:
        return self.db.query(ResponseAction).all()

    def create(self, response_action: ResponseAction) -> ResponseAction:
        self.db.add(response_action)
        self.db.commit()
        self.db.refresh(response_action)
        return response_action