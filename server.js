require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Build demo ATS analysis response
 * (quota-safe mock for portfolio demo)
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

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Resume file is required'
      });
    }

    const analysis = buildDemoAnalysis();

    cleanupUploadedFile(req.file.path);

    return res.status(200).json(analysis);

  } catch (err) {
    console.error('Resume analysis failed:', err.message);

    return res.status(500).json({
      error: 'Resume analysis failed',
      message: 'Please try again later'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
