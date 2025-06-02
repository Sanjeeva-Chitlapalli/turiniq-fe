import asyncio
import json
import logging
import os
import re
from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import WebSocket
from pydantic import BaseModel

from db.mongodb import get_business_data, get_mongo_client

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class CustomerType(str, Enum):
    EXISTING = "existing"
    NEW = "new"

class Ticket(BaseModel):
    business_id: str
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    conversation: list[dict]
    reason: str
    status: str = "open"
    created_at: datetime = datetime.utcnow()

class Lead(BaseModel):
    business_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    conversation: list[dict]
    reason: str
    status: str = "open"
    created_at: datetime = datetime.utcnow()

def clean_json_response(response_text: str) -> str:
    """Remove markdown code block markers and ensure valid JSON string."""
    if not response_text:
        logger.error("Empty response text received")
        return "{}"
    cleaned = re.sub(r'^```json\n|```\n?$', '', response_text, flags=re.MULTILINE).strip()
    try:
        json.loads(cleaned)
        return cleaned
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON after cleaning: {cleaned}, Error: {str(e)}")
        return "{}"

async def identify_customer(model: genai.GenerativeModel, message: str, business_id: str) -> tuple[CustomerType, Dict[str, Any]]:
    """Identify customer type and collect details."""
    prompt = f"""
    You are a TurinIQ customer identification agent. Based on the user's message, determine if they are an existing customer (mentions account, order, support issues, or refunds) or a new customer (general inquiries, product interest). Extract any provided customer info (name, email, phone, customer_id).

    Business ID: {business_id}
    User Message: {message}
    Format: {{"customer_type": "existing|new", "customer_info": {{"customer_id": str|null, "name": str|null, "email": str|null, "phone": str|null}}}}
    """
    for attempt in range(3):
        try:
            response = model.generate_content(prompt)
            logger.debug(f"Gemini API raw response (identify_customer): {response.text}")
            cleaned_response = clean_json_response(response.text)
            logger.debug(f"Cleaned customer identification response: {cleaned_response}")
            result = json.loads(cleaned_response)
            customer_type = CustomerType.EXISTING if result.get("customer_type") == "existing" else CustomerType.NEW
            return customer_type, result.get("customer_info", {})
        except (json.JSONDecodeError, genai.exceptions.APIError) as e:
            logger.error(f"Error on attempt {attempt + 1}: {str(e)}")
            if attempt < 2:
                await asyncio.sleep(2 ** attempt)
                continue
            return CustomerType.NEW, {}
    logger.error("Failed to identify customer after 3 retries")
    return CustomerType.NEW, {}

async def collect_customer_details(
    websocket: WebSocket,
    customer_info: Dict[str, Any],
    conversation: list[dict],
    model: genai.GenerativeModel
) -> Dict[str, Any]:
    """Prompt for missing customer details."""
    required_fields = ["name", "email", "phone"]
    missing_fields = [field for field in required_fields if not customer_info.get(field)]
    if not missing_fields:
        return customer_info

    for field in missing_fields:
        prompt_message = f"Please provide your {field} to proceed."
        await websocket.send_text(prompt_message)
        conversation.append({"agent": prompt_message, "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")})
        message = await websocket.receive_text()
        conversation.append({"user": message, "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")})
        logger.info(f"Received {field}: {message}")

        prompt = f"""
        Extract the {field} from the user's message.
        Message: {message}
        Return JSON: {{"{field}": str|null}}
        """
        try:
            response = model.generate_content(prompt)
            cleaned_response = clean_json_response(response.text)
            data = json.loads(cleaned_response)
            customer_info[field] = data.get(field) or customer_info.get(field)
        except Exception as e:
            logger.error(f"Error extracting {field}: {str(e)}")
            customer_info[field] = None

    # Ensure all fields are filled for leads
    for field in required_fields:
        if not customer_info.get(field):
            customer_info[field] = "Unknown"
    return customer_info

async def handle_support_agent(
    websocket: WebSocket,
    business_id: str,
    customer_info: Dict[str, Any],
    conversation: list[dict],
    model: genai.GenerativeModel
):
    business_data = get_business_data(business_id)
    context_prompt = business_data.get("context_prompt", "You are a TurinIQ support agent. Be friendly and concise.")
    knowledge_base = business_data.get("knowledge_base", "")

    while True:
        try:
            message = await websocket.receive_text()
            conversation.append({"user": message, "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")})
            logger.info(f"Received message: {message}")

            # Escalation check
            escalation_prompt = f"""
            Check if the message requires escalation.
            Context: {context_prompt}
            Message: {message}
            Return JSON: {{"escalate": bool, "reason": str}}
            Note: Escalate immediately if the message mentions refunds with reason "Refund request escalation".
            """
            escalation_data = {"escalate": False, "reason": ""}
            for attempt in range(3):
                try:
                    escalation_response = model.generate_content(escalation_prompt)
                    logger.debug(f"Escalation raw response: {escalation_response.text}")
                    cleaned_escalation = clean_json_response(escalation_response.text)
                    logger.debug(f"Escalation cleaned response: {cleaned_escalation}")
                    escalation_data = json.loads(cleaned_escalation)
                    break
                except (json.JSONDecodeError, genai.exceptions.APIError) as e:
                    logger.error(f"Escalation error on attempt {attempt + 1}: {str(e)}")
                    if attempt < 2:
                        await asyncio.sleep(2 ** attempt)
                        continue

            if escalation_data.get("escalate", False):
                # Collect customer details if missing
                customer_info = await collect_customer_details(websocket, customer_info, conversation, model)
                ticket = Ticket(
                    business_id=business_id,
                    customer_id=customer_info.get("customer_id"),
                    customer_name=customer_info.get("name"),
                    customer_email=customer_info.get("email"),
                    customer_phone=customer_info.get("phone"),
                    conversation=conversation,
                    reason=escalation_data.get("reason", "Escalation requested"),
                    status="open",
                    created_at=datetime.utcnow()
                )
                save_ticket(ticket)
                logger.info(f"Ticket created: {ticket.dict()}")
                await websocket.send_text("Your request has been escalated. A support ticket has been created.")
                return

            # Support response
            support_prompt = f"""
            You are a TurinIQ support agent. Respond to the customer's message.
            Context: {context_prompt}
            Knowledge Base: {knowledge_base[:1000]}...
            Message: {message}
            """
            for attempt in range(3):
                try:
                    response = model.generate_content(support_prompt)
                    cleaned_response = clean_json_response(response.text) if response.text.startswith("```json") else response.text
                    await websocket.send_text(cleaned_response)
                    conversation.append({"agent": cleaned_response, "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")})
                    break
                except genai.exceptions.APIError as e:
                    logger.error(f"Support response error on attempt {attempt + 1}: {str(e)}")
                    if attempt < 2:
                        await asyncio.sleep(2 ** attempt)
                        continue
                    await websocket.send_text("Sorry, I encountered an issue. Please try again.")
                    break
        except Exception as e:
            logger.error(f"Support agent error: {str(e)}")
            await websocket.send_text("Sorry, an error occurred. Please try again later.")
            break

async def handle_sales_agent(
    websocket: WebSocket,
    business_id: str,
    customer_info: Dict[str, Any],
    conversation: list[dict],
    model: genai.GenerativeModel
):
    business_data = get_business_data(business_id)
    context_prompt = business_data.get("context_prompt", "You are a TurinIQ sales agent. Be friendly and engaging to assist potential customers.")
    knowledge_base = business_data.get("knowledge_base", "")

    # Collect customer details upfront
    customer_info = await collect_customer_details(websocket, customer_info, conversation, model)

    while True:
        try:
            message = await websocket.receive_text()
            conversation.append({"user": message, "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")})
            logger.info(f"Received message: {message}")

            # Sales response
            sales_prompt = f"""
            You are a TurinIQ sales agent. Respond to the potential customer's message to answer their queries and encourage engagement.
            Context: {context_prompt}
            Knowledge Base: {knowledge_base[:1000]}...
            Message: {message}
            Return JSON: {{"response": str, "reason": str}}
            """
            response_data = {"response": "Sorry, I couldn't process your request.", "reason": "General inquiry"}
            for attempt in range(3):
                try:
                    response = model.generate_content(sales_prompt)
                    cleaned_response = clean_json_response(response.text)
                    response_data = json.loads(cleaned_response)
                    break
                except (json.JSONDecodeError, genai.exceptions.APIError) as e:
                    logger.error(f"Sales response error on attempt {attempt + 1}: {str(e)}")
                    if attempt < 2:
                        await asyncio.sleep(2 ** attempt)
                        continue
                    break

            await websocket.send_text(response_data.get("response"))
            conversation.append({"agent": response_data.get("response"), "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")})

            # Save lead after each interaction
            lead = Lead(
                business_id=business_id,
                customer_name=customer_info["name"],
                customer_email=customer_info["email"],
                customer_phone=customer_info["phone"],
                conversation=conversation,
                reason=response_data.get("reason", "General inquiry"),
                status="open",
                created_at=datetime.utcnow()
            )
            save_lead(lead)
            logger.info(f"Lead saved: {lead.dict()}")

        except Exception as e:
            logger.error(f"Sales agent error: {str(e)}")
            await websocket.send_text("Sorry, an error occurred. Please try again later.")
            break

def save_ticket(ticket: Ticket):
    try:
        client = get_mongo_client()
        db = client["turiniq"]
        collection = db["tickets"]
        result = collection.insert_one(ticket.dict())
        logger.info(f"Ticket saved to MongoDB: {result.inserted_id}")
    except Exception as e:
        logger.error(f"Failed to save ticket: {str(e)}")
        raise

def save_lead(lead: Lead):
    try:
        client = get_mongo_client()
        db = client["turiniq"]
        collection = db["leads"]
        result = collection.insert_one(lead.dict())
        logger.info(f"Lead saved to MongoDB: {result.inserted_id}")
    except Exception as e:
        logger.error(f"Failed to save lead: {str(e)}")
        raise

async def customer_agent(websocket: WebSocket, business_id: str):
    model = genai.GenerativeModel("gemini-1.5-flash")
    conversation = []

    try:
        business_data = get_business_data(business_id)
        context_prompt = business_data.get("context_prompt", "Hello! Welcome to our support! How can I assist you today?")
        await websocket.send_text(context_prompt.split("\n")[0])
        logger.info(f"Sent initial message for business_id: {business_id}")

        message = await websocket.receive_text()
        conversation.append({"user": message, "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")})
        customer_type, customer_info = await identify_customer(model, message, business_id)
        logger.info(f"Customer type: {customer_type}, Info: {customer_info}")

        if customer_type == CustomerType.EXISTING:
            await handle_support_agent(websocket, business_id, customer_info, conversation, model)
        else:
            await handle_sales_agent(websocket, business_id, customer_info, conversation, model)
    except Exception as e:
        logger.error(f"Customer agent error: {str(e)}")
        await websocket.send_text("Sorry, an error occurred. Please try again later.")
        await websocket.close()