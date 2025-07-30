# Smart Library System v2

A modern, microservices-based library management system built with FastAPI, React, and PostgreSQL.

## Features

- **Book Management**
  - Add, update, and delete books
  - Track book copies and availability
  - Search books by title or author
  - View book statistics

- **User Management**
  - Create and manage user accounts
  - Role-based access (student, librarian)
  - Track user statistics

- **Loan Management**
  - Issue and return books
  - Track due dates and overdue loans
  - Extend loan periods
  - View loan history and statistics

## Tech Stack

### Backend Services
- **FastAPI**: Modern, high-performance web framework
- **PostgreSQL**: Robust, scalable database
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: Lightning-fast ASGI server

### Frontend
- **React**: UI library with TypeScript
- **Material-UI**: Modern UI component library
- **Vite**: Next-generation frontend tooling
- **Axios**: HTTP client
- **Notistack**: Snackbar notifications

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy and load balancer

## System Architecture

```
                   ┌─────────────┐
                   │    Nginx    │
                   │ Reverse Proxy│
                   └──────┬──────┘
                         │
         ┌──────────────┼──────────────┐
         │              │              │
┌────────▼─────┐ ┌─────▼──────┐ ┌─────▼──────┐
│ Book Service │ │User Service │ │Loan Service │
│  (Port 8002) │ │ (Port 8004) │ │ (Port 8003) │
└──────┬───────┘ └─────┬──────┘ └─────┬──────┘
       │               │              │
┌──────▼───────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  Books DB    │ │  Users DB  │ │  Loans DB  │
│(PostgreSQL)  │ │(PostgreSQL)│ │(PostgreSQL) │
└──────────────┘ └────────────┘ └────────────┘
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Git

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-library-v2
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the services:
- Frontend: http://localhost:5174
- API Gateway: http://localhost:80

### Development Setup

1. Install backend dependencies for each service:
```bash
# From each service directory (book-service, user-service, loan-service)
pip install -r requirements.txt
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Set up PostgreSQL databases:
```bash
# Create databases: books_db, users_db, loans_db
# Run init_db.sql for each service
```

4. Start the services:
```bash
# Start backend services
cd book-service
uvicorn app.main:app --reload --port 8002

cd ../user-service
uvicorn app.main:app --reload --port 8004

cd ../loan-service
uvicorn app.main:app --reload --port 8003

# Start frontend
cd ../frontend
npm run dev
```

## API Documentation

### Book Service (Port 8002)
- `GET /api/books/` - List all books
- `GET /api/books/{book_id}` - Get book details
- `POST /api/books/` - Add new book
- `PUT /api/books/{book_id}` - Update book
- `DELETE /api/books/{book_id}` - Delete book
- `GET /api/books/verify/{book_id}/copies` - Check book availability
- `PUT /api/books/{book_id}/decrease` - Decrease available copies
- `PUT /api/books/{book_id}/increase` - Increase available copies
- `GET /api/books/stats/overview` - Get book statistics

### User Service (Port 8004)
- `POST /api/users/` - Create new user
- `GET /api/users/{user_id}` - Get user details
- `GET /api/users/verify/{user_id}` - Verify user exists
- `GET /api/users/stats/total` - Get user statistics

### Loan Service (Port 8003)
- `POST /api/loans/` - Create new loan
- `POST /api/loans/returns` - Return a book
- `PUT /api/loans/{loan_id}/extend` - Extend loan period
- `GET /api/loans/overdue` - List overdue loans
- `GET /api/loans/user/{user_id}` - Get user's loan history
- `GET /api/loans/stats` - Get loan statistics

## Environment Variables

Each service uses the following environment variables:

### Book Service
- `DATABASE_URL`: PostgreSQL connection string (default: postgresql://postgres:postgres@localhost:5432/books_db)

### User Service
- `DATABASE_URL`: PostgreSQL connection string (default: postgresql://postgres:postgres@localhost:5432/users_db)

### Loan Service
- `DATABASE_URL`: PostgreSQL connection string (default: postgresql://postgres:postgres@localhost:5432/loans_db)
- `USER_SERVICE_URL`: User service URL
- `BOOK_SERVICE_URL`: Book service URL

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
