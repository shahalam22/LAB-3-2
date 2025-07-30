import os
import httpx
from dotenv import load_dotenv

load_dotenv()

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8004")
BOOK_SERVICE_URL = os.getenv("BOOK_SERVICE_URL", "http://localhost:8002")

class ServiceClient:
    @staticmethod
    async def verify_user(user_id: int) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{USER_SERVICE_URL}/users/verify/{user_id}")
            if response.status_code == 200:
                return response.json()["exists"]
            return False

    @staticmethod
    async def verify_book_has_copies(book_id: int) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BOOK_SERVICE_URL}/books/verify/{book_id}/copies")
            if response.status_code == 200:
                return response.json()["has_copies"]
            return False

    @staticmethod
    async def decrease_book_copies(book_id: int):
        async with httpx.AsyncClient() as client:
            await client.put(f"{BOOK_SERVICE_URL}/books/{book_id}/decrease")

    @staticmethod
    async def increase_book_copies(book_id: int):
        async with httpx.AsyncClient() as client:
            await client.put(f"{BOOK_SERVICE_URL}/books/{book_id}/increase")
