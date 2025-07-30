from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.models import User
from app.schemas import UserCreate
from fastapi import HTTPException
from datetime import datetime

class UserController:
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        db_user = User(**user.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def verify_user_exists(db: Session, user_id: int) -> bool:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return True
    
    @staticmethod
    def get_total_users(db: Session) -> int:
        return db.query(func.count(User.id)).scalar()
