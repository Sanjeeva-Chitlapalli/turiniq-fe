from typing import List

import google.generativeai as genai
import PyPDF2


async def process_files(file_contents: List[str], model: genai.GenerativeModel, prompt: str) -> str:
    """Processes uploaded files using Gemini API to create a knowledge base."""
    knowledge_base = ""
    for content in file_contents:
        try:
            # Try to process as PDF
            reader = PyPDF2.PdfReader(content.encode())
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except:
            # Treat as plain text
            text = content
        
        # Use Gemini to summarize
        response = model.generate_content(f"{prompt}\n\nFile Content:\n{text}")
        knowledge_base += response.text + "\n"
    
    return knowledge_base.strip()