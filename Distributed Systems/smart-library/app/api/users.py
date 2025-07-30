from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.controllers.user_controller import UserController
from app.database import get_db

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        return UserController.create_user(db, user)
    except:
        raise HTTPException(status_code=400, detail="Email already registered")

@router.get("/{id}", response_model=schemas.UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    return UserController.get_user(db, id)