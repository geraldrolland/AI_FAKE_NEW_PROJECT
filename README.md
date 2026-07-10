# AI Fake News Detection Project

## Solution Overview
AI Fake News Project is a prototype solution for analyzing a webpage URL and predicting whether the extracted headlines look trustworthy or likely fake. The solution combines a FastAPI backend, a trained Keras/TensorFlow model, Selenium-based webpage scraping, and NLP preprocessing to provide a lightweight AI-powered fake-news detection workflow.

## What the Solution Does
The system accepts a URL, opens the page in a headless browser, extracts headlines, filters them using cyber-security related keywords, preprocesses the text, and sends the cleaned headlines to a trained model for classification.

## Core Workflow
1. A user submits a URL through the API.
2. The backend receives the request and starts the AI analysis pipeline.
3. A headless browser loads the target page and collects headlines from heading tags.
4. The text is cleaned and converted into a format suitable for the model.
5. The trained model predicts whether each headline is more likely Real or Fake.
6. The results are returned as JSON through the API.

## Main Features
- URL-based analysis through a REST API
- Headless web scraping with Selenium
- NLP preprocessing using NLTK
- Model-based classification with TensorFlow/Keras
- JSON response containing the analyzed headlines and predictions

## Project Structure
- [backend/main.py](backend/main.py) - FastAPI application and API routes
- [backend/requirements.txt](backend/requirements.txt) - Python dependencies
- [backend/ai](backend/ai) - AI pipeline, model files, and scraping logic

## Tech Stack
- Python 3.10+
- FastAPI
- Uvicorn
- TensorFlow / Keras
- Selenium
- BeautifulSoup4
- NLTK
- scikit-learn

## API Endpoints
### GET /test
Checks whether the backend is running.

Example:
```bash
curl http://localhost:8000/test
```

### POST /paste-link
Accepts a URL as form data and returns the analysis result.

Example:
```bash
curl -X POST "http://localhost:8000/paste-link" -F "url=https://example.com"
```

## Setup
1. Create and activate a virtual environment.
2. Install the required dependencies:
   ```bash
   pip install -r backend/requirements.txt
   pip install -r backend/ai/requirements.txt
   ```
3. Run the backend:
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Notes
- The current prototype focuses on headline-based analysis and uses a locally available Chrome browser and ChromeDriver.
- The solution is intended as a demonstration of an AI-assisted fake-news detection pipeline and can be improved with richer datasets and more robust scraping logic.
