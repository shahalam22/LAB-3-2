from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.controllers.loan_controller import LoanController
from app.database import engine, get_db
from app.models import Base
from app.schemas import LoanCreate, LoanReturn, LoanExtend, LoanResponse
from typing import List
import uvicorn

# Create the FastAPI app
app = FastAPI(title="Loan Service - Smart Library System")

# Create database tables
Base.metadata.create_all(bind=engine)

@app.post("/api/loans/", response_model=LoanResponse)
async def create_loan(loan: LoanCreate, db: Session = Depends(get_db)):
    return await LoanController.create_loan(db, loan)

@app.post("/api/loans/returns", response_model=LoanResponse)
async def return_book(loan_return: LoanReturn, db: Session = Depends(get_db)):
    return await LoanController.return_book(db, loan_return)

@app.put("/api/loans/{loan_id}/extend", response_model=LoanResponse)
async def extend_loan(loan_id: int, loan_extend: LoanExtend, db: Session = Depends(get_db)):
    return await LoanController.extend_loan(db, loan_id, loan_extend)

@app.get("/api/loans/overdue", response_model=List[LoanResponse])
def get_overdue_loans(db: Session = Depends(get_db)):
    return LoanController.get_overdue_loans(db)

@app.get("/api/loans/user/{user_id}", response_model=List[LoanResponse])
def get_loan_history(user_id: int, db: Session = Depends(get_db)):
    return LoanController.get_loan_history(db, user_id)

@app.get("/api/loans/stats")
def get_loan_stats(db: Session = Depends(get_db)):
    return LoanController.get_loan_stats(db)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
