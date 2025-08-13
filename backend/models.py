from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
from database import get_database
from bson import ObjectId
import re

class UserCreate(BaseModel):
    """User creation model with validation"""
    name: str
    username: str
    email: EmailStr
    password: str
    confirm_password: str
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v.strip()) > 50:
            raise ValueError('Name must be less than 50 characters')
        return v.strip()
    
    @validator('username')
    def validate_username(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if len(v.strip()) > 20:
            raise ValueError('Username must be less than 20 characters')
        if not re.match(r'^[a-zA-Z0-9_]+$', v.strip()):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v.strip().lower()
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if len(v) > 128:
            raise ValueError('Password must be less than 128 characters')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v
    
    @validator('confirm_password')
    def validate_confirm_password(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class UserLogin(BaseModel):
    """User login model allowing email or username"""
    identifier: str  # can be email or username
    password: str

class UserResponse(BaseModel):
    """User response model (excluding password)"""
    name: str
    username: str
    email: str
    created_at: datetime

class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str
    user: UserResponse

class User:
    """User database operations"""
    
    @staticmethod
    async def create(user_data: dict) -> dict:
        """Create a new user"""
        db = get_database()
        user_data['created_at'] = datetime.utcnow()
        result = await db.users.insert_one(user_data)
        user_data['_id'] = result.inserted_id
        return user_data
    
    @staticmethod
    async def get_by_email(email: str) -> Optional[dict]:
        """Get user by email"""
        db = get_database()
        return await db.users.find_one({"email": email})
    
    @staticmethod
    async def get_by_username(username: str) -> Optional[dict]:
        """Get user by username"""
        db = get_database()
        return await db.users.find_one({"username": username})
    
    @staticmethod
    async def get_by_id(user_id: str) -> Optional[dict]:
        """Get user by ID"""
        db = get_database()
        try:
            return await db.users.find_one({"_id": ObjectId(user_id)})
        except:
            return None
    
    @staticmethod
    async def email_exists(email: str) -> bool:
        """Check if email already exists"""
        user = await User.get_by_email(email)
        return user is not None
    
    @staticmethod
    async def username_exists(username: str) -> bool:
        """Check if username already exists"""
        user = await User.get_by_username(username)
        return user is not None
