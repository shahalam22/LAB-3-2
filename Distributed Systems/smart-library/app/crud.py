from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case
from app.models import User, Book, Loan
from app.schemas import UserCreate, BookCreate, BookUpdate, LoanCreate, LoanReturn, LoanExtend
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.controllers.user_controller import UserController
from app.controllers.book_controller import BookController
from app.controllers.loan_controller import LoanController
from app.services.stats_service import StatsService

# User CRUD
def create_user(db: Session, user: UserCreate):
    return UserController.create_user(db, user)

def get_user(db: Session, user_id: int):
    return UserController.get_user(db, user_id)

# Book CRUD
def create_book(db: Session, book: BookCreate):
    return BookController.create_book(db, book)

def get_book(db: Session, book_id: int):
    return BookController.get_book(db, book_id)

def update_book(db: Session, book_id: int, book_update: BookUpdate):
    return BookController.update_book(db, book_id, book_update)

def delete_book(db: Session, book_id: int):
    BookController.delete_book(db, book_id)

def search_books(db: Session, search: str):
    return BookController.search_books(db, search)

# Loan CRUD
def create_loan(db: Session, loan: LoanCreate):
    return LoanController.create_loan(db, loan)

def return_book(db: Session, loan_return: LoanReturn):
    return LoanController.return_book(db, loan_return)

def extend_loan(db: Session, loan_id: int, loan_extend: LoanExtend):
    return LoanController.extend_loan(db, loan_id, loan_extend)

def get_loan_history(db: Session, user_id: int):
    return LoanController.get_loan_history(db, user_id)

def get_overdue_loans(db: Session):
    return LoanController.get_overdue_loans(db)

# Statistics CRUD
def get_popular_books(db: Session):
    return StatsService.get_popular_books(db)

def get_active_users(db: Session):
    return StatsService.get_active_users(db)

def get_overview_stats(db: Session):
    return StatsService.get_overview_stats(db)