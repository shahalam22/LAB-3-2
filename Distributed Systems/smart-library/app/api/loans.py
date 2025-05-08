from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db
from typing import List

router = APIRouter(prefix="/api/loans", tags=["loans"])

@router.post("/", response_model=schemas.LoanResponse)
def create_loan(loan: schemas.LoanCreate, db: Session = Depends(get_db)):
    return crud.create_loan(db, loan)

@router.post("/returns", response_model=schemas.LoanResponse)
def return_book(loan_return: schemas.LoanReturn, db: Session = Depends(get_db)):
    return crud.return_book(db, loan_return)

@router.put("/{id}/extend", response_model=schemas.LoanResponse)
def extend_loan(id: int, loan_extend: schemas.LoanExtend, db: Session = Depends(get_db)):
    return crud.extend_loan(db, id, loan_extend)

# IMPORTANT: Specific paths like "/overdue" must come BEFORE parameter routes like "/{user_id}"
@router.get("/overdue", response_model=List[schemas.LoanResponse])
def get_overdue_loans(db: Session = Depends(get_db)):
    return crud.get_overdue_loans(db)

@router.get("/{user_id}", response_model=List[schemas.LoanHistoryResponse])
def get_loan_history(user_id: int, db: Session = Depends(get_db)):
    return crud.get_loan_history(db, user_id)