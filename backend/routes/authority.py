from fastapi import APIRouter, HTTPException
from db import get_db
from passlib.hash import bcrypt
import uuid
from datetime import datetime, timedelta

authority_router = APIRouter()

# ---------------------------------------------------------
# 1. SIGNUP: Creates Staging Entry & Generates Token
# ---------------------------------------------------------
@authority_router.post("/signup")
def authority_signup(
    email: str,
    full_name: str,
    designation: str,
    department: str,
    password: str
):
    # 1. Hash the password immediately
    password_hash = bcrypt.hash(password)
    
    # 2. Generate a unique verification token
    token = str(uuid.uuid4())
    
    # 3. Set Expiration (e.g., Link valid for 24 hours)
    expires_at = datetime.now() + timedelta(hours=24)

    db = get_db()
    cur = db.cursor()

    try:
        # 4. Insert into 'authority_verifications' (STAGING TABLE)
        query = """
            INSERT INTO authority_verifications 
            (email, full_name, designation, department, password_hash, verification_token, expires_at, is_verified)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 0)
        """
        cur.execute(query, (email, full_name, designation, department, password_hash, token, expires_at))
        db.commit()
        
        # -------------------------------------------------------
        # TODO: Integrate Email Service Here (SMTP / SendGrid)
        # For now, we print the link to the console for testing
        verification_link = f"http://localhost:8000/authority/verify?token={token}"
        print(f"DEBUG: Verification Link: {verification_link}")
        # -------------------------------------------------------

        return {"message": "Signup successful. Please check your email to verify your account."}

    except Exception as e:
        db.rollback()
        # Handle duplicate email error
        if "Duplicate entry" in str(e):
             raise HTTPException(status_code=400, detail="Registration already pending or Email in use")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()

# ---------------------------------------------------------
# 2. VERIFY: Moves Data to Main Table
# ---------------------------------------------------------
@authority_router.get("/verify")
def verify_email(token: str):
    db = get_db()
    cur = db.cursor(dictionary=True)

    try:
        # 1. Find the pending verification by token
        check_query = """
            SELECT * FROM authority_verifications 
            WHERE verification_token = %s 
            AND expires_at > NOW()
        """
        cur.execute(check_query, (token,))
        pending_user = cur.fetchone()

        if not pending_user:
            raise HTTPException(status_code=400, detail="Invalid or Expired Verification Link")

        # 2. Insert into Main 'authorities' table
        insert_query = """
            INSERT INTO authorities 
            (email, full_name, designation, department, password_hash)
            VALUES (%s, %s, %s, %s, %s)
        """
        cur.execute(insert_query, (
            pending_user['email'], 
            pending_user['full_name'], 
            pending_user['designation'], 
            pending_user['department'], 
            pending_user['password_hash']
        ))

        # 3. Delete from staging table (Cleanup)
        delete_query = "DELETE FROM authority_verifications WHERE verification_id = %s"
        cur.execute(delete_query, (pending_user['verification_id'],))

        db.commit()
        return {"message": "Email verified successfully! You can now login."}

    except Exception as e:
        db.rollback()
        if "Duplicate entry" in str(e):
             raise HTTPException(status_code=400, detail="Account already active")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()