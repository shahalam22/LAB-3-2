from fastapi import FastAPI
from app.api import users, books, loans, stats
from app.database import engine
from app.models import Base

app = FastAPI(title="Smart Library System")

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router)
app.include_router(books.router)
app.include_router(loans.router)
app.include_router(stats.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Library System"}