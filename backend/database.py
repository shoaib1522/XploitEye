import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
client = None
database = None

async def connect_to_mongo():
    """Create database connection"""
    global client, database
    
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/xploit_eye")
    
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(mongodb_uri)
        # Test the connection
        await client.admin.command('ping')
        
        # Extract database name from URI or use default
        if "/" in mongodb_uri:
            db_name = mongodb_uri.split("/")[-1]
        else:
            db_name = "xploit_eye"
            
        database = client[db_name]
        
        # Create indexes for better performance and uniqueness
        await database.users.create_index("email", unique=True)
        await database.users.create_index("username", unique=True)
        
        print(f"Connected to MongoDB database: {db_name}")
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

def get_database():
    """Get database instance"""
    return database
