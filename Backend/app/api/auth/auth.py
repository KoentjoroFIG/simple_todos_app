# Auth API
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Optional
from app.api.auth.schema import UserRegister, UserLogin, Token, User, UserInDB
from app.utils.jwt_utils import (
    hash_password, 
    verify_password, 
    create_access_token, 
    get_user_from_token
)

# Router for authentication endpoints
router = APIRouter(prefix="/auth", tags=["authentication"])

# Security scheme for JWT
security = HTTPBearer()

# Local dictionary to store users (in production, use a proper database)
users_db: Dict[str, UserInDB] = {
    "testuser": UserInDB(
        username="testuser",
        email="test@test.com",
        hashed_password=hash_password("123456")
    )
}

def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Get user by email from local dictionary storage"""
    for user in users_db.values():
        if user.email == email:
            return user
    return None

def get_user_by_username(username: str) -> Optional[UserInDB]:
    """Get user by username from local dictionary storage"""
    return users_db.get(username)

def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    """Authenticate user credentials"""
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current user from JWT token"""
    token = credentials.credentials
    email = get_user_from_token(token)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = get_user_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return User(username=user.username, email=user.email)

@router.post("/register", response_model=User)
async def register_user(user_data: UserRegister):
    """Register a new user"""
    # Check if user already exists by username
    if get_user_by_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    if get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    user_in_db = UserInDB(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    # Store user in local dictionary
    users_db[user_data.username] = user_in_db
    
    return User(username=user_in_db.username, email=user_in_db.email)

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """Login user and return JWT token"""
    user = authenticate_user(user_credentials.email, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token using email as subject
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information (protected route)"""
    return current_user

@router.get("/users")
async def get_all_users(current_user: User = Depends(get_current_user)):
    """Get all registered users (protected route for testing)"""
    return {
        "total_users": len(users_db),
        "users": [User(username=user.username, email=user.email) for user in users_db.values()]
    }