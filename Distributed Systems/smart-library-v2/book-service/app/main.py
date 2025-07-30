from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.controllers.book_controller import BookController
from app.database import engine, get_db
from app.models import Base
from app.schemas import BookCreate, BookUpdate, BookResponse
from typing import List
import uvicorn

# Create the FastAPI app
app = FastAPI(title="Book Service - Smart Library System")

# Create database tables
Base.metadata.create_all(bind=engine)

@app.post("/api/books/", response_model=BookResponse)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    return BookController.create_book(db, book)

@app.get("/api/books/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    return BookController.get_book(db, book_id)

@app.put("/api/books/{book_id}", response_model=BookResponse)
def update_book(book_id: int, book: BookUpdate, db: Session = Depends(get_db)):
    return BookController.update_book(db, book_id, book)

@app.delete("/api/books/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    BookController.delete_book(db, book_id)
    return None

@app.get("/api/books/", response_model=List[BookResponse])
def search_books(search: str = "", db: Session = Depends(get_db)):
    return BookController.search_books(db, search)

@app.get("/api/books/verify/{book_id}/copies")
def verify_book_copies(book_id: int, db: Session = Depends(get_db)):
    book = BookController.verify_book_has_copies(db, book_id)
    return {"has_copies": book.available_copies > 0}

@app.put("/api/books/{book_id}/decrease")
def decrease_copies(book_id: int, db: Session = Depends(get_db)):
    return BookController.decrease_available_copies(db, book_id)

@app.put("/api/books/{book_id}/increase")
def increase_copies(book_id: int, db: Session = Depends(get_db)):
    return BookController.increase_available_copies(db, book_id)

@app.get("/api/books/stats/overview")
def get_books_stats(db: Session = Depends(get_db)):
    return BookController.get_books_stats(db)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
