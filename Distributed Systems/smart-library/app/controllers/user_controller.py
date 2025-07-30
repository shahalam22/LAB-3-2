from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.models import User, Loan
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
    def verify_user_exists(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return True
        
    @staticmethod
    def get_active_users(db: Session):
        # Fix the case expression syntax
        return db.query(
            User.id.label("user_id"),
            User.name,
            func.count(Loan.id).label("books_borrowed"),
            # Changed from list format to positional arguments
            func.sum(case((Loan.status == "ACTIVE", 1), else_=0)).label("current_borrows")
        ).join(Loan).group_by(User.id).order_by(func.count(Loan.id).desc()).limit(10).all()
    
    @staticmethod
    def get_total_users(db: Session):
        return db.query(func.count(User.id)).scalar()