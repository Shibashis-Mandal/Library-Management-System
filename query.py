from connection import get_connection, release_connection, init_connection_pool, close_connection_pool
import json
import datetime
import decimal
from datetime import date, datetime as dt
from psycopg2.extras import RealDictCursor


class LibraryDatabaseManager:
    def __init__(self):
        init_connection_pool()
        print("Connection pool initialized.")


    # PART 0: TABLE CREATION

    def create_tables(self):
        sql = """
        CREATE TABLE IF NOT EXISTS student (
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
    def refresh_materialized_view(self, view_name: str):
        sql = f"REFRESH MATERIALIZED VIEW CONCURRENTLY {view_name};"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print(f"Materialized view '{view_name}' refreshed successfully!")
            return {"status": "success", "message": f"{view_name} refreshed successfully"}
        except Exception as e:
            print(f"Error refreshing materialized view {view_name}: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)

    

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
        # ensure the materialized view is fresh before querying
        try:
            self.refresh_materialized_view('mv_popular_books')
        except Exception:
            # if refresh fails, continue to attempt to read the view
            pass

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
        # refresh view before querying
        try:
            self.refresh_materialized_view('mv_overdue_transactions')
        except Exception:
            pass

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
        # refresh view before querying
        try:
            self.refresh_materialized_view('mv_all_books_summary')
        except Exception:
            pass

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
        # refresh view before querying
        try:
            self.refresh_materialized_view('mv_user_borrowing_history')
        except Exception:
            pass

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

    def create_materialized_view_issued_report(self):
        sql = """
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv_issued_report AS
        SELECT 
            s.student_id,
            s.name AS student_name,
            i.issue_id,
            i.copy_id,
            COALESCE(SUM(r.fine_amount), 0) AS total_fines,
            i.returned
        FROM issues i
        JOIN student s ON i.student_id = s.student_id
        LEFT JOIN returns r ON r.issue_id = i.issue_id
        GROUP BY s.student_id, s.name, i.issue_id, i.copy_id, i.returned;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_issued_report_issue_id ON mv_issued_report(issue_id);
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        finally:
            release_connection(conn)

    def get_issued_report(self):
        # refresh view before querying
        try:
            self.refresh_materialized_view('mv_issued_report')
        except Exception:
            pass

        sql = """SELECT * FROM mv_issued_report """
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
        CREATE OR REPLACE FUNCTION handle_book_insert()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Backup only, no copy creation
            INSERT INTO books_backup (book_id, title, author, category, isbn, total_copies, backup_date)
            VALUES (NEW.book_id, NEW.title, NEW.author, NEW.category, NEW.isbn, NEW.total_copies, CURRENT_TIMESTAMP);

            RAISE NOTICE 'Book inserted: %, Author ID: %, Category ID: %, Copies: %',
                NEW.title, NEW.author, NEW.category, NEW.total_copies;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;


        DROP TRIGGER IF EXISTS after_book_insert ON books;
        CREATE TRIGGER after_book_insert
        AFTER INSERT ON books
        FOR EACH ROW
        EXECUTE FUNCTION handle_book_insert();


        """
        conn = get_connection() 
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
                print("New book trigger created successfully.")
        except Exception as e:
            print(f"Error creating new book trigger: {e}")
        finally:
            release_connection(conn)
    def insert_book(self, title, author_name, category_name, isbn, total_copies, shelf_location):
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                # resolve author
                cur.execute("SELECT author_id FROM author WHERE LOWER(name)=LOWER(%s)", (author_name,))
                result = cur.fetchone()
                if result:
                    author_id = result[0]
                else:
                    cur.execute("INSERT INTO author (name, bio) VALUES (%s, 'Bio not provided') RETURNING author_id;",
                                (author_name,))
                    author_id = cur.fetchone()[0]

                # resolve category
                cur.execute("SELECT category_id FROM categories WHERE LOWER(name)=LOWER(%s)", (category_name,))
                result = cur.fetchone()
                if result:
                    category_id = result[0]
                else:
                    cur.execute("INSERT INTO categories (name) VALUES (%s) RETURNING category_id;", (category_name,))
                    category_id = cur.fetchone()[0]

                # insert book
                cur.execute("""
                    INSERT INTO books (title, author, category, isbn, total_copies)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING book_id
                """, (title, author_id, category_id, isbn, total_copies))
                book_id = cur.fetchone()[0]

                # insert copies and capture their ids
                inserted_copy_ids = []
                for _ in range(int(total_copies)):
                    cur.execute("""
                        INSERT INTO book_copies (book_id, status, shelf_location)
                        VALUES (%s, 'available', %s)
                        RETURNING copy_id
                    """, (book_id, shelf_location))
                    new_copy_id = cur.fetchone()[0]
                    inserted_copy_ids.append(new_copy_id)

                conn.commit()

                return {
                    "status": "success",
                    "message": f"Book '{title}' inserted successfully with Book ID: {book_id} and Copy ID: {inserted_copy_ids[0]}.",
                    "book_id": book_id,
                    "copy_ids": inserted_copy_ids
                }

        except Exception as e:
            conn.rollback()
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)



    def create_book_delete_trigger(self):
        sql = """
        CREATE OR REPLACE FUNCTION handle_book_delete()
        RETURNS TRIGGER AS $$
        DECLARE
            author_books_count INT;
            category_books_count INT;
        BEGIN
            -- Count remaining books by the same author
            SELECT COUNT(*) INTO author_books_count
            FROM books
            WHERE author = OLD.author;

            -- If no other books exist for the author, delete the author
            IF author_books_count = 0 THEN
                DELETE FROM author WHERE author_id = OLD.author;
            END IF;

            -- Count remaining books in the same category
            SELECT COUNT(*) INTO category_books_count
            FROM books
            WHERE category = OLD.category;

            -- If no other books exist for the category, delete the category
            IF category_books_count = 0 THEN
                DELETE FROM categories WHERE category_id = OLD.category;
            END IF;

            -- Optional: Log the deletion
            RAISE NOTICE 'Book deleted: %, Author ID: %, Category ID: %', OLD.title, OLD.author, OLD.category;

            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS after_book_delete ON books;

        CREATE TRIGGER after_book_delete
        AFTER DELETE ON books
        FOR EACH ROW
        EXECUTE FUNCTION handle_book_delete();
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
                print("Book delete trigger created successfully.")
        except Exception as e:
            print(f"Error creating book delete trigger: {e}")
        finally:
            release_connection(conn)


    def delete_book(self, book_id):
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                # Check if book exists by ID
                cur.execute("SELECT book_id FROM books WHERE book_id = %s;", (book_id,))
                result = cur.fetchone()

                if not result:
                    return {"status": "error", "message": f"No book found with ID {book_id}."}

                # Delete book by ID
                cur.execute("DELETE FROM books WHERE book_id = %s;", (book_id,))
                conn.commit()

                return {"status": "success", "message": f"Book with ID {book_id} deleted successfully."}

        except Exception as e:
            conn.rollback()
            return {"status": "error", "message": str(e)}
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
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Stored procedure 'return_book' created successfully!")
        except Exception as e:
            print(f"Error creating stored procedure: {e}")
        finally:
            release_connection(conn)
            
    def stored_procedure_issue_book(self, student_id, copy_id, issue_date):
        sql = "CALL issue_book(%s, %s, %s);"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql, (student_id, copy_id, issue_date))
                conn.commit()
            return {"status": "success", "message": f"Book issued successfully to student ID {student_id}!"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)
            
    def stored_procedure_return_book(self, issue_id, return_date, fine):
        sql = "CALL return_book(%s, %s, %s);"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql, (issue_id, return_date, fine))
                conn.commit()
            return {"status": "success", "message": f"Book returned successfully for issue ID {issue_id}!"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            release_connection(conn)
            
    def create_issue_procedure(self):
            sql = """
            CREATE OR REPLACE PROCEDURE issue_book(p_book_id INT, p_student_id INT)
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_copy_id INT;
            BEGIN
                SELECT copy_id INTO v_copy_id
                FROM book_copies
                WHERE book_id = p_book_id AND status = 'available'
                LIMIT 1;

                IF v_copy_id IS NULL THEN
                    RAISE NOTICE 'No available copies for this book.';
                    RETURN;
                END IF;

                INSERT INTO issues (student_id, copy_id, issue_date)
                VALUES (p_student_id, v_copy_id, CURRENT_DATE);

                UPDATE books
                SET total_copies = total_copies - 1
                WHERE book_id = p_book_id;

                UPDATE book_copies
                SET status = 'issue'
                WHERE copy_id = v_copy_id;

                RAISE NOTICE 'Book (ID: %) issued successfully to student (ID: %).', p_book_id, p_student_id;
            END;
            $$;
            """
            conn = get_connection()
            try:
                with conn.cursor() as cur:
                    cur.execute(sql)
                    conn.commit()
                print("Procedure 'issue_book' created successfully!")
            except Exception as e:
                print(f"Error creating procedure: {e}")
            finally:
                release_connection(conn)

    def issue_book(self, copy_id, student_id):
        sql = f"CALL issue_book({copy_id}, {student_id});"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            #print(f"Book {copy_id} issued successfully to student {student_id}.")
            return {"status": "success", "message": f"Book {copy_id} issued successfully to student {student_id}."}
        except Exception as e:
            print(f"Error issuing book: {e}")
        finally:
            release_connection(conn)
            
    
    def create_procedure_insert_return(self):
        sql = """
        CREATE OR REPLACE PROCEDURE insert_return_and_update_book(
            p_copy_id INT,
            p_student_id INT
        )
        LANGUAGE plpgsql
        AS $$
        DECLARE
            v_issue_id INT;
            v_book_id INT;
        BEGIN
            -- Get the book_id for the copy
            SELECT book_id INTO v_book_id
            FROM book_copies
            WHERE copy_id = p_copy_id;

            IF v_book_id IS NULL THEN
                RAISE EXCEPTION 'Invalid copy_id: % (no such book copy)', p_copy_id;
            END IF;

            
            SELECT issue_id INTO v_issue_id
            FROM issues
            WHERE student_id = p_student_id
            AND copy_id = p_copy_id
            AND returned = 'no'
            LIMIT 1;

            IF v_issue_id IS NULL THEN
                RAISE EXCEPTION 'No active issue found for Student ID: %, Copy ID: %', p_student_id, p_copy_id;
            END IF;

           
            INSERT INTO returns (issue_id, return_date, fine_amount)
            VALUES (v_issue_id, CURRENT_DATE, 0);

            
            UPDATE issues
            SET returned = 'yes'
            WHERE issue_id = v_issue_id;

            
            UPDATE book_copies
            SET status = 'available'
            WHERE copy_id = p_copy_id;

            
            UPDATE books
            SET total_copies = total_copies + 1
            WHERE book_id = v_book_id;

            RAISE NOTICE 'Book copy % (book_id %) returned successfully for student %', p_copy_id, v_book_id, p_student_id;
        END;
        $$;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Stored procedure 'insert_return_and_update_book' created successfully!")
        except Exception as e:
            print(f"Error creating procedure: {e}")
        finally:
            conn.close()



        
    def insert_return_and_update_book(self, copy_id, student_id):
        sql = f"CALL insert_return_and_update_book({copy_id}, {student_id});"
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            #print(f"Book copy {copy_id} returned successfully by student {student_id}.")
            return {"status": "success", "message": f"Book copy {copy_id} returned successfully by student {student_id}."}
        except Exception as e:
            print(f"Error returning book: {e}")
        finally:
            release_connection(conn)




    # PART 4: BACKUP AND RESTORE

    def create_books_backup_table(self):
        sql = """
        CREATE TABLE IF NOT EXISTS books_backup AS
        TABLE books WITH NO DATA;
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Backup table 'books_backup' created successfully!")
        except Exception as e:
            print(f"Error creating backup table: {e}")
        finally:
            release_connection(conn)

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
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Stored procedure 'restore_book' created successfully!")
        except Exception as e:
            print(f"Error creating stored procedure: {e}")
        finally:
            release_connection(conn)

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
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Backup audit log table 'backup_audit_log' created successfully!")
        except Exception as e:
            print(f"Error creating backup audit log table: {e}")
        finally:
            release_connection(conn)

    def insert_backup_audit_log(self, action_type, table_name, record_id):
        sql = f"""
        INSERT INTO backup_audit_log(action_type, table_name, record_id)
        VALUES ('{action_type}', '{table_name}', {record_id});
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            print("Backup audit log entry created successfully!")
        except Exception as e:
            print(f"Error creating backup audit log entry: {e}")
        finally:
            release_connection(conn)

    def get_backup_audit_logs(self):
        sql = """SELECT * FROM backup_audit_log ORDER BY timestamp DESC;"""
        conn = get_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql)
                result = cur.fetchall()
                clean_rows = [dict(row) for row in result]
                return {
                    "status": "success",
                    "data": clean_rows
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            release_connection(conn)

    # PART 5: SEARCH AND VIEWS
    
    def execute_query(self, sql, params=None, fetch=False):
        conn = get_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql, params)
                if fetch:
                    result = cur.fetchall() 
                    clean_rows = [dict(row) for row in result]
                    return clean_rows
                else:
                    conn.commit()
                    return None
        except Exception as e:
            print(f"Database error: {e}")
            return None
        finally:
            release_connection(conn)

    def view_all_books(self):
        sql = """
        SELECT 
            b.book_id,
            b.title,
            a.name AS author_name,
            c.name AS category_name,
            b.isbn,
            b.total_copies
        FROM books b
        JOIN author a ON b.author = a.author_id
        JOIN categories c ON b.category = c.category_id
        ORDER BY b.title;
        """
        try:
            rows = self.execute_query(sql, fetch=True)
            if rows:
                return {
                    "status": "success",
                    "data": rows
                }
            else:
                return {
                    "status": "success",
                    "data": [],
                    "message": "No books found"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

            

    def view_all_issues(self):
        sql = """SELECT * FROM issues ORDER BY issue_date DESC;"""
        try:
            rows = self.execute_query(sql, fetch=True)
            if rows:
                return {
                    "status": "success",
                    "data": rows
                }
            else:
                return {
                    "status": "success",
                    "data": [],
                    "message": "No issues found"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }


    def view_all_returns(self):
        sql = """SELECT * FROM returns ORDER BY return_date DESC;"""
        try:
            rows = self.execute_query(sql, fetch=True)
            if rows:
                return {
                    "status": "success",
                    "data": rows
                }
            else:
                return {
                    "status": "success",
                    "data": [],
                    "message": "No returns found"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
        

    def search_books_by_title(self, title):
        
        sql = f"""SELECT * FROM books WHERE LOWER(title) LIKE LOWER('%{title}%');"""
        try:
            rows = self.execute_query(sql, fetch=True)
            if rows:
                return {
                    "status": "success",
                    "data": rows
                }
            else:
                return {
                    "status": "success",
                    "data": [],
                    "message": "No books found with that title"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def search_books_by_author(self, author_name):
        sql = f"""
        SELECT b.* FROM books b
        JOIN author a ON b.author = a.author_id
        WHERE LOWER(a.name) LIKE LOWER('%{author_name}%');
        """
        try:
            rows = self.execute_query(sql, fetch=True)
            if rows:
                return {
                    "status": "success",
                    "data": rows
                }
            else:
                return {
                    "status": "success",
                    "data": [],
                    "message": "No books found by that author"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def search_books_by_category(self, category_name):
        sql = f"""
        SELECT b.* FROM books b
        JOIN categories c ON b.category = c.category_id
        WHERE LOWER(c.name) LIKE LOWER('%{category_name}%');
        """
        try:
            rows = self.execute_query(sql, fetch=True)
            if rows:
                return {
                    "status": "success",
                    "data": rows
                }
            else:
                return {
                    "status": "success",
                    "data": [],
                    "message": "No books found in that category"
                }
        except Exception as e:  
            return {
                "status": "error",
                "message": str(e)
            }


# if __name__ == "__main__":
    # db = LibraryDatabaseManager()
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
    #json_response = db.get_all_books_from_materialized_view()
    # print("\nAll Books Summary (from materialized view):")
    # print(json_response)
    
    # db.create_materialized_view_user_borrowing_history()
    # user_id = 1
    #json_response = db.get_user_borrowing_history(user_id)
    # print(f"\nUser Borrowing History for User ID {user_id}:")
    # print(json_response)
    
    # db.create_materialized_view_fines_report()
    #json_response = db.get_fines_report()
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
    
    # db.create_stored_procedure_delete_book()
    # print("Stored procedure 'delete_book' created successfully!")
    # book_id_to_delete = 6
    # response = db.stored_procedure_delete_book(book_id_to_delete)
    # print(response)
    
    # db.create_stored_procedure_issue_book()
    # print("Stored procedure 'issue_book' created successfully!")
    # student_id = 1
    # copy_id = 1
    # issue_date = dt.now().date()
    # response = db.stored_procedure_issue_book(student_id, copy_id, issue_date)
    # print(response)
    # db.create_stored_procedure_return_book()
    # print("Stored procedure 'return_book' created successfully!")
    # issue_id = 1
    # return_date = dt.now().date()
    # fine = 0.00
    # response = db.stored_procedure_return_book(issue_id, return_date, fine)
    # print(response)
    
    # view_all_issues = db.view_all_issues()
    # print("\nAll Issues:")
    # print(view_all_issues)
    
    # view_all_returns = db.view_all_returns()
    # print("\nAll Returns:")
    # print(view_all_returns)
    
    # search_title = "The Hobbit"
    # search_books_by_title = db.search_books_by_title(search_title)
    # print(f"\nSearch Books by Title '{search_title}':")
    # print(search_books_by_title)

    # search_author = "J.K. Rowling"
    # search_books_by_author = db.search_books_by_author(search_author)
    # print(f"\nSearch Books by Author '{search_author}':")
    # print(search_books_by_author)
    
    # search_category = "Fantasy"
    # search_books_by_category = db.search_books_by_category(search_category)
    # print(f"\nSearch Books by Category '{search_category}':")   
    # print(search_books_by_category)
    
    
    # db.create_books_backup_table()
    # print("Backup table 'books_backup' created successfully!")
    # db.create_books_restore_procedure()
    # print("Stored procedure 'restore_book' created successfully!")
    # action_type = "INSERT"
    # table_name = "books"
    # record_id = 1
    # db.insert_backup_audit_log(action_type, table_name, record_id)
    # print("Backup audit log entry created successfully!")
    # backup_logs = db.get_backup_audit_logs()
    # print("\nBackup Audit Logs:")
    # print(backup_logs)
    
    # db.create_issue_procedure()
    # print("Procedure 'issue_book' created successfully!")
    # book_id = 1
    # student_id = 2
    # db.issue_book(book_id, student_id)
    
    # db.create_procedure_insert_return()
    # print("Procedure 'insert_return_and_update_book' created successfully!")
    # copy_id = 2
    # student_id = 1
    # db.insert_return_and_update_book(copy_id,student_id)

    # db.create_new_book_trigger()

    # result = db.insert_book(
    #     title="Algorithms Unlocked Advanced-II",
    #     author_name="Thomas Cormen",
    #     category_name="Computer Science",
    #     isbn="9780262518802895690",
    #     total_copies=5,
    #     shelf_location="A3-Row2"
    # )


    # print(result)
    # print("Book inserted successfully!")
    
    # db.create_book_delete_trigger()

    # result = db.delete_book(book_id=54)

    # print(result)
    
    # db.create_book_delete_trigger()

    # result = db.delete_book(book_id=56)

    # print(result)
