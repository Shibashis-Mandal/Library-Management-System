from connection import get_connection, release_connection, init_connection_pool, close_connection_pool
import json
import datetime
import decimal
from datetime import date, datetime as dt


class LibraryDatabaseManager:
    def __init__(self):
        init_connection_pool()
        print("Connection pool initialized.")


    # PART 0: TABLE CREATION

    def create_tables(self):
        sql = """
        CREATE TABLE IF NOT EXISTS students (
            student_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            department VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            phone VARCHAR(15)
        );

        CREATE TABLE IF NOT EXISTS categories (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(100) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS books (
            book_id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            author VARCHAR(150) NOT NULL,
            category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
            total_copies INT NOT NULL CHECK (total_copies >= 0)
        );

        CREATE TABLE IF NOT EXISTS book_copies (
            copy_id SERIAL PRIMARY KEY,
            book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
            is_available BOOLEAN DEFAULT TRUE
        );

        CREATE TABLE IF NOT EXISTS issues (
            issue_id SERIAL PRIMARY KEY,
            student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
            copy_id INT REFERENCES book_copies(copy_id) ON DELETE CASCADE,
            issue_date DATE DEFAULT CURRENT_DATE,
            returned VARCHAR(3) CHECK (returned IN ('yes','no')) DEFAULT 'no'
        );

        CREATE TABLE IF NOT EXISTS returns (
            return_id SERIAL PRIMARY KEY,
            issue_id INT REFERENCES issues(issue_id) ON DELETE CASCADE,
            return_date DATE DEFAULT CURRENT_DATE,
            fine_amount DECIMAL(10,2) DEFAULT 0.00
        );
        """
    # PART 1: MATERIALIZED VIEWS

    def create_materialized_view_popular_books(self):
        sql = """
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv_popular_books AS
        SELECT 
            b.book_id,
            b.title,
            COUNT(i.issue_id) AS total_issues
        FROM books b
        JOIN book_copies bc ON b.book_id = bc.book_id
        JOIN issues i ON bc.copy_id = i.copy_id
        GROUP BY b.book_id, b.title
        ORDER BY total_issues DESC;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        finally:
            release_connection(conn)


    def get_materialized_view_popular_books(self):
        sql = "SELECT * FROM mv_popular_books ORDER BY total_issues DESC;"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                columns = [desc[0] for desc in cur.description]  
                rows = cur.fetchall()
            
            
            data = [dict(zip(columns, row)) for row in rows]

            
            return {"status": "success", "data": data}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)


    def create_materialized_view_overdue_transactions(self):
        sql = """
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv_overdue_transactions AS
        SELECT 
            i.issue_id,
            s.name AS student_name,
            b.title AS book_title,
            i.issue_date,
            r.return_date,
            (r.return_date - i.issue_date) AS days_held,
            CASE 
                WHEN (r.return_date - i.issue_date) > 14 THEN 'Overdue'
                ELSE 'On Time'
            END AS status
        FROM issues i
        JOIN returns r ON i.issue_id = r.issue_id
        JOIN book_copies bc ON i.copy_id = bc.copy_id
        JOIN books b ON bc.book_id = b.book_id
        JOIN student s ON i.student_id = s.student_id;
        """
        conn = get_connection() 
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Materialized view 'mv_overdue_transactions' created successfully!")
        except Exception as e:
            print(f"Error creating materialized view: {e}")
        finally:
            release_connection(conn) 

    def get_materialized_view_overdue_transactions(self):
        sql = """SELECT * FROM mv_overdue_transactions WHERE status = 'Overdue';"""
        conn = get_connection() 
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                columns = [desc[0] for desc in cur.description] 
                rows = cur.fetchall()

            
            data = [dict(zip(columns, row)) for row in rows]


            return {"status": "success", "data": data}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn) 

    def create_materialized_view_all_books_summary(self):
        sql = """
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv_all_books_summary AS
        SELECT 
            b.book_id,
            b.title,
            a.name AS author_name,
            c.name AS category_name,
            b.isbn,
            b.total_copies
        FROM books b
        JOIN author a ON b.author = a.author_id
        JOIN categories c ON b.category = c.category_id;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Materialized view 'mv_all_books_summary' created successfully!")
        except Exception as e:
            print(f"Error creating materialized view: {e}")
        finally:
            release_connection(conn)

    def get_all_books_from_materialized_view(self):
        sql = """SELECT * FROM mv_all_books_summary;"""
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                rows = cur.fetchall()
                columns = [desc[0] for desc in cur.description]

            
            data = [dict(zip(columns, row)) for row in rows]

            return {"status": "success", "data": data}

        except Exception as e:
            print(f"Error fetching all books summary: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)

    def create_materialized_view_user_borrowing_history(self):
        sql = """
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_borrowing_history AS
        SELECT 
            s.student_id,
            s.name AS student_name,
            b.title AS book_title,
            i.issue_date,
            r.return_date,
            r.fine_amount
        FROM student s
        JOIN issues i ON s.student_id = i.student_id
        JOIN book_copies bc ON i.copy_id = bc.copy_id
        JOIN books b ON bc.book_id = b.book_id
        LEFT JOIN returns r ON i.issue_id = r.issue_id;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        finally:
            release_connection(conn)
        

    def get_user_borrowing_history(self, user_id):
        sql = f"""SELECT * FROM mv_user_borrowing_history WHERE student_id = {user_id};"""
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql, (user_id,))
                rows = cur.fetchall()
                columns = [desc[0] for desc in cur.description]

            data = []
            for row in rows:
                record = dict(zip(columns, row))
                
                for k, v in record.items():
                    if isinstance(v, (datetime.date, datetime.datetime)):
                        record[k] = v.isoformat()
                data.append(record)

            return {"status": "success", "data": data}

        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)

    def create_materialized_view_fines_report(self):
        sql = """
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv_fines_report AS
        SELECT 
            s.name AS student_name,
            SUM(r.fine_amount) AS total_fines
        FROM returns r
        JOIN issues i ON r.issue_id = i.issue_id
        JOIN student s ON i.student_id = s.student_id
        GROUP BY s.name;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        finally:
            release_connection(conn)

    def get_fines_report(self):
        sql = """SELECT * FROM mv_fines_report ORDER BY total_fines DESC;"""
        conn = get_connection()
    
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                rows = cur.fetchall()
                columns = [desc[0] for desc in cur.description]
            data = []
            for row in rows:
                record = {}
                for col, val in zip(columns, row):
                    if isinstance(val, decimal.Decimal):
                        record[col] = float(val)
                    elif isinstance(val, date):
                        record[col] = val.isoformat()
                    else:
                        record[col] = val
                data.append(record)
            return {"status": "success", "data": data}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)

    # PART 2: TRIGGERS

    def create_after_book_issue_trigger(self):
        sql = """
        CREATE OR REPLACE FUNCTION update_status_after_issue()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE book_copies SET status = 'issue' WHERE copy_id = NEW.copy_id;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_after_issue
        AFTER INSERT ON issues
        FOR EACH ROW
        EXECUTE FUNCTION update_status_after_issue();
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        except Exception as e:
            print(f"Error creating trigger for book issue: {e}")
        finally:
            release_connection(conn)

    def create_after_book_return_trigger(self):
        sql = """
        CREATE OR REPLACE FUNCTION update_status_after_return()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE book_copies SET status = 'available'
            WHERE copy_id = (SELECT copy_id FROM issues WHERE issue_id = NEW.issue_id);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_after_return
        AFTER INSERT ON returns
        FOR EACH ROW
        EXECUTE FUNCTION update_status_after_return();
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        except Exception as e:
            print(f"Error creating trigger for book return: {e}")
        finally:
            release_connection(conn)
        

    def create_books_audit_log_trigger(self):
        sql = """
        CREATE TABLE IF NOT EXISTS books_audit_log (
            log_id SERIAL PRIMARY KEY,
            book_id INT,
            action_type VARCHAR(20),
            action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE OR REPLACE FUNCTION log_books_changes()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO books_audit_log(book_id, action_type)
            VALUES (OLD.book_id, TG_OP);
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_books_audit
        AFTER UPDATE OR DELETE ON books
        FOR EACH ROW
        EXECUTE FUNCTION log_books_changes();
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        except Exception as e:
            
            print(f"Error creating books audit log trigger: {e}")
        finally:
            release_connection(conn)

    def create_new_book_trigger(self):
        sql = """
        CREATE OR REPLACE FUNCTION log_new_book()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO books_audit_log(book_id, action_type)
            VALUES (NEW.book_id, 'INSERT');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_new_book
        AFTER INSERT ON books
        FOR EACH ROW
        EXECUTE FUNCTION log_new_book();
        """
        conn = get_connection() 
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        except Exception as e:
            print(f"Error creating new book trigger: {e}")
        finally:
            release_connection(conn)


    # PART 3: STORED PROCEDURES

    def create_stored_procedure_insert_book(self):
        sql = """
        CREATE OR REPLACE PROCEDURE insert_book(
            p_title VARCHAR,
            p_author INT,
            p_category INT,
            p_isbn VARCHAR,
            p_total_copies INT
        )
        LANGUAGE plpgsql
        AS $$
        BEGIN
            INSERT INTO books(title, author, category, isbn, total_copies)
            VALUES (p_title, p_author, p_category, p_isbn, p_total_copies);
        END;
        $$;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Stored procedure 'insert_book' created successfully!")
        except Exception as e:
            print(f"Error creating stored procedure: {e}")
        finally:
            release_connection(conn)
        
        
    def stored_procedure_insert_book(self, title, author, category, isbn, total_copies):
        sql = "CALL insert_book(%s, %s, %s, %s, %s);"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql, (title, author, category, isbn, total_copies))
                conn.commit()
            return {"status": "success", "message": f"Book '{title}' inserted successfully!"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)


    def create_stored_procedure_delete_book(self):
        sql = """
        CREATE OR REPLACE PROCEDURE delete_book(p_book_id INT)
        LANGUAGE plpgsql
        AS $$
        BEGIN
            INSERT INTO books_backup SELECT * FROM books WHERE book_id = p_book_id;
            DELETE FROM books WHERE book_id = p_book_id;
        END;
        $$;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Stored procedure 'delete_book' created successfully!")
        except Exception as e:
            print(f"Error creating stored procedure: {e}")
        finally:
            release_connection(conn)
            
    def stored_procedure_delete_book(self, book_id):
        sql = "CALL delete_book(%s);"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql, (book_id,))
                conn.commit()
            return {"status": "success", "message": f"Book with ID {book_id} deleted successfully!"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)

    def create_stored_procedure_issue_book(self):
        sql = """
        CREATE OR REPLACE PROCEDURE issue_book(p_student_id INT, p_copy_id INT, p_issue_date DATE)
        LANGUAGE plpgsql
        AS $$
        BEGIN
            INSERT INTO issues(student_id, copy_id, issue_date, returned)
            VALUES (p_student_id, p_copy_id, p_issue_date, 'no');
            UPDATE book_copies SET status = 'issue' WHERE copy_id = p_copy_id;
        END;
        $$;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Stored procedure 'delete_book' created successfully!")
        except Exception as e:
            print(f"Error creating stored procedure: {e}")
        finally:
            release_connection(conn)
        

    def create_stored_procedure_return_book(self):
        sql = """
        CREATE OR REPLACE PROCEDURE return_book(p_issue_id INT, p_return_date DATE, p_fine NUMERIC)
        LANGUAGE plpgsql
        AS $$
        BEGIN
            INSERT INTO returns(issue_id, return_date, fine_amount)
            VALUES (p_issue_id, p_return_date, p_fine);
            UPDATE issues SET returned = 'yes' WHERE issue_id = p_issue_id;
        END;
        $$;
        """


    # PART 4: BACKUP AND RESTORE

    def create_books_backup_table(self):
        sql = """
        CREATE TABLE IF NOT EXISTS books_backup AS
        TABLE books WITH NO DATA;
        """

    def create_books_restore_procedure(self):
        sql = """
        CREATE OR REPLACE PROCEDURE restore_book(p_book_id INT)
        LANGUAGE plpgsql
        AS $$
        BEGIN
            INSERT INTO books
            SELECT * FROM books_backup WHERE book_id = p_book_id
            ON CONFLICT (book_id) DO NOTHING;
        END;
        $$;
        """

    def create_backup_audit_log_table(self):
        sql = """
        CREATE TABLE IF NOT EXISTS backup_audit_log (
            log_id SERIAL PRIMARY KEY,
            action_type VARCHAR(20),
            table_name VARCHAR(50),
            record_id INT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """

    def insert_backup_audit_log(self, action_type, table_name, record_id):
        sql = f"""
        INSERT INTO backup_audit_log(action_type, table_name, record_id)
        VALUES ('{action_type}', '{table_name}', {record_id});
        """

    def get_backup_audit_logs(self):
        sql = """SELECT * FROM backup_audit_log ORDER BY timestamp DESC;"""


    # PART 5: SEARCH AND VIEWS

    def view_all_books(self):
        sql = """SELECT * FROM books ORDER BY title;"""

    def view_all_issues(self):
        sql = """SELECT * FROM issues ORDER BY issue_date DESC;"""

    def view_all_returns(self):
        sql = """SELECT * FROM returns ORDER BY return_date DESC;"""

    def search_books_by_title(self, title):
        sql = f"""SELECT * FROM books WHERE LOWER(title) LIKE LOWER('%{title}%');"""

    def search_books_by_author(self, author_name):
        sql = f"""
        SELECT b.* FROM books b
        JOIN author a ON b.author = a.author_id
        WHERE LOWER(a.name) LIKE LOWER('%{author_name}%');
        """

    def search_books_by_category(self, category_name):
        sql = f"""
        SELECT b.* FROM books b
        JOIN categories c ON b.category = c.category_id
        WHERE LOWER(c.name) LIKE LOWER('%{category_name}%');
        """


if __name__ == "__main__":
    db = LibraryDatabaseManager()
    # db.create_materialized_view_popular_books()
    # print("Materialized view 'mv_popular_books' created successfully!")
    # json_response = db.get_materialized_view_popular_books()
    # print("\n Popular Books (JSON Response):")
    # print(json_response)
        
    
    # db.create_materialized_view_overdue_transactions()
    # json_response = db.get_materialized_view_overdue_transactions()
    # print("\nOverdue Transactions (from materialized view):")
    # print(json_response)
    
    # db.create_materialized_view_all_books_summary()
    # json_response = db.get_all_books_from_materialized_view()
    # print("\nAll Books Summary (from materialized view):")
    # print(json_response)
    
    # db.create_materialized_view_user_borrowing_history()
    # user_id = 1
    # json_response = db.get_user_borrowing_history(user_id)
    # print(f"\nUser Borrowing History for User ID {user_id}:")
    # print(json_response)
    
    # db.create_materialized_view_fines_report()
    # json_response = db.get_fines_report()
    # print("\nFines Report (from materialized view):")
    # print(json_response)
    
    
    # db.create_after_book_issue_trigger()
    # print("Trigger for book issue created successfully!")
    # db.create_after_book_return_trigger()
    # print("Trigger for book return created successfully!")
    # db.create_books_audit_log_trigger()
    # print("Books audit log trigger created successfully!")
    # db.create_new_book_trigger()
    # print("New book trigger created successfully!")
    
    
    # db.create_stored_procedure_insert_book()
    # print("Stored procedure 'insert_book' created successfully!")
    # title = "Physics for Beginners"
    # author = 1
    # category = 1
    # isbn = "1234567890"
    # total_copies = 5
    # response = db.stored_procedure_insert_book(title, author, category, isbn, total_copies)
    # print(response)
    
    db.create_stored_procedure_delete_book()
    print("Stored procedure 'delete_book' created successfully!")
    book_id_to_delete = 6
    response = db.stored_procedure_delete_book(book_id_to_delete)
    print(response)
    
    
    
