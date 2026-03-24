import os
import sys
import json
import logging
import google.generativeai as genai
from dotenv import load_dotenv
from generate_blog import generate_blog_post

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def setup_gemini():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logging.error("GEMINI_API_KEY not found in .env file.")
        raise ValueError("Please provide GEMINI_API_KEY in your .env file.")
    
    genai.configure(api_key=api_key)
    # We will use the latest available model for text generation
    model = genai.GenerativeModel('gemini-1.5-pro')
    return model

def generate_article(model):
    prompt = """You are a professional blog writer for 'BharatOne Spaces', a premium commercial real estate broker and coworking space provider in Navi Mumbai, India.
Generate a new, engaging, and highly valuable blog post about one of the following topics:
- Commercial real estate investment trends
- Benefits of premium coworking spaces
- Productivity and professional success in the modern workspace
- Why Navi Mumbai (specifically Jasai / 93 Avenue Mall area) is a prime business hub

The blog should be structured beautifully using Markdown (## headings, bullet points, paragraphs).
Do not include any preamble or extra text.
Return the output in STRICT valid JSON format with EXACTLY two keys:
1. "title": The Title of the Post (string)
2. "content_markdown": The markdown body of the post (string)

Ensure the JSON is perfectly valid so it can be parsed programmatically."""

    logging.info("Requesting new blog article from Gemini...")
    response = model.generate_content(prompt)
    
    text = response.text.strip()
    
    # Clean up possible markdown wrappers around JSON
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
        
    try:
        data = json.loads(text.strip())
        return data["title"], data["content_markdown"]
    except json.JSONDecodeError as e:
        logging.error("Failed to parse Gemini response as JSON.")
        logging.error(f"Response: {text}")
        raise e

def main():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else os.getcwd()
    # Change cwd so generate_blog.py's relative paths work correctly
    os.chdir(BASE_DIR)
    
    try:
        model = setup_gemini()
        title, content = generate_article(model)
        
        logging.info(f"Generated Title: {title}")
        logging.info("Generating HTML and updating index...")
        
        success = generate_blog_post(title, content)
        if success:
            logging.info("✅ Daily blog post successfully created and published.")
        else:
            logging.error("❌ Failed to create the blog post HTML.")
            
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
