from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File
from query import LibraryDatabaseManager
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Backend for Library Management System")

library_manager = LibraryDatabaseManager()

@app.get("/popular-books/")
async def get_popular_books():
    try:
        books = library_manager.get_materialized_view_popular_books()
        return books
    except Exception as e:
        logger.error(f"Error fetching popular books: {e}")
        return {"error": "Could not fetch popular books"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)