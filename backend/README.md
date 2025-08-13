# Xploit-Eye Authentication API

A secure FastAPI backend with JWT authentication, MongoDB integration, and comprehensive user management.

## Features

- 🔐 **Secure Authentication**: JWT tokens with bcrypt password hashing
- 📧 **Email Validation**: Unique email constraints with format validation
- 👤 **User Management**: Complete signup/signin with username uniqueness
- 🛡️ **Security**: Rate limiting, CORS, input validation, and sanitization
- 📊 **MongoDB**: Async database operations with proper indexing
- 🚀 **FastAPI**: Modern, fast API with automatic documentation

## Quick Start

### 1. Environment Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
```

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET_KEY`: Secret key for JWT tokens (change in production!)
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `CORS_ORIGINS`: Allowed frontend origins

### 3. MongoDB Setup

Make sure MongoDB is running locally or provide a remote MongoDB URI in your `.env` file.

### 4. Start the Server

```bash
# Using the run script
python run.py

# Or directly with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "user": {
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00"
    }
  }
}
```

#### POST `/api/auth/signin`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "user": {
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00"
    }
  }
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User information retrieved successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00"
    }
  }
}
```

#### POST `/api/auth/logout`
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Protected Endpoints

#### GET `/api/dashboard`
Access protected dashboard data (requires authentication).

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00"
    }
  }
}
```

### Utility Endpoints

#### GET `/api/health`
Health check endpoint.

**Response (200):**
```json
{
  "success": true,
  "message": "API is running successfully",
  "data": {
    "status": "healthy",
    "version": "1.0.0"
  }
}
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- Maximum 128 characters
- Must contain at least one letter
- Must contain at least one number

### Username Requirements
- Minimum 3 characters
- Maximum 20 characters
- Only letters, numbers, and underscores allowed
- Automatically converted to lowercase
- Must be unique

### Name Requirements
- Minimum 2 characters
- Maximum 50 characters
- Whitespace trimmed

## Security Features

- **Rate Limiting**: 5 requests/minute for signup, 10 requests/minute for signin
- **Password Hashing**: Bcrypt with automatic salt generation
- **JWT Security**: Configurable expiration and secret key
- **Input Validation**: Comprehensive validation with Pydantic
- **CORS Protection**: Configurable allowed origins
- **Database Indexing**: Unique constraints on email and username

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "detail": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors, duplicate data)
- `401`: Unauthorized (invalid credentials, expired token)
- `404`: Not Found (user not found)
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

## Development

### Project Structure
```
backend/
├── main.py              # FastAPI application entry point
├── auth.py              # Authentication routes
├── models.py            # Pydantic models and database operations
├── database.py          # MongoDB connection and setup
├── utils.py             # Utility functions (JWT, password hashing)
├── run.py               # Server startup script
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md           # This documentation
```

### Adding New Endpoints

1. Create route functions in appropriate modules
2. Add proper authentication decorators for protected routes
3. Use consistent response format with `create_response()`
4. Add rate limiting where appropriate
5. Include proper error handling

### Database Operations

Use the `User` class methods for database operations:
- `User.create(user_data)` - Create new user
- `User.get_by_email(email)` - Get user by email
- `User.get_by_username(username)` - Get user by username
- `User.email_exists(email)` - Check if email exists
- `User.username_exists(username)` - Check if username exists

## Production Deployment

1. **Environment Variables**: Update all environment variables with production values
2. **JWT Secret**: Use a strong, randomly generated JWT secret key
3. **MongoDB**: Use a production MongoDB instance with proper security
4. **HTTPS**: Deploy behind a reverse proxy with SSL/TLS
5. **Rate Limiting**: Adjust rate limits based on your needs
6. **Monitoring**: Add logging and monitoring for production use

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check the `MONGODB_URI` in your `.env` file
   - Verify network connectivity

2. **JWT Token Invalid**
   - Check if the token has expired
   - Verify the `JWT_SECRET_KEY` matches between requests
   - Ensure proper Authorization header format

3. **CORS Errors**
   - Update `CORS_ORIGINS` in `.env` to include your frontend URL
   - Ensure the frontend is making requests to the correct backend URL

4. **Rate Limiting**
   - Wait for the rate limit window to reset
   - Adjust rate limits in the code if needed for development
