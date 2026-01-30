Resume Analyzer AI 🚀

A serverless resume analysis web application that generates ATS-style feedback using the OpenAI API, with a failure-tolerant fallback design to ensure the application remains functional even when external AI services fail.

This project is intentionally built as a portfolio-grade demonstration of backend reliability, defensive API design, and production-aware engineering, rather than a UI-focused product.

✨ Live Demo

🔗 https://resume-analyzer-ai-eta.vercel.app/

⚠️ Important
AI responses depend on OpenAI API availability and quota limits.
When the API is unavailable, the application automatically falls back to a deterministic mock analysis so the demo never breaks.

This behavior is intentional and mirrors real-world production systems.

🎯 What This Project Demonstrates

This project focuses on engineering quality, not feature bloat.

Serverless backend architecture using Vercel Functions

Secure OpenAI API integration (no secrets exposed to the frontend)

Failure-tolerant system design with graceful fallback behavior

Clear and stable frontend ↔ backend API contract

Input validation, rate limiting, and defensive error handling

Predictable runtime behavior under failure conditions

Design priority: correctness, reliability, and explainability over UI polish.

🔑 Key Features

Resume upload (PDF)

ATS-style resume evaluation

Automatic fallback when AI services fail or quota is exceeded

Actionable improvement suggestions

Serverless backend with defensive safeguards

Stable demo behavior suitable for recruiters and reviewers

🧠 How the AI Integration Works

The frontend extracts resume text and sends it to /api/analyze.

The serverless backend validates input and enforces rate limits.

The backend attempts analysis using the OpenAI API.

If the AI call fails for any reason (quota, invalid response, network issue):

the error is handled gracefully,

a deterministic mock analysis is returned,

the application continues without crashing.

This approach treats third-party APIs as unreliable dependencies, which is how production systems are designed.

🛠 Tech Stack
Frontend

HTML5

CSS3

Vanilla JavaScript

The UI is intentionally minimal to keep focus on backend behavior and API reliability.

Backend (Serverless)

Node.js

Vercel Serverless Functions

AI

OpenAI Responses API

Quota-aware fallback mechanism

🚀 Local Development

Run the following commands from the project root:

npm install
npx vercel dev

🔐 Environment Variables

Create a .env.local file or set the following variables in your environment:

OPENAI_API_KEY=your_openai_api_key_here
MOCK_MODE=true


Notes

If OPENAI_API_KEY is missing or quota is exceeded, the app automatically switches to mock mode.

Mock mode ensures the application remains stable during demos and reviews.

📌 Current Limitations (Intentional)

PDF text extraction is simplified for stability

UI design is minimal by design

Mock responses are used when AI services are unavailable

These trade-offs are explicit, documented, and reversible.

🔮 Potential Enhancements (Not Implemented Yet)

Advanced PDF parsing pipeline

Persistent rate limiting (Redis / KV)

Token usage optimization

Enhanced UI layered on top of the existing API contract

These are intentionally omitted to keep the project focused and reviewable.

👤 Author

Jeswanth Reddy
Aspiring Full-Stack Developer
Focused on building reliable, production-grade systems, not fragile demos.