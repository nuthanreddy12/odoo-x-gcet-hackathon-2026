from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, get_db
from app.core.security import decode_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    if not token:
        # In hackathon mode or public dashboard preview, allow non-authenticated browsing
        return None
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def require_user(user: Optional[User] = Depends(get_current_user)) -> User:
    """
    Ensures the request has a valid authenticated user.
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_roles(*allowed_roles: str):
    """
    RBAC dependency factory.
    Allowed roles:
    - 'inventory_manager' (and 'admin') -> Full access
    - 'warehouse_staff' -> Operational access only
    """
    def role_checker(user: User = Depends(require_user)) -> User:
        user_role = (user.role or "").lower().strip()
        effective_roles = {user_role}
        if user_role == "admin":
            effective_roles.add("inventory_manager")

        normalized_allowed = {r.lower().strip() for r in allowed_roles}
        if "inventory_manager" in normalized_allowed:
            normalized_allowed.add("admin")

        if not effective_roles.intersection(normalized_allowed):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Action requires one of {list(allowed_roles)} privileges."
            )
        return user
    return role_checker


# Role shortcut dependencies
require_inventory_manager = require_roles("inventory_manager")
require_warehouse_staff = require_roles("warehouse_staff", "inventory_manager")
