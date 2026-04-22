from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.repositories.team_repository import TeamRepository
from app.schemas.team import TeamCreate, TeamRead

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.post("/", response_model=TeamRead)
def create_team(team_data: TeamCreate, db: Session = Depends(get_db)):
    """Create a new response team"""
    repo = TeamRepository(db)
    return repo.create(team_data)


@router.get("/", response_model=list[TeamRead])
def get_all_teams(db: Session = Depends(get_db)):
    """Get all active teams"""
    repo = TeamRepository(db)
    return repo.get_all()


@router.get("/{team_id}", response_model=TeamRead)
def get_team(team_id: int, db: Session = Depends(get_db)):
    """Get a specific team"""
    repo = TeamRepository(db)
    team = repo.get_by_id(team_id)
    if not team:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Team not found")
    return team
