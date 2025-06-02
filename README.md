# TurinIQ: AI-Powered Customer Service Platform

## Overview

TurinIQ is an innovative, AI-driven customer service platform designed to revolutionize how businesses interact with their customers. By leveraging advanced AI technologies, TurinIQ automates and enhances customer support processes, enabling businesses to provide seamless, personalized, and efficient service at scale. The platform intelligently processes business inputs, uploaded files, and website data to create a comprehensive knowledge base and tailored context prompts, empowering customer-facing agents to deliver exceptional support.

The vision behind TurinIQ is to empower businesses of all sizes—across industries like technology, retail, healthcare, and more—to elevate their customer experience while reducing operational overhead. By combining cutting-edge AI with a flexible and scalable backend, TurinIQ aims to set a new standard for customer service automation, making it accessible, adaptable, and impactful.


## Idea and Intentions

The core idea of TurinIQ is to bridge the gap between businesses and their customers through intelligent automation. Customer service is often a resource-intensive function, requiring significant time and effort to handle inquiries, troubleshoot issues, and maintain customer satisfaction. TurinIQ addresses these challenges by:

- **Automating Knowledge Creation**: TurinIQ processes business-specific data (documents, websites, and custom inputs) to build a dynamic knowledge base, ensuring agents have accurate and relevant information at their fingertips.
- **Personalized Customer Interactions**: By customizing agent behavior (tonality, communication style, and escalation protocols), TurinIQ delivers responses that align with a business’s brand and customer expectations.
- **Scalability and Flexibility**: The platform supports diverse industries and use cases, from answering FAQs to generating sales leads, making it a versatile tool for businesses with varying needs.
- **Seamless Escalation**: TurinIQ intelligently identifies when human intervention is required, creating support tickets for complex issues like refunds or urgent cases, ensuring no customer query goes unresolved.
- **Data-Driven Insights**: By capturing key customer information (e.g., name, email, phone), TurinIQ enables businesses to build stronger relationships and make informed decisions.

The intention is to create a platform that not only automates repetitive tasks but also enhances the human touch in customer service. TurinIQ empowers businesses to focus on growth and innovation while the platform handles routine interactions with precision and care.
**Explore TurinIQ**:

- **Demo Video**: Watch a demo of TurinIQ in action  
  [![TurinIQ Demo](https://img.youtube.com/vi/v1re-_5Rqiw/0.jpg)](https://youtu.be/v1re-_5Rqiw)
- **Architecture Diagram**: View the system design on Excalidraw  
  [TurinIQ System Diagram](idea.png)


The vision behind TurinIQ is to empower businesses of all sizes—across industries like technology, retail, healthcare, and more—to elevate their customer experience while reducing operational overhead. By combining cutting-edge AI with a flexible and scalable backend, TurinIQ aims to set a new standard for customer service automation, making it accessible, adaptable, and impactful.
## Potential and Impact

TurinIQ has immense potential to transform customer service across industries. Its key strengths lie in its ability to:

- **Enhance Customer Satisfaction**: By providing fast, accurate, and personalized responses, TurinIQ ensures customers feel heard and valued, fostering loyalty and trust.
- **Reduce Operational Costs**: Automation of routine inquiries and knowledge base creation minimizes the need for large support teams, allowing businesses to allocate resources strategically.
- **Adapt to Any Industry**: With configurable business types, goals, and communication styles, TurinIQ can serve startups, enterprises, and non-profits alike, from tech firms to healthcare providers.
- **Enable Scalable Growth**: As businesses expand, TurinIQ scales effortlessly, handling increased query volumes without compromising quality.
- **Drive Innovation**: By integrating AI-driven insights and real-time data processing, TurinIQ positions businesses to stay ahead in a competitive market.

The platform’s potential extends beyond customer service. It could evolve to support sales automation, employee training, or even internal knowledge management, making it a versatile tool for digital transformation. As AI technology advances, TurinIQ can integrate new models and capabilities, ensuring it remains at the forefront of innovation.

## Tech Stack

TurinIQ is built on a modern, robust tech stack designed for performance, scalability, and ease of integration:

- **Backend Framework**: [FastAPI](https://fastapi.tiangolo.com/) powers the API, providing high-performance, asynchronous endpoints for configuring agents and handling WebSocket-based customer interactions.
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) stores business data, knowledge bases, context prompts, and support tickets, offering flexibility and scalability for unstructured data.
- **AI Integration**: The [Gemini API (google-generativeai)](https://cloud.google.com/generative-ai) drives intelligent processing of files, website content, and customer interactions, enabling dynamic knowledge base creation and context-aware responses.
- **Web Scraping**: [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) and [requests](https://requests.readthedocs.io/) handle website scraping to extract and summarize relevant business information.
- **File Processing**: [PyPDF2](https://pypdf2.readthedocs.io/) processes uploaded PDF files, ensuring compatibility with diverse document formats.
- **Environment Management**: [python-dotenv](https://github.com/theskumar/python-dotenv) securely manages environment variables, such as API keys and database URIs.
- **WebSocket Support**: [websockets](https://websockets.readthedocs.io/) enables real-time, bidirectional communication for customer-agent interactions.
- **Server**: [Uvicorn](https://www.uvicorn.org/) serves as the ASGI server, ensuring efficient handling of HTTP and WebSocket requests.
- **Frontend**: A lightweight HTML interface (with WebSocket integration) provides a simple, user-friendly chat experience for customers.
- **Data Validation**: [Pydantic](https://pydantic-docs.helpmanual.io/) ensures robust data modeling and validation for business inputs and API payloads.

This tech stack combines the power of AI with a scalable backend and real-time communication, creating a foundation that is both robust and extensible.

## Getting Started

To set up TurinIQ locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/turiniq-be.git
   cd turiniq-be
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_atlas_uri
   ```

4. **Run the Application**:
   ```bash
   python main.py
   ```

5. **Access the Platform**:
   - API: `http://localhost:8000`
   - Customer Chat: Open `chatbot.html` in a browser and connect via WebSocket to `ws://localhost:8000/ws/customer/{business_id}`.

## Future Vision

TurinIQ is poised to redefine customer service by harnessing AI to deliver smarter, faster, and more human-like interactions. Its modular architecture and AI-driven core make it a platform with limitless potential, capable of adapting to emerging technologies and evolving business needs. Whether enabling small businesses to compete with industry giants or helping enterprises streamline operations, TurinIQ is a catalyst for the future of customer engagement.
