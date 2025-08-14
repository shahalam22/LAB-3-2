#!/usr/bin/env python3
"""
Loan Service API Tests
Tests all endpoints for the Loan Service running on port 8003
"""

import requests
import json
from datetime import datetime, timedelta
import asyncio

BASE_URL = "http://localhost"

def create_test_data():
    """Create test user and book data for loan testing"""
    print("Setting up test data...")
    
    # Create a test user
    user_data = {
        "name": "Loan Test User",
        "email": f"loantest_{datetime.now().timestamp()}@example.com",
        "role": "student"
    }
    
    user_response = requests.post("http://localhost/api/users/", json=user_data)
    if user_response.status_code != 200:
        print("Warning: Could not create test user. Using user_id=1")
        user_id = 1
    else:
        user_id = user_response.json()['id']
        print(f"Created test user with ID: {user_id}")
    
    # Create a test book
    book_data = {
        "title": "Loan Test Book",
        "author": "Test Author",
        "isbn": f"978-{int(datetime.now().timestamp())}",
        "copies": 3
    }
    
    book_response = requests.post("http://localhost/api/books/", json=book_data)
    if book_response.status_code != 200:
        print("Warning: Could not create test book. Using book_id=1")
        book_id = 1
    else:
        book_id = book_response.json()['id']
        print(f"Created test book with ID: {book_id}")
    
    return user_id, book_id

def test_create_loan(user_id, book_id):
    """Test creating a new loan"""
    print("Testing: POST /api/loans/")
    
    # Set due date to 14 days from now
    due_date = (datetime.now() + timedelta(days=14)).isoformat()
    
    loan_data = {
        "user_id": user_id,
        "book_id": book_id,
        "due_date": due_date
    }
    
    response = requests.post(f"{BASE_URL}/api/loans/", json=loan_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return response.json()['id']
    else:
        print(f"Error: {response.text}")
        return None

def test_get_loan_history(user_id):
    """Test getting loan history for a user"""
    print(f"\nTesting: GET /api/loans/user/{user_id}")
    
    response = requests.get(f"{BASE_URL}/api/loans/user/{user_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        loans = response.json()
        print(f"Found {len(loans)} loans for user {user_id}")
        if loans:
            print(f"Sample loan: {loans[0]}")
    else:
        print(f"Error: {response.text}")

def test_extend_loan(loan_id):
    """Test extending a loan"""
    print(f"\nTesting: PUT /api/loans/{loan_id}/extend")
    
    extend_data = {
        "extension_days": 7
    }
    
    response = requests.put(f"{BASE_URL}/api/loans/{loan_id}/extend", json=extend_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_return_book(loan_id):
    """Test returning a book"""
    print(f"\nTesting: POST /api/loans/returns")
    
    return_data = {
        "loan_id": loan_id
    }
    
    response = requests.post(f"{BASE_URL}/api/loans/returns", json=return_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_get_overdue_loans():
    """Test getting overdue loans"""
    print("\nTesting: GET /api/loans/overdue")
    
    response = requests.get(f"{BASE_URL}/api/loans/overdue")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        overdue_loans = response.json()
        print(f"Found {len(overdue_loans)} overdue loans")
        if overdue_loans:
            print(f"Sample overdue loan: {overdue_loans[0]}")
    else:
        print(f"Error: {response.text}")

def test_get_loan_stats():
    """Test getting loan statistics"""
    print("\nTesting: GET /api/loans/stats")
    
    response = requests.get(f"{BASE_URL}/api/loans/stats")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_create_overdue_loan(user_id, book_id):
    """Test creating a loan that will be overdue (for testing overdue functionality)"""
    print("\nTesting: Creating overdue loan")
    
    # Set due date to yesterday
    due_date = (datetime.now() - timedelta(days=1)).isoformat()
    
    loan_data = {
        "user_id": user_id,
        "book_id": book_id,
        "due_date": due_date
    }
    
    response = requests.post(f"{BASE_URL}/api/loans/", json=loan_data)
    print(f"Overdue loan creation - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Created overdue loan: {response.json()}")
        return response.json()['id']
    else:
        print(f"Error: {response.text}")
        return None

def test_multiple_extensions(loan_id):
    """Test multiple extensions on a loan"""
    print(f"\nTesting: Multiple extensions for loan {loan_id}")
    
    for i in range(3):
        extend_data = {"extension_days": 5}
        response = requests.put(f"{BASE_URL}/api/loans/{loan_id}/extend", json=extend_data)
        print(f"Extension {i+1} - Status: {response.status_code}")
        if response.status_code == 200:
            loan_data = response.json()
            print(f"Extensions count: {loan_data.get('extensions_count', 'N/A')}")
        else:
            print(f"Extension {i+1} failed: {response.text}")
            break

def test_invalid_operations():
    """Test various invalid operations"""
    print("\nTesting: Invalid operations")
    
    # Try to create loan with invalid user
    print("1. Creating loan with invalid user_id:")
    loan_data = {
        "user_id": 99999,
        "book_id": 1,
        "due_date": (datetime.now() + timedelta(days=14)).isoformat()
    }
    response = requests.post(f"{BASE_URL}/api/loans/", json=loan_data)
    print(f"Status: {response.status_code} (Expected: 400 or 404)")
    
    # Try to create loan with invalid book
    print("\n2. Creating loan with invalid book_id:")
    loan_data = {
        "user_id": 1,
        "book_id": 99999,
        "due_date": (datetime.now() + timedelta(days=14)).isoformat()
    }
    response = requests.post(f"{BASE_URL}/api/loans/", json=loan_data)
    print(f"Status: {response.status_code} (Expected: 400 or 404)")
    
    # Try to return non-existent loan
    print("\n3. Returning non-existent loan:")
    return_data = {"loan_id": 99999}
    response = requests.post(f"{BASE_URL}/api/loans/returns", json=return_data)
    print(f"Status: {response.status_code} (Expected: 404)")
    
    # Try to extend non-existent loan
    print("\n4. Extending non-existent loan:")
    extend_data = {"extension_days": 7}
    response = requests.put(f"{BASE_URL}/api/loans/99999/extend", json=extend_data)
    print(f"Status: {response.status_code} (Expected: 404)")

def run_all_tests():
    """Run all loan service tests"""
    print("=" * 50)
    print("LOAN SERVICE API TESTS")
    print("=" * 50)
    
    try:
        # Setup test data
        user_id, book_id = create_test_data()
        
        # Test creating a loan
        loan_id = test_create_loan(user_id, book_id)
        if not loan_id:
            print("Failed to create loan. Some tests may be limited.")
        
        # Test other endpoints
        test_get_loan_history(user_id)
        test_get_loan_stats()
        test_get_overdue_loans()
        
        if loan_id:
            # Test loan operations
            test_extend_loan(loan_id)
            test_multiple_extensions(loan_id)
            test_return_book(loan_id)
        
        # Create an overdue loan for testing
        overdue_loan_id = test_create_overdue_loan(user_id, book_id)
        if overdue_loan_id:
            print(f"Created overdue loan with ID: {overdue_loan_id}")
            test_get_overdue_loans()  # Should now show the overdue loan
        
        # Test invalid operations
        test_invalid_operations()
        
        print(f"\n✓ Test completed with user_id: {user_id}, book_id: {book_id}")
        print("Note: Test data remains in the database for further testing")
        
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to services. Make sure all services are running:")
        print("- All services should be accessible through nginx on port 80")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_all_tests()