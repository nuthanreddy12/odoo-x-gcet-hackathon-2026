from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import jwt
from app.core.config import settings
import hashlib
import os
import secrets

ALGORITHM = "HS256"


def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt, key_hex = hashed_password.split("$")
        new_key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return secrets.compare_digest(new_key.hex(), key_hex)
    except Exception:
        return False


def decode_token(token: str) -> Optional[dict]:
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except Exception:
        return None
