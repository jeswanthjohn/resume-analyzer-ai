require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const upload = multer({ dest: 'uploads/' });

/* =========================
   OpenAI Client (SAFE INIT)
========================= */
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.warn('⚠️ OPENAI_API_KEY not set. Running in mock-only mode.');
}

/* ======================
   Middleware
====================== */
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* ======================
   Routes
====================== */
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Mock ATS analysis (quota-safe fallback)
 */
function buildDemoAnalysis() {
  return {
    ats_score: 92,
    strengths: [
      'Production-ready MERN architecture',
      'Resume upload and processing pipeline',
      'Clean UI with modern design',
      'Graceful error handling',
      'Consistent Git commit history'
    ],
    weaknesses: ['Career gap requires contextual framing'],
    missing_skills: ['Docker fundamentals', 'Basic AWS services'],
    suggestions: [
      'Add containerization with Docker',
      'Deploy backend to Railway/Render',
      'Frame gap as structured MERN upskilling phase'
    ]
  };
}

/**
 * Safely remove uploaded file
 */
function cleanupUploadedFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * REAL OpenAI resume analysis
 */
async function analyzeResumeWithAI(resumeText) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  console.log('🔥 Calling OpenAI API...');

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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    max_tokens: 300,
    messages: [
      { role: 'system', content: 'You are a strict ATS evaluator.' },
      { role: 'user', content: prompt }
    ]
  });

  return JSON.parse(response.choices[0].message.content);
}

/* ======================
   Analyze Endpoint
====================== */
app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Resume file is required'
      });
    }

    let analysis;

    try {
      // NOTE: Replace this later with real PDF text extraction
      const resumeText = 'Sample resume text for demo purposes';

      analysis = {
        ...(await analyzeResumeWithAI(resumeText)),
        _meta: {
          ai_used: true
        }
      };

    } catch (aiError) {
      if (aiError.status === 429) {
        console.warn('⚠️ OpenAI quota exceeded. Falling back to mock.');
      } else {
        console.warn('⚠️ OpenAI error. Falling back to mock:', aiError.message);
      }

      analysis = {
        ...buildDemoAnalysis(),
        _meta: {
          ai_used: false,
          reason: aiError.status === 429 ? 'quota_exceeded' : 'openai_error'
        }
      };
    }

    cleanupUploadedFile(req.file.path);
    return res.status(200).json(analysis);

  } catch (err) {
    console.error('❌ Resume analysis failed:', err.message);
    return res.status(500).json({
      error: 'Resume analysis failed',
      message: 'Please try again later'
    });
  }
});

/* ======================
   Server Startup
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
