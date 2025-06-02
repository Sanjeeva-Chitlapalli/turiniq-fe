# endpoints.py
from enum import Enum
from typing import List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, WebSocket
from fastapi.responses import FileResponse
from pydantic import BaseModel

from db.mongodb import get_mongo_client

router = APIRouter()  # Use APIRouter instead of FastAPI

# Define enums (unchanged)
class BusinessType(str, Enum):
    TECH = "tech"
    FINANCE = "finance"
    HEALTHCARE = "healthcare"
    RETAIL = "retail"
    EDUCATION = "education"
    HOSPITALITY = "hospitality"
    MANUFACTURING = "manufacturing"
    REAL_ESTATE = "real_estate"
    TRANSPORTATION = "transportation"
    NON_PROFIT = "non_profit"

class AgentGoal(str, Enum):
    CUSTOMER_SUPPORT = "Provide Customer Support"
    SALES_LEADS = "Generate Sales Leads"
    ANSWER_FAQS = "Answer FAQs"
    TROUBLESHOOT_ISSUES = "Troubleshoot Issues"
    OTHER = "Other"

class Tonality(str, Enum):
    FRIENDLY = "friendly"
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    FORMAL = "formal"
    EMPATHETIC = "empathetic"

class CommunicationStyle(str, Enum):
    SIMPLE_LANGUAGE = "Use simple language"
    GREETING = "Introduce yourself with a greeting"
    CONCISE = "Keep answers concise"
    NO_GUARANTEES = "Don’t guarantee outcomes"
    NAMING_CONVENTIONS = "Follow naming conventions"
    EMPATHY = "Show empathy and care"
    SEASONAL_GREETINGS = "Add seasonal greetings"
    NO_EMAIL_REFERRALS = "Avoid directing queries to email"
    PERSONALIZE = "Personalize responses with names"
    CUSTOM_STYLE = "Add Custom Style"

class ContextClarity(str, Enum):
    CLARIFY_BRIEF = "Clarify brief messages"
    CLARIFY_LOCATION = "Clarify geographical location"
    CLARIFY_PRODUCT = "Clarify product type"
    CLARIFY_PLATFORM = "Clarify platform for troubleshooting"
    CUSTOM_CLARIFICATION = "Add Custom Clarification"

class HandoverEscalation(str, Enum):
    ESCALATE_REFUNDS = "Escalate refund requests"
    ESCALATE_FRUSTRATED = "Escalate frustrated or urgent cases"
    ESCALATE_MEDICAL = "Escalate medical advice requests"
    ESCALATE_EMAIL_CHANGE = "Escalate email change requests"
    CUSTOM_ESCALATION = "Add Custom Description"

class DataToCapture(str, Enum):
    NAME = "name"
    EMAIL = "email"
    PHONE = "phone_number"
    COMPANY = "company_name"
    OTHER = "other"

class BusinessInput(BaseModel):
    business_type: BusinessType
    domain: str  # Changed from HttpUrl to str
    agent_goal: AgentGoal
    agent_goal_other: Optional[str] = None
    tonality: Tonality
    communication_style: List[CommunicationStyle]
    communication_style_custom: Optional[str] = None
    context_clarity: List[ContextClarity]
    context_clarity_custom: Optional[str] = None
    handover_escalation: List[HandoverEscalation]
    handover_escalation_custom: Optional[str] = None
    data_to_capture: List[DataToCapture]
    data_to_capture_other: Optional[str] = None
    custom_opening_message: str
    custom_instructions: Optional[str] = None

@router.post("/configure-agent")
async def configure_agent(
    business_type: str = Form(...),
    domain: str = Form(...),
    agent_goal: str = Form(...),
    agent_goal_other: Optional[str] = Form(None),
    tonality: str = Form(...),
    communication_style: str = Form(...),
    communication_style_custom: Optional[str] = Form(None),
    context_clarity: str = Form(...),
    context_clarity_custom: Optional[str] = Form(None),
    handover_escalation: str = Form(...),
    handover_escalation_custom: Optional[str] = Form(None),
    data_to_capture: str = Form(...),
    data_to_capture_other: Optional[str] = Form(None),
    custom_opening_message: str = Form(...),
    custom_instructions: Optional[str] = Form(None),
    files: List[UploadFile] = File([])
):
    try:
        input_data = BusinessInput(
            business_type=business_type,
            domain=domain,
            agent_goal=agent_goal,
            agent_goal_other=agent_goal_other,
            tonality=tonality,
            communication_style=communication_style.split(","),
            communication_style_custom=communication_style_custom,
            context_clarity=context_clarity.split(","),
            context_clarity_custom=context_clarity_custom,
            handover_escalation=handover_escalation.split(","),
            handover_escalation_custom=handover_escalation_custom,
            data_to_capture=data_to_capture.split(","),
            data_to_capture_other=data_to_capture_other,
            custom_opening_message=custom_opening_message,
            custom_instructions=custom_instructions
        )
        # Placeholder for main_agent_process
        from agents.main_agent import main_agent_process
        result = await main_agent_process(input_data, [await file.read() for file in files])
        return {
            "status": "success",
            "business_id": result["business_id"],
            "context_prompt": result["context_prompt"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{business_id}")
async def serve_chatbot(business_id: str):
    return FileResponse("static/chatbot.html")

@router.websocket("/ws/customer/{business_id}")
async def websocket_endpoint(websocket: WebSocket, business_id: str):
    await websocket.accept()  # Accept connection
    from agents.customer_agent import customer_agent
    await customer_agent(websocket, business_id)

@router.get("/")
async def root():
    return {"message": "Server is running"}

@router.websocket("/ws/test")
async def websocket_test(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established!")

@router.get("/tickets/{business_id}")
async def get_tickets_by_business_id(business_id: str):
    try:
        client = get_mongo_client()
        db = client["turiniq"]
        collection = db["tickets"]
        tickets = list(collection.find({"business_id": business_id}, {"_id": 0}))  # Exclude MongoDB _id field
        return {"status": "success", "tickets": tickets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tickets for business_id {business_id}: {str(e)}")

@router.get("/leads/{business_id}")
async def get_leads_by_business_id(business_id: str):
    try:
        client = get_mongo_client()
        db = client["turiniq"]
        collection = db["leads"]
        leads = list(collection.find({"business_id": business_id}, {"_id": 0}))  # Exclude MongoDB _id field
        return {"status": "success", "leads": leads}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leads for business_id {business_id}: {str(e)}")