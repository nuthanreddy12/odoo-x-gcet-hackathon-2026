import random
from datetime import datetime, timedelta
from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import (
    UserCreate, UserLogin, UserOut, Token,
    PasswordResetRequest, PasswordResetConfirm
)

router = APIRouter()

# In-memory OTP store for lightweight password reset (hackathon-friendly)
# In production, this can be stored in Redis or sent via Supabase Auth
OTP_STORE: Dict[str, dict] = {}


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role or "inventory_manager"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")

    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}


@router.post("/forgot-password")
def forgot_password(req: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Don't leak user presence
        return {"message": "If this email is registered, an OTP has been generated"}

    # Generate a 6-digit OTP
    otp = f"{random.randint(100000, 999999)}"
    OTP_STORE[req.email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=15)
    }

    # Return OTP in response for testing/hackathon convenience
    return {
        "message": "OTP generated successfully",
        "demo_otp": otp,
        "note": "In production, this OTP is dispatched via Supabase Auth email."
    }


@router.post("/reset-password")
def reset_password(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    stored = OTP_STORE.get(req.email)
    if not stored:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP request")
    if stored["expires_at"] < datetime.utcnow():
        OTP_STORE.pop(req.email, None)
        raise HTTPException(status_code=400, detail="OTP has expired")
    if stored["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    OTP_STORE.pop(req.email, None)
    return {"message": "Password reset successfully. You may now log in."}


@router.get("/me", response_model=UserOut)
def read_current_user(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user
