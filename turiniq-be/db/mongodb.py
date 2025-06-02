import os

from dotenv import load_dotenv
from pymongo import MongoClient


def get_mongo_client():
    load_dotenv()
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise ValueError("MONGODB_URI not found in .env")
    return MongoClient(uri)

def save_business_data(business_id: str, knowledge_base: str, context_prompt: str):
    client = get_mongo_client()
    db = client["turiniq"]
    collection = db["business_data"]
    collection.update_one(
        {"business_id": business_id},
        {"$set": {"knowledge_base": knowledge_base, "context_prompt": context_prompt}},
        upsert=True
    )
    
def get_business_data(business_id: str) -> dict:
    client = get_mongo_client()
    db = client["turiniq"]
    collection = db["business_data"]
    doc = collection.find_one({"business_id": business_id})
    return doc if doc else {"knowledge_base": "", "context_prompt": ""}