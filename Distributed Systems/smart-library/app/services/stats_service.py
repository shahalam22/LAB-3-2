from sqlalchemy.orm import Session
from app.controllers.user_controller import UserController
from app.controllers.book_controller import BookController
from app.controllers.loan_controller import LoanController

class StatsService:
    @staticmethod
    def get_overview_stats(db: Session):
        # Get stats from each controller
        book_stats = BookController.get_books_stats(db)
        loan_stats = LoanController.get_loan_stats(db)
        total_users = UserController.get_total_users(db)
        
        # Combine all stats
        return {
            "total_books": book_stats["total_books"],
            "total_users": total_users,
            "books_available": book_stats["books_available"],
            "books_borrowed": loan_stats["books_borrowed"],
            "overdue_loans": loan_stats["overdue_loans"],
            "loans_today": loan_stats["loans_today"],
            "returns_today": loan_stats["returns_today"]
        }
        
    @staticmethod
    def get_popular_books(db: Session):
        return BookController.get_popular_books(db)
    
    @staticmethod
    def get_active_users(db: Session):
        return UserController.get_active_users(db)