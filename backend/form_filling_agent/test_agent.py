import json
import os
from agent import fill_form_with_gemini

def main():
    # Define absolute paths dynamically
    persona_path = os.path.join(os.path.dirname(__file__), 'fake_test_persona.json')
    forms_all_path = os.path.join(os.path.dirname(__file__), 'forms_all.json')

    print(f"Loading persona from: {persona_path}")
    try:
        with open(persona_path, 'r') as f:
            persona_data = json.load(f)
    except Exception as e:
        print(f"Failed to load persona.json: {e}")
        return

    print(f"Loading form schemas from: {forms_all_path}")
    try:
        with open(forms_all_path, 'r') as f:
            forms_data = json.load(f)
            
            # For testing, grab the specific form schema for FRM_1
            form_schema = next((form for form in forms_data if form.get("formId") == "FRM_1"), forms_data[0] if forms_data else {})
    except Exception as e:
        print(f"Failed to load forms_all.json: {e}")
        return

    if not form_schema:
        print("Empty form schema loaded. Check forms_all.json.")
        return

    print(f"\n--- Starting Gemini Form Autofill Pipeline for [{form_schema.get('formId', 'Unknown Form')}] ---")
    print("Transmitting Persona and Target Form Schema to gemini-2.5-flash...\n")
    
    # Run the Agent Function
    filled_form = fill_form_with_gemini(persona_data, form_schema)
    
    print("\n--- ✅ Successfully Parsed Filled Form Output ---")
    # Pretty print the final mapped agent response
    print(json.dumps(filled_form, indent=4))

if __name__ == "__main__":
    main()
