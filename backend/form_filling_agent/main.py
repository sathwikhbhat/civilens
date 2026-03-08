from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

# Import the existing Gemini logic
from agent import fill_form_with_gemini

app = FastAPI(title="Civilens Form Filling Agent API")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AutofillRequest(BaseModel):
    persona: Dict[str, Any]
    form_schema: Dict[str, Any]

@app.post("/api/autofill")
async def autofill_form(request: AutofillRequest):
    try:
        if not request.persona:
            raise HTTPException(status_code=400, detail="Missing persona data")
        if not request.form_schema:
            raise HTTPException(status_code=400, detail="Missing form schema")
            
        # Call the Gemini agent logic
        filled_data = fill_form_with_gemini(request.persona, request.form_schema)
        
        return filled_data
    except Exception as e:
        print(f"Error in autofill endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("Starting FastAPI Form Filling Agent on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
