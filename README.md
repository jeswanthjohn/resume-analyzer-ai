# Resume Analyzer AI 🚀

A serverless AI-powered resume analysis web application that generates **ATS-style feedback** using the OpenAI API, with a **production-safe fallback mechanism** to ensure reliability when external services fail.

This project is intentionally designed as a **portfolio-grade demonstration** of backend reliability, API integration, and defensive system design — not as a UI-heavy product.

---

## ✨ Live Demo

**Deployed:** Vercel (Frontend + Serverless Backend)

> ⚠️ AI responses depend on OpenAI API availability and quota limits.
> If the API is unavailable, the application automatically falls back to a deterministic mock analysis so the demo never breaks.

---

## 🎯 What This Project Demonstrates

- Clean **serverless architecture** using Vercel Functions
- Secure **OpenAI API integration** (no secrets exposed to frontend)
- **Failure-tolerant design** with graceful fallback behavior
- Clear **frontend ↔ backend API contract**
- Production-style error handling and logging

This project prioritizes **correctness, reliability, and explainability** over visual polish.

---

## 🔑 Key Features

- 📁 Resume upload (PDF)
- 🎯 ATS-style resume analysis using OpenAI
- 🛡 Automatic fallback when API quota is exceeded or unavailable
- 💡 Actionable improvement suggestions
- ⚙️ Serverless backend with defensive error handling
- 🧪 Stable demo behavior for recruiters and reviewers

---

## 🧠 How AI Integration Works

1. The frontend sends extracted resume text to a serverless API endpoint (`/api/analyze`).
2. The backend attempts analysis using the OpenAI API.
3. If the API call fails (quota exceeded, missing key, malformed response):

   - the error is logged,
   - a deterministic mock analysis is returned,
   - the application continues functioning without crashing.

This mirrors **real-world production systems**, where third-party APIs are treated as unreliable dependencies.

---

## 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

> The UI is intentionally minimal to keep the focus on backend reliability and API behavior.

### Backend (Serverless)

- Node.js
- Vercel Serverless Functions

### AI

- OpenAI API (Responses API)
- Quota-aware fallback mechanism

---

## 🚀 Local Development

```bash
npm install
```

Run locally using Vercel CLI or any compatible Node 18+ environment.

### Environment Variables

Set the following in your environment:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

If the key is missing or the quota is exceeded, the application automatically switches to mock mode.

---

## 📌 Current Limitations

- PDF text extraction is simplified for demo stability
- UI presentation is intentionally minimal
- Mock responses are used when the AI service is unavailable

These limitations are **intentional, documented, and reversible**.

---

## 🔮 Planned Enhancements

- Backend-side PDF text extraction pipeline
- Rate limiting and request validation
- Token usage optimization
- Polished UI layered on top of a stable data contract

---

## 👤 Author

**Jeswanth Reddy**
Aspiring Full-Stack Developer
Focused on building reliable, production-grade systems
