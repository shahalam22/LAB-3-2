from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Loan
from app.schemas import LoanCreate, LoanReturn, LoanExtend
from app.services.service_client import ServiceClient
from fastapi import HTTPException
from datetime import datetime, timedelta

class LoanController:
    @staticmethod
    async def create_loan(db: Session, loan: LoanCreate):
        # Verify user exists and book has copies through service calls
        user_exists = await ServiceClient.verify_user(loan.user_id)
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
            
        book_has_copies = await ServiceClient.verify_book_has_copies(loan.book_id)
        if not book_has_copies:
            raise HTTPException(status_code=400, detail="No available copies")
        
        # Create the loan
        db_loan = Loan(**loan.dict())
        db.add(db_loan)
        
        # Decrease available copies through service call
        await ServiceClient.decrease_book_copies(loan.book_id)
        
        db.commit()
        db.refresh(db_loan)
        return db_loan

    @staticmethod
    async def return_book(db: Session, loan_return: LoanReturn):
        loan = db.query(Loan).filter(Loan.id == loan_return.loan_id).first()
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        if loan.status != "ACTIVE":
            raise HTTPException(status_code=400, detail="Loan is not active")
            
        loan.return_date = datetime.utcnow()
        loan.status = "RETURNED"
        
        # Increase available copies through service call
        await ServiceClient.increase_book_copies(loan.book_id)
        
        db.commit()
        db.refresh(loan)
        return loan

    @staticmethod
    async def extend_loan(db: Session, loan_id: int, loan_extend: LoanExtend):
        loan = db.query(Loan).filter(Loan.id == loan_id).first()
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        if loan.status != "ACTIVE":
            raise HTTPException(status_code=400, detail="Loan is not active")
            
        loan.due_date += timedelta(days=loan_extend.extension_days)
        loan.extensions_count += 1
        
        db.commit()
        db.refresh(loan)
        return loan

    @staticmethod
    def get_loan_history(db: Session, user_id: int):
        return db.query(Loan).filter(Loan.user_id == user_id).all()

    @staticmethod
    def get_overdue_loans(db: Session):
        return db.query(Loan).filter(
            Loan.status == "ACTIVE",
            Loan.due_date < datetime.utcnow()
        ).all()
    
    @staticmethod
    def get_loan_stats(db: Session):
        books_borrowed = db.query(func.count(Loan.id)).filter(Loan.status == "ACTIVE").scalar()
        overdue_loans = db.query(func.count(Loan.id)).filter(
            Loan.status == "ACTIVE",
            Loan.due_date < datetime.utcnow()
        ).scalar()
        
        today = datetime.utcnow().date()
        loans_today = db.query(func.count(Loan.id)).filter(
            func.date(Loan.issue_date) == today
        ).scalar()
        returns_today = db.query(func.count(Loan.id)).filter(
            func.date(Loan.return_date) == today
        ).scalar()
        
        return {
            "books_borrowed": books_borrowed,
            "overdue_loans": overdue_loans,
            "loans_today": loans_today,
            "returns_today": returns_today
        }
