// ================================
// GLOBAL SAFETY NET (VERY IMPORTANT)
// ================================
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION 🔥");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 UNHANDLED PROMISE REJECTION 🔥");
  console.error(err);
});

console.log("🔥 SERVER.JS FILE LOADED 🔥");

// ================================
// pdf-parse (CommonJS → ESM bridge)
// ================================
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// ================================
// Imports
// ================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs";

// ================================
// Env
// ================================
dotenv.config();
console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);

// ================================
// App setup
// ================================
const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ================================
// OpenAI client (SDK v6)
// ================================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================================
// ROUTE: /analyze
// ================================
app.post("/analyze", upload.single("resume"), async (req, res) => {
  console.log("➡️ /analyze route hit");

  try {
    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ---------- PDF parsing ----------
    const fileBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text || "";

    fs.unlinkSync(req.file.path); // cleanup immediately

    if (resumeText.length < 100) {
      console.log("❌ Resume text too short");
      return res.status(400).json({ error: "Unable to extract resume text" });
    }

    const trimmedResume = resumeText.slice(0, 6000);

    // ---------- Prompt ----------
    const prompt = `
Analyze the resume below and respond ONLY with valid JSON using this structure:

{
  "ats_score": number,
  "strengths": string[],
  "weaknesses": string[],
  "missing_skills": string[],
  "suggestions": string[]
}

Resume:
${trimmedResume}
`;

    console.log("🤖 Calling OpenAI...");

    // ---------- OpenAI call ----------
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an ATS resume evaluator. Respond ONLY with raw JSON. No markdown. No explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
    });

    const aiOutput = response.choices?.[0]?.message?.content;

    if (!aiOutput) {
      throw new Error("Empty response from OpenAI");
    }

    // ---------- JSON parse safety ----------
    let parsedResult;
    try {
      parsedResult = JSON.parse(aiOutput);
    } catch (err) {
      console.error("❌ AI returned invalid JSON:");
      console.error(aiOutput);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    console.log("✅ Analysis successful");
    return res.json(parsedResult);

  } catch (error) {
  console.error("🔥 OPENAI ERROR (RAW) 🔥");

  console.error("Name:", error.name);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);
  console.error("Full error object:", error);

  return res.status(500).json({
    error: "AI analysis failed",
    details: error.message
  });
  }
});

// ================================
// Server start
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
