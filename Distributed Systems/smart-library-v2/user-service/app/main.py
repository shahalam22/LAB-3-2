from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.controllers.user_controller import UserController
from app.database import engine, get_db
from app.models import Base
from app.schemas import UserCreate, UserResponse
import uvicorn

# Create the FastAPI app
app = FastAPI(title="User Service - Smart Library System")

# Create database tables
Base.metadata.create_all(bind=engine)

@app.post("/api/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserController.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return UserController.create_user(db, user)

@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return UserController.get_user(db, user_id)

@app.get("/api/users/verify/{user_id}")
def verify_user(user_id: int, db: Session = Depends(get_db)):
    return {"exists": UserController.verify_user_exists(db, user_id)}

@app.get("/api/users/stats/total")
def get_total_users(db: Session = Depends(get_db)):
    return {"total_users": UserController.get_total_users(db)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
