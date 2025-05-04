from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db
from typing import List

router = APIRouter(prefix="/api/books", tags=["books"])

@router.post("/", response_model=schemas.BookResponse)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_book(db, book)
    except:
        raise HTTPException(status_code=400, detail="ISBN already exists")

@router.get("/{id}", response_model=schemas.BookResponse)
def get_book(id: int, db: Session = Depends(get_db)):
    return crud.get_book(db, id)

@router.put("/{id}", response_model=schemas.BookResponse)
def update_book(id: int, book: schemas.BookUpdate, db: Session = Depends(get_db)):
    return crud.update_book(db, id, book)

@router.delete("/{id}", status_code=204)
def delete_book(id: int, db: Session = Depends(get_db)):
    crud.delete_book(db, id)
    return None

@router.get("/", response_model=List[schemas.BookResponse])
def search_books(search: str = "", db: Session = Depends(get_db)):
    return crud.search_books(db, search)