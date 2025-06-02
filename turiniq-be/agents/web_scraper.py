import google.generativeai as genai
import requests
from bs4 import BeautifulSoup


async def scrape_website(domain: str, model: genai.GenerativeModel) -> str:
    """Scrapes the website using Gemini API to summarize content."""
    try:
        response = requests.get(domain, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Extract raw content
        raw_content = f"Website: {domain}\n"
        for link in soup.find_all("a", href=True):
            title = link.get_text().strip() or "No title"
            href = link["href"]
            raw_content += f"Page: {title} - URL: {href}\n"
        
        # Use Gemini to summarize
        prompt = """
        You are a web scraping agent for TurinIQ. Summarize the website content to include the sitemap, products, services, and other relevant business details. Return the summary as a plain text string.
        """
        response = model.generate_content(f"{prompt}\n\nRaw Content:\n{raw_content}")
        return response.text.strip()
    except Exception as e:
        return f"Error scraping {domain}: {str(e)}"