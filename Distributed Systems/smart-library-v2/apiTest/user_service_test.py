#!/usr/bin/env python3
"""
User Service API Tests
Tests all endpoints for the User Service running on port 8004
"""

import requests
import json
from datetime import datetime
import random
import string

BASE_URL = "http://localhost"

def generate_random_email():
    """Generate a random email for testing"""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_string}@example.com"

def test_create_user():
    """Test creating a new user"""
    print("Testing: POST /api/users/")
    
    user_data = {
        "name": "Test User",
        "email": generate_random_email(),
        "role": "student"
    }
    
    response = requests.post(f"{BASE_URL}/api/users/", json=user_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        return response.json()['id']
    else:
        print(f"Error: {response.text}")
        return None

def test_create_duplicate_user():
    """Test creating a user with duplicate email"""
    print("\nTesting: POST /api/users/ (duplicate email)")
    
    email = generate_random_email()
    user_data = {
        "name": "First User",
        "email": email,
        "role": "student"
    }
    
    # Create first user
    response1 = requests.post(f"{BASE_URL}/api/users/", json=user_data)
    print(f"First user creation - Status: {response1.status_code}")
    
    if response1.status_code == 200:
        # Try to create second user with same email
        user_data["name"] = "Second User"
        response2 = requests.post(f"{BASE_URL}/api/users/", json=user_data)
        print(f"Duplicate email attempt - Status: {response2.status_code}")
        if response2.status_code == 400:
            print("✓ Correctly rejected duplicate email")
        else:
            print(f"✗ Expected 400, got {response2.status_code}")
        return response1.json()['id']
    else:
        print(f"Failed to create first user: {response1.text}")
        return None

def test_get_user(user_id):
    """Test getting a user by ID"""
    print(f"\nTesting: GET /api/users/{user_id}")
    
    response = requests.get(f"{BASE_URL}/api/users/{user_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_get_nonexistent_user():
    """Test getting a non-existent user"""
    print(f"\nTesting: GET /api/users/99999 (non-existent)")
    
    response = requests.get(f"{BASE_URL}/api/users/99999")
    print(f"Status: {response.status_code}")
    if response.status_code == 404:
        print("✓ Correctly returned 404 for non-existent user")
    else:
        print(f"✗ Expected 404, got {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")

def test_verify_user(user_id):
    """Test verifying user existence"""
    print(f"\nTesting: GET /api/users/verify/{user_id}")
    
    response = requests.get(f"{BASE_URL}/api/users/verify/{user_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_verify_nonexistent_user():
    """Test verifying non-existent user"""
    print(f"\nTesting: GET /api/users/verify/99999 (non-existent)")
    
    response = requests.get(f"{BASE_URL}/api/users/verify/99999")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Response: {result}")
        if not result.get("exists", True):
            print("✓ Correctly returned exists: false")
        else:
            print("✗ Expected exists: false")
    else:
        print(f"Error: {response.text}")

def test_get_total_users():
    """Test getting total user count"""
    print("\nTesting: GET /api/users/stats/total")
    
    response = requests.get(f"{BASE_URL}/api/users/stats/total")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

def test_different_user_roles():
    """Test creating users with different roles"""
    print("\nTesting: Creating users with different roles")
    
    roles = ["student", "faculty", "librarian"]
    created_users = []
    
    for role in roles:
        user_data = {
            "name": f"Test {role.title()}",
            "email": generate_random_email(),
            "role": role
        }
        
        response = requests.post(f"{BASE_URL}/api/users/", json=user_data)
        print(f"Creating {role} user - Status: {response.status_code}")
        if response.status_code == 200:
            created_users.append(response.json()['id'])
        else:
            print(f"Error creating {role}: {response.text}")
    
    return created_users

def run_all_tests():
    """Run all user service tests"""
    print("=" * 50)
    print("USER SERVICE API TESTS")
    print("=" * 50)
    
    try:
        # Test creating a user
        user_id = test_create_user()
        if not user_id:
            print("Failed to create user. Continuing with other tests...")
        
        # Test duplicate email handling
        duplicate_user_id = test_create_duplicate_user()
        
        # Test other endpoints
        if user_id:
            test_get_user(user_id)
            test_verify_user(user_id)
        
        test_get_nonexistent_user()
        test_verify_nonexistent_user()
        test_get_total_users()
        
        # Test different user roles
        role_users = test_different_user_roles()
        
        print(f"\n✓ Created test users with IDs: {[user_id, duplicate_user_id] + role_users}")
        print("Note: Test users are not deleted - they remain in the database for further testing")
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to User Service. Make sure it's running on port 8004")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_all_tests()