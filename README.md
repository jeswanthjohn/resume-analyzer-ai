# Resume Analyzer AI 🚀

A resume analysis web application that integrates the **OpenAI API** to generate ATS-style feedback, with a **production-safe fallback mechanism** to handle API quota limits and availability issues.

Designed as a **portfolio project** to demonstrate backend reliability, third-party API integration, and defensive system design.

---

## ✨ Live Demo

**Local:** http://localhost:5000  
**Deployed:** Vercel (frontend) / Railway (backend-ready)  
**Sample ATS Score:** 92 / 100 ✅

> ⚠️ AI responses depend on OpenAI API availability and quota limits.  
> The application automatically falls back to mock analysis when needed.

---

## 🔑 Key Features

- 📁 Resume upload (PDF)
- 📄 Backend-side resume processing
- 🎯 **Real OpenAI API integration** for ATS-style analysis
- 🛡 **Automatic fallback** when API quota is exceeded or unavailable
- 💡 Actionable improvement suggestions
- ✨ Glassmorphism-based responsive UI
- ⚙️ Production-style error handling and logging

---

## 🧠 How AI Integration Works

- The backend attempts to analyze resume content using the **OpenAI API** (`gpt-4o-mini`).
- If the API is unavailable, quota-limited, or not configured, the system:
  - logs the condition,
  - falls back to a deterministic mock response,
  - continues serving valid results without crashing.

This mirrors **real-world production systems**, where external APIs are treated as unreliable dependencies.

---

## 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Glassmorphism UI

### Backend

- Node.js
- Express.js
- Multer (file uploads)

### AI

- OpenAI API (`gpt-4o-mini`)
- Quota-aware fallback mechanism

## 🚀 Quick Setup (Local)

```bash
npm install
node server.js
```

Application runs at:

http://localhost:5000

🔐 Environment Configuration

Create a .env file in the project root:

OPENAI_API_KEY=your_openai_api_key_here

If the key is missing or quota is exceeded, the app automatically runs in mock mode.

No crashes, no broken demos.

✅ Production-Style Design Highlights

✔ Real OpenAI API integration (not hardcoded responses)

✔ Graceful handling of quota exhaustion (HTTP 429)

✔ Backend observability for AI usage

✔ Safe demo behavior for recruiters

✔ No frontend dependency on API secrets

📌 Current Limitations

Resume text extraction is currently simplified for demo purposes

AI accuracy depends on external API availability

Mock responses are used when quota is exhausted

These limitations are intentional and documented, not hidden.

🔮 Planned Enhancements

Full PDF text extraction pipeline

Token usage optimization

Rate limiting

Enhanced frontend presentation

Cloud deployment of backend services

👤 Author

Jeswanth Reddy
Aspiring Full-Stack Developer
Focused on building reliable, production-grade systems
