import OpenAI from "openai";

/* =========================
   OpenAI Client (SAFE INIT)
========================= */
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn("⚠️ OPENAI_API_KEY not set. Running in mock-only mode.");
}

/* =========================
   Mock ATS analysis fallback
========================= */
function buildDemoAnalysis() {
  return {
    ats_score: 92,
    strengths: [
      "Production-ready frontend architecture",
      "Clear project structure",
      "Secure AI integration design",
      "Serverless deployment readiness",
      "Consistent Git commit history",
    ],
    weaknesses: ["Career gap requires contextual framing"],
    missing_skills: ["Docker fundamentals", "Basic AWS services"],
    suggestions: [
      "Frame career gap as structured upskilling phase",
      "Add containerization basics",
      "Include metrics in project descriptions",
    ],
    _meta: {
      ai_used: false,
      reason: "mock_fallback",
    },
  };
}

/* =========================
   Real AI analysis
========================= */
async function analyzeResumeWithAI(resumeText) {
  if (!openai) {
    throw new Error("OpenAI client not initialized");
  }

  const prompt = `
You are an ATS (Applicant Tracking System) evaluator.

Analyze the resume text below and return STRICT JSON with:
- ats_score (number out of 100)
- strengths (array of strings)
- weaknesses (array of strings)
- missing_skills (array of strings)
- suggestions (array of strings)

Resume text:
"""
${resumeText}
"""
`;

  const response = await openai.responses.create({
  model: "gpt-4.1-mini",
  input: [
    {
      role: "system",
      content: "You are a strict ATS evaluator.",
    },
    {
      role: "user",
      content: prompt,
    },
  ],
  max_output_tokens: 300,
});

const content = response.output_text;

try {
  return JSON.parse(content);
} catch {
  throw new Error("Invalid JSON returned by OpenAI");
}

}

/* =========================
   Vercel Serverless Handler
========================= */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        error: "Resume text is missing or too short",
      });
    }

    try {
      const aiResult = await analyzeResumeWithAI(resumeText);
      return res.status(200).json({
        ...aiResult,
        _meta: { ai_used: true },
      });
    } catch (aiError) {
      console.warn("⚠️ AI failed, using mock:", aiError.message);
      return res.status(200).json(buildDemoAnalysis());
    }
  } catch (err) {
    console.error("❌ Resume analysis failed:", err);
    return res.status(500).json({
      error: "Resume analysis failed",
    });
  }
}
