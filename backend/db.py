import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create a connection pool (better for performance than single connections)
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "pothole_system"),
    "port": int(os.getenv("DB_PORT", 3306))
}

# Create a pool with 5 connections
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    **db_config
)

def get_db():
    """
    Dependency that provides a database connection.
    Used in API routes: db = get_db()
    """
    try:
        connection = connection_pool.get_connection()
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to DB: {err}")
        raise