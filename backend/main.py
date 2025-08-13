from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
from dotenv import load_dotenv

from database import connect_to_mongo, close_mongo_connection
from auth import auth_router
from models import User
from utils import verify_token

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Xploit-Eye Authentication API",
    description="Secure authentication system with JWT and MongoDB",
    version="1.0.0"
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Database connection events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# Protected route example
@app.get("/api/dashboard")
async def get_dashboard(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Protected dashboard endpoint - requires valid JWT token"""
    try:
        payload = verify_token(credentials.credentials)
        user_email = payload.get("sub")
        
        if not user_email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Get user info (excluding password)
        user = await User.get_by_email(user_email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "success": True,
            "message": "Dashboard data retrieved successfully",
            "data": {
                "user": {
                    "name": user["name"],
                    "username": user["username"],
                    "email": user["email"],
                    "created_at": user["created_at"]
                }
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "message": "API is running successfully",
        "data": {
            "status": "healthy",
            "version": "1.0.0"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
