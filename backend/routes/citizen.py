from fastapi import APIRouter, HTTPException
from db import get_db
import random
from datetime import datetime, timedelta

citizen_router = APIRouter()

@citizen_router.post("/send-otp")
def send_otp(phone_number: str):
    # 1. Generate OTP
    otp = str(random.randint(100000, 999999))
    
    # 2. Set Expiration (e.g., 5 minutes from now)
    expires_at = datetime.now() + timedelta(minutes=5)

    db = get_db()
    cur = db.cursor()

    try:
        # 3. Insert into 'temp_citizen_otps' table
        # We use ON DUPLICATE KEY UPDATE to handle resending OTPs
        query = """
            INSERT INTO temp_citizen_otps (phone_number, otp_code, expires_at, is_verified)
            VALUES (%s, %s, %s, 0)
            ON DUPLICATE KEY UPDATE 
            otp_code = VALUES(otp_code), 
            expires_at = VALUES(expires_at),
            is_verified = 0
        """
        cur.execute(query, (phone_number, otp, expires_at))
        db.commit()
        
        # Integration point for SMS Gateway (Twilio/Fast2SMS)
        print(f"DEBUG: OTP for {phone_number} is {otp}") 
        
        return {"message": "OTP sent successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()

@citizen_router.post("/verify-otp")
def verify_otp(phone_number: str, otp: str, full_name: str):
    """
    Verifies OTP and registers the citizen if correct.
    We require 'full_name' here to complete the registration.
    """
    db = get_db()
    cur = db.cursor(dictionary=True) # Use dictionary=True to get column names

    try:
        # 1. Check if OTP exists, matches, and is not expired
        check_query = """
            SELECT * FROM temp_citizen_otps 
            WHERE phone_number = %s 
            AND otp_code = %s 
            AND expires_at > NOW()
            AND is_verified = 0
        """
        cur.execute(check_query, (phone_number, otp))
        record = cur.fetchone()

        if not record:
            raise HTTPException(status_code=400, detail="Invalid or Expired OTP")

        # 2. Mark OTP as verified in temp table
        update_temp = "UPDATE temp_citizen_otps SET is_verified = 1 WHERE phone_number = %s"
        cur.execute(update_temp, (phone_number,))

        # 3. Move/Insert into Main 'citizen' table
        # We assume you want to register them immediately upon verification
        insert_main = """
            INSERT INTO citizen (full_name, phone_number) 
            VALUES (%s, %s)
        """
        cur.execute(insert_main, (full_name, phone_number))
        
        # 4. (Optional) Delete the temp OTP record to clean up
        delete_temp = "DELETE FROM temp_citizen_otps WHERE phone_number = %s"
        cur.execute(delete_temp, (phone_number,))

        db.commit()
        return {"message": "Citizen verified and registered successfully"}

    except Exception as e:
        db.rollback()
        # Handle duplicate entry error (if citizen already registered)
        if "Duplicate entry" in str(e):
             raise HTTPException(status_code=400, detail="Citizen already registered")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()