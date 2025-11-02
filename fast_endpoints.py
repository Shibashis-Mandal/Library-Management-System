import logging
from datetime import date
from query import LibraryDatabaseManager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Library Management System Backend")
origins = [
    "http://localhost:3000",      # React local dev
    "http://127.0.0.1:3000",      # Alternative local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # or ["*"] to allow all origins (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, DELETE, etc.
    allow_headers=["*"],            # Allow all headers
)
library_manager = LibraryDatabaseManager()

@app.get("/popular-books/")
async def get_popular_books():
    """Fetch popular books from materialized view."""
    try:
        result = library_manager.get_materialized_view_popular_books()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error fetching popular books: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch popular books.")


@app.get("/overdue-transactions/")
async def get_overdue_transactions():
    """Fetch overdue transactions from materialized view."""
    try:
        result = library_manager.get_materialized_view_overdue_transactions()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error fetching overdue transactions: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch overdue transactions.")


@app.get("/all-books/")
async def get_all_books_summary():
    """Fetch all books summary from materialized view."""
    try:
        # library_manager.create_materialized_view_all_books_summary()
        result = library_manager.view_all_books()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error fetching all books summary: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch all books summary.")


@app.get("/user-borrowing-history/{user_id}")
async def get_user_borrowing_history(user_id: int):
    """Fetch a specific user's borrowing history."""
    try:
        result = library_manager.get_user_borrowing_history(user_id)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error fetching borrowing history for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch user borrowing history.")


@app.get("/return-report/")
async def get_fines_report():
    """Fetch total fines per student from materialized view."""
    try:
        library_manager.create_materialized_view_issued_report()
        result = library_manager.get_issued_report()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error fetching fines report: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch fines report.")


@app.post("/books/")
async def insert_book(
    title: str = Query(..., description="Book title"),
    author: int = Query(..., description="Author ID"),
    category: int = Query(..., description="Category ID"),
    isbn: str = Query(..., description="ISBN number"),
    total_copies: int = Query(..., description="Total copies of the book")
):
    """Insert a new book using stored procedure."""
    try:
        result = library_manager.stored_procedure_insert_book(title, author, category, isbn, total_copies)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error inserting book: {e}")
        raise HTTPException(status_code=500, detail="Could not insert book.")

@app.post("/add_issue/")
async def add_issue(
    student_id: int = Query(..., description="Student ID"),
    copy_id: int = Query(..., description="Copy ID"),
):
    """Add a new book issue."""
    try:
        #result = library_manager.issue_book(copy_id, student_id, copy_id, issue_date)
        result = library_manager.issue_book(copy_id, student_id)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error adding issue: {e}")
        raise HTTPException(status_code=500, detail="Could not add issue.")

@app.post("/return-book/")
async def return_book(
    student_id: int = Query(..., description="Student ID"),
    copy_id: int = Query(..., description="Copy ID"),
):
    """Return a book copy issued to a student."""
    try:
        result = library_manager.insert_return_and_update_book(copy_id, student_id)
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error returning book: {e}")
        raise HTTPException(status_code=500, detail="Could not return book.")

@app.delete("/books/{book_id}")
async def delete_book(book_id: int):
    """Delete a book by ID using stored procedure."""
    try:
        result = library_manager.stored_procedure_delete_book(book_id)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        logger.error(f"Error deleting book {book_id}: {e}")
        raise HTTPException(status_code=500, detail="Could not delete book.")


# @app.get("/categories")
# async def get_categories():
#     sql = "SELECT category_id, category_name FROM categories ORDER BY category_name;"
#     conn = get_connection()
#     try:
#         with conn.cursor() as cur:
#             cur.execute(sql)
#             rows = cur.fetchall()
#             data = [{"id": r[0], "name": r[1]} for r in rows]
#         return {"status": "success", "data": data}
#     except Exception as e:
#         raise HTTPException(500, str(e))
#     finally:
#         release_connection(conn)


# @app.get("/authors")
# async def get_authors():
#     sql = "SELECT DISTINCT author FROM books ORDER BY author;"
#     conn = get_connection()
#     try:
#         with conn.cursor() as cur:
#             cur.execute(sql)
#             rows = cur.fetchall()
#             data = [{"name": r[0]} for r in rows]
#         return {"status": "success", "data": data}
#     except Exception as e:
#         raise HTTPException(500, str(e))
#     finally:
#         release_connection(conn)


@app.get("/")
async def root():
    return {"message": "Library Management System API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
