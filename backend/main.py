"""main.py
Python FastAPI Auth0 integration example
"""
from fastapi.responses import JSONResponse
from datetime import datetime
from fastapi import FastAPI, Depends, Security, UploadFile, File, Form
from fastapi.security import HTTPBearer 
import uuid
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware
from ai import ai_model 

# create FastAPI app instance
app = FastAPI()


origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500", 
    "http://localhost:8000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",

]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # List of allowed origins
    allow_credentials=True,           # Allows cookies/auth headers
    allow_methods=["*"],              # Allows all HTTP methods
    allow_headers=["*"],              # Allows all headers
)



@app.post('/paste-link')
def paste_link(url: str = Form(..., pattern=r'^(https?://)?[^\s/$.?#].[^\s]*$')):
    """
    Endpoint to handle pasted links.
    """
    try:
        results = ai_model.CS(url)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": "invalid url provided"})
    return JSONResponse(content={"message": "Link received", "url": url, "results": results})

@app.on_event("startup")
def startup_event():
    import nltk
    import subprocess

    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('punkt_tab')
    command = "python ./ai/model.py"
    subprocess.Popen(command, shell=True)
    """
    Startup event to initialize resources.
    """
    print("🚀 Application started at", datetime.now().isoformat())