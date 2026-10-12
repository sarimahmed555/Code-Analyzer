# Code-Analyzer

Markdown
# AI Code Auditor Pro (Static Analysis Studio)

> An enterprise-grade, lightning-fast AI code auditing platform inspired by modern developer tool aesthetics (Vercel, Linear, Supabase). It automatically inspects source code for critical logic bugs, security vulnerabilities, and performance bottlenecks, offering automated refactored fixes with multi-language explanations.

---

##  Key Features

- ** Advanced AI Engine:** Powered by Groq Cloud API (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`) using direct, high-stability HTTP request pipelines.
- ** Multi-Language Explanations:** Get code audits and bug breakdowns explained in your preferred language—with dedicated first-class support for **Roman Urdu / Hindi**, **Hindi**, and **English**.
- ** Comprehensive Structured Auditing:** Automatically parses code into strict JSON metrics:
  - Executive Summary
  - Critical Bugs & Logic Errors
  - Security Vulnerabilities (e.g., SQL Injection, Hardcoded Secrets)
  - Performance Bottlenecks & Memory Leaks
  - Fully Refactored, Production-Ready Code Block with One-Click Copy.
- ** Sleek Dark-Mode UI:** Built with React, Vite, and Tailwind CSS featuring glassmorphism, ambient radial glows, and Monaco Editor integration.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Monaco Editor, Lucide Icons.
- **Backend:** Python, FastAPI, Uvicorn, Requests, Python-Dotenv.
- **AI / LLM:** Groq API (Llama 3.3 / Llama 3.1).

---

## 📂 Monorepo Project Structure

```text
code_analyzer/
├── frontend/           # React + Vite frontend application
│   ├── src/
│   └── package.json
├── backend/            # FastAPI backend service
│   ├── main.py         # FastAPI application & CORS configuration
│   ├── groq_service.py # Groq API integration & prompt engine
│   └── requirements.txt# Python dependencies
└── README.md
 Getting Started Locally
Prerequisites
Node.js & npm installed

Python (3.10+) installed

A free Groq API Key from Groq Console

1. Clone the Repository
Bash
git clone [https://github.com/your-username/code_analyzer.git](https://github.com/your-username/code_analyzer.git)
cd code_analyzer
2. Backend Setup
Bash
cd backend
python -m venv venv
# Activate virtual environment:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
Create a .env file inside the backend/ folder and add your API key:

Code snippet
GROQ_API_KEY=your_actual_groq_api_key_here
Run the FastAPI development server:

Bash
python -m uvicorn main:app --reload --port 8000
3. Frontend Setup
Open a new terminal tab and navigate to the frontend:

Bash
cd frontend
npm install
npm run dev
Open your browser at http://localhost:5173 to use the application!

 Production Deployment Guide (Monorepo Setup)
This project is structured as a monorepo and can be independently deployed using path-based triggers:

Frontend (Vercel):

Import your GitHub repository into Vercel.

Set Root Directory to frontend.

Build Command: npm run build, Output Directory: dist.

Backend (Render):

Create a new Web Service on Render connected to your repository.

Set Root Directory to backend.

Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

Add Environment Variable: GROQ_API_KEY.

 Author & Credits
Crafted with  by Code.with.Sarim
