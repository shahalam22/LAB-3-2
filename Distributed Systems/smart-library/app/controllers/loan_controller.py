from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Loan
from app.schemas import LoanCreate, LoanReturn, LoanExtend
from app.controllers.user_controller import UserController
from app.controllers.book_controller import BookController
from fastapi import HTTPException
from datetime import datetime, timedelta

class LoanController:
    @staticmethod
    def create_loan(db: Session, loan: LoanCreate):
        # Verify book has copies and update available copies
        book = BookController.verify_book_has_copies(db, loan.book_id)
        # Verify user exists
        UserController.verify_user_exists(db, loan.user_id)
        
        # Create the loan
        db_loan = Loan(**loan.dict())
        db.add(db_loan)
        
        # Decrease available copies
        BookController.decrease_available_copies(db, loan.book_id)
        
        db.commit()
        db.refresh(db_loan)
        return db_loan

    @staticmethod
    def return_book(db: Session, loan_return: LoanReturn):
        loan = db.query(Loan).filter(Loan.id == loan_return.loan_id).first()
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        if loan.status != "ACTIVE":
            raise HTTPException(status_code=400, detail="Loan is not active")
            
        loan.return_date = datetime.utcnow()
        loan.status = "RETURNED"
        
        # Increase available copies
        BookController.increase_available_copies(db, loan.book_id)
        
        db.commit()
        db.refresh(loan)
        return loan

    @staticmethod
    def extend_loan(db: Session, loan_id: int, loan_extend: LoanExtend):
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
        # Verify user exists
        UserController.verify_user_exists(db, user_id)
        return db.query(Loan).filter(Loan.user_id == user_id).all()

    @staticmethod
    def get_overdue_loans(db: Session):
        loans = db.query(Loan).filter(
            Loan.status == "ACTIVE",
            Loan.due_date < datetime.utcnow()
        ).all()
        
        # Make sure all relationship data is loaded
        for loan in loans:
            db.refresh(loan)
        
        return loans
    
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