from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Book, Loan
from app.schemas import BookCreate, BookUpdate
from fastapi import HTTPException
from datetime import datetime

class BookController:
    @staticmethod
    def create_book(db: Session, book: BookCreate):
        db_book = Book(**book.dict(), available_copies=book.copies)
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book

    @staticmethod
    def get_book(db: Session, book_id: int):
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        return book

    @staticmethod
    def update_book(db: Session, book_id: int, book_update: BookUpdate):
        db_book = BookController.get_book(db, book_id)
        update_data = book_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_book, key, value)
        db.commit()
        db.refresh(db_book)
        return db_book

    @staticmethod
    def delete_book(db: Session, book_id: int):
        db_book = BookController.get_book(db, book_id)
        db.delete(db_book)
        db.commit()

    @staticmethod
    def search_books(db: Session, search: str):
        return db.query(Book).filter(
            Book.title.ilike(f"%{search}%") |
            Book.author.ilike(f"%{search}%") |
            Book.isbn.ilike(f"%{search}%")
        ).all()
    
    @staticmethod
    def verify_book_has_copies(db: Session, book_id: int):
        book = BookController.get_book(db, book_id)
        if book.available_copies < 1:
            raise HTTPException(status_code=400, detail="No available copies")
        return book
        
    @staticmethod
    def decrease_available_copies(db: Session, book_id: int):
        book = BookController.get_book(db, book_id)
        book.available_copies -= 1
        db.commit()
        db.refresh(book)
        return book
        
    @staticmethod
    def increase_available_copies(db: Session, book_id: int):
        book = BookController.get_book(db, book_id)
        book.available_copies += 1
        db.commit()
        db.refresh(book)
        return book
    
    @staticmethod
    def get_popular_books(db: Session):
        return db.query(
            Book.id.label("book_id"),
            Book.title,
            Book.author,
            func.count(Loan.id).label("borrow_count")
        ).join(Loan).group_by(Book.id).order_by(func.count(Loan.id).desc()).limit(10).all()
    
    @staticmethod
    def get_books_stats(db: Session):
        total_books = db.query(func.count(Book.id)).scalar()
        books_available = db.query(func.sum(Book.available_copies)).scalar()
        return {
            "total_books": total_books,
            "books_available": books_available
        }