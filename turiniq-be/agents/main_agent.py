import asyncio
import os

import google.generativeai as genai
from dotenv import load_dotenv

from agents.context_builder import BusinessInput, build_context
from agents.file_processor import process_files
from agents.web_scraper import scrape_website

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def main_agent_process(input_data: BusinessInput, file_contents: list[str]) -> dict:
    """Orchestrates file processing, web scraping, and context building."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Step 1: Process files
    file_prompt = """
    You are a file processing agent for TurinIQ. Extract key information from the provided text files to create a concise knowledge base summarizing the business details, products, services, or other relevant information. Return the knowledge base as a plain text string.
    """
    file_knowledge_base = await process_files(file_contents, model, file_prompt)
    
    # Step 2: Scrape website
    web_knowledge_base = await scrape_website(str(input_data.domain), model)
    
    # Combine knowledge bases
    combined_knowledge_base = f"{file_knowledge_base}\n\nWeb Data:\n{web_knowledge_base}"
    
    # Step 3: Build context prompt
    context_prompt = await build_context(input_data, combined_knowledge_base, model)
    
    # Step 4: Save to MongoDB
    from db.mongodb import save_business_data
    business_id = f"{input_data.business_type}_{input_data.domain}"
    save_business_data(business_id, combined_knowledge_base, context_prompt)
    
    return {
        "business_id": business_id,
        "context_prompt": context_prompt
    }