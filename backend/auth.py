from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import ValidationError
from datetime import timedelta

from models import UserCreate, UserLogin, UserResponse, TokenResponse, User
from utils import hash_password, verify_password, create_access_token, create_response, verify_token

# Initialize router and rate limiter
auth_router = APIRouter()
# limiter = Limiter(key_func=get_remote_address)
security = HTTPBearer()

@auth_router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
# @limiter.limit("5/minute")
async def signup(user_data: UserCreate):
    # """User registration endpoint with rate limiting"""
    try:
        # Check if email already exists
        if await User.email_exists(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        if await User.username_exists(user_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user data
        user_dict = {
            "name": user_data.name,
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password
        }
        
        # Save user to database
        created_user = await User.create(user_dict)
        
        # Create access token
        access_token = create_access_token(data={"sub": user_data.email})
        
        # Prepare user response (excluding password)
        user_response = UserResponse(
            name=created_user["name"],
            username=created_user["username"],
            email=created_user["email"],
            created_at=created_user["created_at"]
        )
        
        # Prepare token response
        token_data = TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
        
        return create_response(
            success=True,
            message="Account created successfully",
            data=token_data.dict()
        )
        
    except ValidationError as e:
        # Handle pydantic validation errors
        error_messages = []
        for error in e.errors():
            field = error["loc"][-1]
            message = error["msg"]
            error_messages.append(f"{field}: {message}")
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(error_messages)
        )
    
    except HTTPException:
        raise
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during registration"
        )

@auth_router.post("/signin", response_model=dict)
#@limiter.limit("10/minute")
async def signin(user_credentials: UserLogin):
    # """User login endpoint with rate limiting. Accepts email or username in 'identifier'."""
    try:
        identifier = user_credentials.identifier.strip()

        user = None
        # Try to detect email format; fallback to username
        if "@" in identifier:
            user = await User.get_by_email(identifier)
        if not user:
            user = await User.get_by_username(identifier.lower())

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # Verify password
        if not verify_password(user_credentials.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # Create access token
        access_token = create_access_token(data={"sub": user["email"]})

        # Prepare user response (excluding password)
        user_response = UserResponse(
            name=user["name"],
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"]
        )

        # Prepare token response
        token_data = TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )

        return create_response(
            success=True,
            message="Login successful",
            data=token_data.dict()
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during login"
        )

@auth_router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """User logout endpoint"""
    try:
        # Verify token is valid
        payload = verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # In a production system, you might want to blacklist the token
        # For now, we'll just return a success response
        return create_response(
            success=True,
            message="Logout successful"
        )
        
    except HTTPException:
        raise
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during logout"
        )

@auth_router.get("/me", response_model=dict)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user information"""
    try:
        payload = verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user_email = payload.get("sub")
        if not user_email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user from database
        user = await User.get_by_email(user_email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Prepare user response (excluding password)
        user_response = UserResponse(
            name=user["name"],
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"]
        )
        
        return create_response(
            success=True,
            message="User information retrieved successfully",
            data={"user": user_response.dict()}
        )
        
    except HTTPException:
        raise
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
