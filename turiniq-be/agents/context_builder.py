from enum import Enum
from typing import List, Optional

import google.generativeai as genai
from pydantic import BaseModel
from pydantic.networks import HttpUrl  # Import HttpUrl


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
    domain: HttpUrl
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

async def build_context(input_data: BusinessInput, knowledge_base: str, model: genai.GenerativeModel) -> str:
    """Builds a context prompt for the customer agent."""
    prompt = f"""
    You are a context builder agent for TurinIQ. Create a context prompt for a customer service agent based on the following:

    Business Type: {input_data.business_type}
    Domain: {input_data.domain}
    Agent Goal: {input_data.agent_goal}{' - ' + input_data.agent_goal_other if input_data.agent_goal_other else ''}
    Tonality: {input_data.tonality}
    Communication Style: {', '.join(input_data.communication_style)}{' - ' + input_data.communication_style_custom if input_data.communication_style_custom else ''}
    Context & Clarity: {', '.join(input_data.context_clarity)}{' - ' + input_data.context_clarity_custom if input_data.context_clarity_custom else ''}
    Handover & Escalation: {', '.join(input_data.handover_escalation)}{' - ' + input_data.handover_escalation_custom if input_data.handover_escalation_custom else ''}
    Data to Capture: {', '.join(input_data.data_to_capture)}{' - ' + input_data.data_to_capture_other if input_data.data_to_capture_other else ''}
    Custom Opening Message: {input_data.custom_opening_message}
    Custom Instructions: {input_data.custom_instructions or 'None'}
    Knowledge Base: {knowledge_base[:1000]}... (truncated for brevity)

    The prompt should enable the agent to serve customers effectively, following the specified tonality, style, and instructions. Return a plain text string.
    """
    response = model.generate_content(prompt)
    return response.text