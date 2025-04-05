import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_gemini_feedback(resume_text, job_description):
    prompt = f"""
    You are an AI resume coach. Here's a resume:\n{resume_text}\n
    And a job description:\n{job_description}\n
    Analyze and provide:
    1. ATS match quality
    2. Missing or weak skills
    3. Resume improvement suggestions
    4. Career roles fit for this resume
    5. Learning roadmap (with 4 steps)
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text
