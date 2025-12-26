
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import pdf from "pdf-parse";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(fileBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.length < 100) {
      return res.status(400).json({ error: "Unable to extract resume text" });
    }

    const prompt = `
You are an ATS resume evaluator.

Analyze the following resume text and respond strictly in JSON with:
- ats_score (0-100)
- strengths (array)
- weaknesses (array)
- missing_skills (array)
- suggestions (array)

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const aiOutput = response.choices[0].message.content;

    fs.unlinkSync(req.file.path); // cleanup uploaded file

    res.json({ result: aiOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
