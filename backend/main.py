from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq_service import analyze_code_with_groq, GroqAnalysisError

app = FastAPI(title="AI Code Analyzer API")

# CORS Middleware: allows the React frontend to talk to the backend.
# For production, replace "*" with the specific frontend origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"status": "AI Code Analyzer Backend is Running!"}


@app.post("/api/analyze")
async def analyze_code(
    code: str = Form(None),
    file: UploadFile = File(None),
    language: str = Form("javascript"),
):
    code_text = ""

    if file:
        content = await file.read()
        code_text = content.decode("utf-8")
    elif code:
        code_text = code
    else:
        raise HTTPException(status_code=400, detail="Either code text or a file must be provided.")

    try:
        report = analyze_code_with_groq(code_content=code_text, language=language)
    except GroqAnalysisError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {e}")

    return {"status": "success", "data": report}

# Server run command (Terminal):
# uvicorn main:app --reload