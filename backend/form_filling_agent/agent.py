import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Define standard relative path to the backend .env file
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(dotenv_path=env_path)

def fill_form_with_gemini(persona_data: dict, empty_form_schema: dict) -> dict:
    """
    Takes a User Persona and an Empty Form Schema, uses Google Gemini to populate 
    the form based on the persona details, and returns the filled exact form JSON.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in the .env file.")

    # Initialize the new google-genai client
    client = genai.Client(api_key=api_key)

    system_instruction = (
        "You are an expert AI Form Filler backend module. You will be provided with a User Persona JSON "
        "and an Empty Form Schema JSON. Your singular task is to populate the form schema "
        "using accurate data extracted from the Persona.\n\n"
        "Strict rules:\n"
        "1. Do NOT invent or hallucinate data. If the persona does not explicitly contain "
        "or strongly imply the information required for a field, explicitly return null or an empty string for that field.\n"
        "2. Strictly map the output to match the exact keys and structure of the Empty Form Schema.\n"
        "3. Your output MUST be a valid matching JSON object."
    )

    prompt = (
        f"User Persona JSON:\n{json.dumps(persona_data, indent=2)}\n\n"
        f"Empty Form Schema:\n{json.dumps(empty_form_schema, indent=2)}\n\n"
        "Please output the Filled Form Schema as pure JSON."
    )

    try:
        # Utilizing gemini-2.5-flash with forced JSON output
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.0 # Deterministic structured output
            ),
        )
        
        # Parse the JSON string from Gemini directly back into a Python Dict
        filled_form = json.loads(response.text)
        return filled_form
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {}
