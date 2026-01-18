from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random
import string
from datetime import datetime, timedelta
import mysql.connector
from passlib.hash import bcrypt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import get_db
authority_router = APIRouter(
    prefix="/authority",
    tags=["Authority"]
)

class AuthoritySignup(BaseModel):
    email: str
    full_name: str
    designation: str
    department: str
    password: str


authority_router = APIRouter(prefix="/authority", tags=["Authority"])
@authority_router.post("/signup")
def signup_authority(data: AuthoritySignup):
    return {
        "message": "Authority registered successfully"
    }

@authority_router.post("/send-otp")
def send_otp(email: str, captcha_text: str):
    return {"message": "OTP sent"}

@authority_router.post("/verify-otp")
def verify_otp(email: str, otp: str, captcha_input: str):
    return {"message": "OTP verified"}
@authority_router.post("/login")
def authority_login(email: str, password: str):
    db = get_db()
    cur = db.cursor(dictionary=True)

    try:
        query = "SELECT * FROM authorities WHERE email = %s"
        cur.execute(query, (email,))
        authority = cur.fetchone()

        if not authority:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not bcrypt.verify(password, authority["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "message": "Login successful",
            "authority": {
                "email": authority["email"],
                "full_name": authority["full_name"],
                "designation": authority["designation"],
                "department": authority["department"],
            }
        }

    finally:
        cur.close()

router = APIRouter()

# Database connection
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="ananya29",
        database="pothole_system"
    )

class SendOTPRequest(BaseModel):
    email: str
    captcha_text: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str
    captcha_input: str

class SignupRequest(BaseModel):
    email: str
    name: str
    designation: str
    department: str
    password: str

@router.post("/send-otp")
def send_otp(request: SendOTPRequest):
    """Send 4-digit OTP to email"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        # Store CAPTCHA (frontend generated)
        cursor.execute(
            "INSERT INTO captcha_store (email, captcha_text) VALUES (%s, %s)",
            (request.email, request.captcha_text)
        )
        
        # Generate 4-digit OTP
        otp = ''.join(random.choices(string.digits, k=4))
        expires_at = datetime.now() + timedelta(minutes=5)
        
        # Store OTP
        cursor.execute(
            "INSERT INTO otp_store (email, otp_code, expires_at) VALUES (%s, %s, %s)",
            (request.email, otp, expires_at)
        )
        
        db.commit()
        
        # Print OTP (for development)
        print(f"OTP for {request.email}: {otp}")
        
        return {
            "success": True,
            "message": "4-digit OTP sent to your email",
            "otp_expires": "5 minutes"
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error: {str(e)}")
    finally:
        cursor.close()
        db.close()

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest):
    """Verify OTP for login"""
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Check CAPTCHA
        cursor.execute(
            "SELECT * FROM captcha_store WHERE email = %s AND captcha_text = %s",
            (request.email, request.captcha_input.upper())
        )
        if not cursor.fetchone():
            raise HTTPException(400, "Invalid CAPTCHA")
        
        # Check OTP
        cursor.execute(
            """SELECT * FROM otp_store 
            WHERE email = %s AND otp_code = %s AND expires_at > NOW()""",
            (request.email, request.otp)
        )
        if not cursor.fetchone():
            raise HTTPException(400, "Invalid or expired OTP")
        
        # Check if authority exists
        cursor.execute(
            "SELECT * FROM authorities WHERE email = %s",
            (request.email,)
        )
        authority = cursor.fetchone()
        
        if not authority:
            raise HTTPException(404, "Account not found. Please sign up first.")
        
        return {
            "success": True,
            "message": "Login successful",
            "authority": {
                "email": authority['email'],
                "name": authority['full_name'],
                "department": authority['department']
            }
        }
        
    finally:
        cursor.close()
        db.close()

@router.post("/signup")
def signup(request: SignupRequest):
    """Direct signup (no email verification)"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        # Simple password hashing (for now)
        import hashlib
        password_hash = hashlib.sha256(request.password.encode()).hexdigest()
        
        cursor.execute(
            """INSERT INTO authorities 
            (email, full_name, designation, department, password_hash) 
            VALUES (%s, %s, %s, %s, %s)""",
            (request.email, request.name, request.designation, 
             request.department, password_hash)
        )
        
        db.commit()
        
        return {
            "success": True,
            "message": "Registration successful! You can now login."
        }
        
    except mysql.connector.IntegrityError:
        raise HTTPException(400, "Email already registered")
    except Exception as e:
        raise HTTPException(500, f"Error: {str(e)}")
    finally:
        cursor.close()
        db.close()