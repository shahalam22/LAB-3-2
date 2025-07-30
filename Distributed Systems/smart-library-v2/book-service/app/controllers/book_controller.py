from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Book
from app.schemas import BookCreate, BookUpdate
from fastapi import HTTPException
from datetime import datetime

class BookController:    
    @staticmethod
    def create_book(db: Session, book: BookCreate):
        try:
            # First check if book with ISBN already exists
            existing_book = db.query(Book).filter(Book.isbn == book.isbn).first()
            if existing_book:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Book with ISBN {book.isbn} already exists"
                )

            book_data = {
                "title": book.title,
                "author": book.author,
                "isbn": book.isbn,
                "copies": book.copies,
                "available_copies": book.copies,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            db_book = Book(**book_data)
            db.add(db_book)
            db.commit()
            db.refresh(db_book)
            return db_book
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Book with ISBN {book.isbn} already exists"
            )
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def get_book(db: Session, book_id: int):
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        return book

    @staticmethod
    def update_book(db: Session, book_id: int, book: BookUpdate):
        db_book = BookController.get_book(db, book_id)
        for key, value in book.dict(exclude_unset=True).items():
            setattr(db_book, key, value)
        db.commit()
        db.refresh(db_book)
        return db_book

    @staticmethod
    def delete_book(db: Session, book_id: int):
        book = BookController.get_book(db, book_id)
        db.delete(book)
        db.commit()

    @staticmethod
    def search_books(db: Session, search: str):
        query = db.query(Book)
        if search:
            search = f"%{search}%"
            query = query.filter(Book.title.ilike(search) | Book.author.ilike(search))
        return query.all()

    @staticmethod
    def verify_book_has_copies(db: Session, book_id: int):
        return BookController.get_book(db, book_id)

    @staticmethod
    def decrease_available_copies(db: Session, book_id: int):
        book = BookController.get_book(db, book_id)
        if book.available_copies <= 0:
            raise HTTPException(status_code=400, detail="No copies available")
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
    def get_books_stats(db: Session):
        total_books = db.query(Book).count()
        available_books = db.query(Book).filter(Book.available_copies > 0).count()
        return {
            "total_books": total_books,
            "available_books": available_books,
            "borrowed_books": total_books - available_books
        }