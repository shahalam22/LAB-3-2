from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case
from app.models import User, Book, Loan
from app.schemas import UserCreate, BookCreate, BookUpdate, LoanCreate, LoanReturn, LoanExtend
from datetime import datetime, timedelta
from fastapi import HTTPException

# User CRUD
def create_user(db: Session, user: UserCreate):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Book CRUD
def create_book(db: Session, book: BookCreate):
    db_book = Book(**book.dict(), available_copies=book.copies)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_book(db: Session, book_id: int):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

def update_book(db: Session, book_id: int, book_update: BookUpdate):
    db_book = get_book(db, book_id)
    update_data = book_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int):
    db_book = get_book(db, book_id)
    db.delete(db_book)
    db.commit()

def search_books(db: Session, search: str):
    return db.query(Book).filter(
        Book.title.ilike(f"%{search}%") |
        Book.author.ilike(f" % {search} % ") |
        Book.isbn.ilike(f"%{search}%")
    ).all()

# Loan CRUD
def create_loan(db: Session, loan: LoanCreate):
    book = get_book(db, loan.book_id)
    if book.available_copies < 1:
        raise HTTPException(status_code=400, detail="No available copies")
    get_user(db, loan.user_id)  # Validate user exists
    db_loan = Loan(**loan.dict())
    book.available_copies -= 1
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def return_book(db: Session, loan_return: LoanReturn):
    loan = db.query(Loan).filter(Loan.id == loan_return.loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Loan is not active")
    loan.return_date = datetime.utcnow()
    loan.status = "RETURNED"
    book = get_book(db, loan.book_id)
    book.available_copies += 1
    db.commit()
    db.refresh(loan)
    return loan

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

def get_loan_history(db: Session, user_id: int):
    return db.query(Loan).filter(Loan.user_id == user_id).all()

def get_overdue_loans(db: Session):
    return db.query(Loan).filter(
        Loan.status == "ACTIVE",
        Loan.due_date < datetime.utcnow()
    ).all()

# Statistics CRUD
def get_popular_books(db: Session):
    return db.query(
        Book.id.label("book_id"),
        Book.title,
        Book.author,
        func.count(Loan.id).label("borrow_count")
    ).join(Loan).group_by(Book.id).order_by(func.count(Loan.id).desc()).limit(10).all()

def get_active_users(db: Session):
    return db.query(
        User.id.label("user_id"),
        User.name,
        func.count(Loan.id).label("books_borrowed"),
        func.sum(case([(Loan.status == "ACTIVE", 1)], else_=0)).label("current_borrows")
    ).join(Loan).group_by(User.id).order_by(func.count(Loan.id).desc()).limit(10).all()

def get_overview_stats(db: Session):
    total_books = db.query(func.count(Book.id)).scalar()
    total_users = db.query(func.count(User.id)).scalar()
    books_available = db.query(func.sum(Book.available_copies)).scalar()
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
        "total_books": total_books,
        "total_users": total_users,
        "books_available": books_available,
        "books_borrowed": books_borrowed,
        "overdue_loans": overdue_loans,
        "loans_today": loans_today,
        "returns_today": returns_today
    }