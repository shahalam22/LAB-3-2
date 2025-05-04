from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        orm_mode = True

# Book Schemas
class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str
    copies: int

class BookUpdate(BaseModel):
    copies: Optional[int]
    available_copies: Optional[int]

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    isbn: str
    copies: int
    available_copies: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Loan Schemas
class LoanCreate(BaseModel):
    user_id: int
    book_id: int
    due_date: datetime

class LoanReturn(BaseModel):
    loan_id: int

class LoanExtend(BaseModel):
    extension_days: int

class LoanResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    issue_date: datetime
    due_date: datetime
    return_date: Optional[datetime]
    status: str
    extensions_count: int

    class Config:
        orm_mode = True

class LoanHistoryResponse(BaseModel):
    id: int
    book: BookResponse
    issue_date: datetime
    due_date: datetime
    return_date: Optional[datetime]
    status: str

    class Config:
        orm_mode = True

# Statistics Schemas
class PopularBookResponse(BaseModel):
    book_id: int
    title: str
    author: str
    borrow_count: int

class ActiveUserResponse(BaseModel):
    user_id: int
    name: str
    books_borrowed: int
    current_borrows: int

class OverviewResponse(BaseModel):
    total_books: int
    total_users: int
    books_available: int
    books_borrowed: int
    overdue_loans: int
    loans_today: int
    returns_today: int