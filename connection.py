
import psycopg2
from psycopg2 import pool
from loguru import logger
import os

from dotenv import load_dotenv
load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")


connection_pool = None

def init_connection_pool():
    
    global connection_pool
    try:
        connection_pool = psycopg2.pool.SimpleConnectionPool(
            1, 10, dsn=DATABASE_URL
        )
        if connection_pool:
            logger.info(" PostgreSQL connection pool established successfully ")
    except Exception as e:
        logger.error(f" Error creating connection pool: {e}")
        raise

def get_connection():
    
    try:
        if not connection_pool:
            raise Exception("Connection pool not initialized.")
        conn = connection_pool.getconn()
        return conn
    except Exception as e:
        logger.error(f" Error getting connection: {e}")
        raise

def release_connection(conn):
    
    try:
        if connection_pool and conn:
            connection_pool.putconn(conn)
    except Exception as e:
        logger.warning(f"Error releasing connection: {e}")

def close_connection_pool():
    
    global connection_pool
    if connection_pool:
        connection_pool.closeall()
        logger.info("PostgreSQL connection pool closed.")




