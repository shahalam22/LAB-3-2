#!/usr/bin/env python3
"""
Book Service API Tests
Tests all endpoints for the Book Service running on port 8002
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost"

def test_create_book():
    """Test creating a new book"""
    print("Testing: POST /api/books/")
    
    book_data = {
        "title": "Test Book",
        "author": "Test Author",
        "isbn": "978-1234567890",
        "copies": 5
    }
    
    response = requests.post(f"{BASE_URL}/api/books/", json=book_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return response.json()['id']
    else:
        print(f"Error: {response.text}")
        return None

def test_get_book(book_id):
    """Test getting a book by ID"""
    print(f"\nTesting: GET /api/books/{book_id}")
    
    response = requests.get(f"{BASE_URL}/api/books/{book_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_search_books():
    """Test searching books"""
    print("\nTesting: GET /api/books/ (search)")
    
    # Search with query
    response = requests.get(f"{BASE_URL}/api/books/?search=Test")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Search results: {len(response.json())} books found")
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")
    
    # Get all books
    response = requests.get(f"{BASE_URL}/api/books/")
    print(f"\nAll books - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Total books: {len(response.json())}")

def test_update_book(book_id):
    """Test updating a book"""
    print(f"\nTesting: PUT /api/books/{book_id}")
    
    update_data = {
        "copies": 10
    }
    
    response = requests.put(f"{BASE_URL}/api/books/{book_id}", json=update_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_verify_book_copies(book_id):
    """Test verifying book copies"""
    print(f"\nTesting: GET /api/books/verify/{book_id}/copies")
    
    response = requests.get(f"{BASE_URL}/api/books/verify/{book_id}/copies")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_decrease_copies(book_id):
    """Test decreasing book copies"""
    print(f"\nTesting: PUT /api/books/{book_id}/decrease")
    
    response = requests.put(f"{BASE_URL}/api/books/{book_id}/decrease")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_increase_copies(book_id):
    """Test increasing book copies"""
    print(f"\nTesting: PUT /api/books/{book_id}/increase")
    
    response = requests.put(f"{BASE_URL}/api/books/{book_id}/increase")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_books_stats():
    """Test getting book statistics"""
    print("\nTesting: GET /api/books/stats/overview")
    
    response = requests.get(f"{BASE_URL}/api/books/stats/overview")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_delete_book(book_id):
    """Test deleting a book"""
    print(f"\nTesting: DELETE /api/books/{book_id}")
    
    response = requests.delete(f"{BASE_URL}/api/books/{book_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 204:
        print("Book deleted successfully")
    else:
        print(f"Error: {response.text}")

def run_all_tests():
    """Run all book service tests"""
    print("=" * 50)
    print("BOOK SERVICE API TESTS")
    print("=" * 50)
    
    try:
        # Test creating a book
        book_id = test_create_book()
        if not book_id:
            print("Failed to create book. Stopping tests.")
            return
        
        # Test other endpoints
        test_get_book(book_id)
        test_search_books()
        test_update_book(book_id)
        test_verify_book_copies(book_id)
        test_decrease_copies(book_id)
        test_increase_copies(book_id)
        test_books_stats()
        
        # Clean up - delete the test book
        test_delete_book(book_id)
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to Book Service. Make sure it's running on port 8002")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_all_tests()