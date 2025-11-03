# Library-Management-System
A full fledged AI-powered Library Management System for library admins and members in one application.
# 📚 Library Management System

A full-featured **Library Management System** built using **PostgreSQL** and **Python**, with database triggers for automated backups and integrity, and an optional **React frontend** for book management.

---

## 🚀 Features

- **Book Management**
  - Add, view, update, and delete books.
  - Auto-generates unique Book IDs.
  - Maintains total copies and availability in `book_copies`.

- **Automated Backups**
  - On every new book insert, a trigger automatically copies the data into a backup table `books_backup`.
  - Timestamped entries for audit and recovery.

- **Referential Integrity**
  - Foreign key relations between `books`, `authors`, and `book_copies`.
  - Safe delete and update operations with triggers.

- **Triggers and Procedures**
  - PostgreSQL trigger `after_book_insert` calls `handle_book_insert()` to maintain consistency.
  - Stored procedures handle backup, restoration, and maintenance.

---

## 🧩 Database Schema

**Tables:**
- `books(book_id, title, author, category, isbn, total_copies)`
- `authors(author_id, author_name)`
- `book_copies(copy_id, book_id, status, shelf_location)`
- `books_backup(book_id, title, author, category, isbn, total_copies, backup_date)`

---

## ⚙️ Trigger Logic

### Trigger Function: `handle_book_insert()`
```sql
CREATE OR REPLACE FUNCTION handle_book_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Backup new book info
    INSERT INTO books_backup (book_id, title, author, category, isbn, total_copies, backup_date)
    VALUES (NEW.book_id, NEW.title, NEW.author, NEW.category, NEW.isbn, NEW.total_copies, CURRENT_TIMESTAMP);

    RAISE NOTICE 'Book inserted: %, Author: %, Copies: %', NEW.title, NEW.author, NEW.total_copies;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
