import motor.motor_asyncio
import os
from dotenv import load_dotenv
from logger import Logger

def get_db():
    '''
    Returns a database object for querying
    '''
    load_dotenv()
    url = os.getenv('MONGO_URL')
    if url == None:
        Logger.error("MONGO_URL not found in .env file")
        exit()

    auth = ""
    if os.getenv('MONGO_USERNAME') and os.getenv('MONGO_PASSWORD'):
        auth = f"{os.getenv('MONGO_USERNAME')}:{os.getenv('MONGO_PASSWORD')}@"

    uri = f'mongodb://{auth}{url}/'

    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(uri)
        db = client.aum
        return db
    except Exception as e:
        Logger.error(f"An error occurred in MongoDB: {e}")
        return e
