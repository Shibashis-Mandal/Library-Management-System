from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class StudentRow:
    """Represents a row in the student table."""
    student_id: Optional[int]
    name: str
    dept: str
    email: str
    phone: str


@dataclass
class AuthorRow:
    """Represents a row in the authors table."""
    author_id: Optional[int]
    name: str
    bio: Optional[str] = None


@dataclass
class CategoryRow:
    """Represents a row in the categories table."""
    category_id: Optional[int]
    name: str


@dataclass
class BookRow:
    """Represents a row in the books table."""
    book_id: Optional[int]
    title: str
    author_id: int
    category_id: int
    isbn: str
    total_copies: int


@dataclass
class BookCopyRow:
    """Represents a row in the book_copies table."""
    copy_id: Optional[int]
    book_id: int
    status: str                # ENUM('Available','Issued','Lost','Damaged')
    purchase_date: Optional[date] = None
    shelf_location: Optional[str] = None

@dataclass
class IssueRow:
    """Represents a row in the issues table."""
    issue_id: Optional[int]
    student_id: int
    copy_id: int
    issue_date: date
    due_date: date
    returned: str              # ENUM('Yes','No')


@dataclass
class ReturnRow:
    """Represents a row in the returns table."""
    return_id: Optional[int]
    issue_id: int
    return_date: date
    fine_amount: float
