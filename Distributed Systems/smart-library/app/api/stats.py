from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db
from typing import List

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/books/popular", response_model=List[schemas.PopularBookResponse])
def get_popular_books(db: Session = Depends(get_db)):
    return crud.get_popular_books(db)

@router.get("/users/active", response_model=List[schemas.ActiveUserResponse])
def get_active_users(db: Session = Depends(get_db)):
    return crud.get_active_users(db)

@router.get("/overview", response_model=schemas.OverviewResponse)
def get_overview(db: Session = Depends(get_db)):
    return crud.get_overview_stats(db)