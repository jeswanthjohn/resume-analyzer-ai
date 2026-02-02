const fileInput = document.getElementById("resumeInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusDiv = document.getElementById("status");
const resultPre = document.getElementById("result");
const analysisModeEl = document.getElementById("analysis-mode");

analyzeBtn.addEventListener("click", async () => {
  statusDiv.textContent = "Analyzing resume...";
  resultPre.textContent = "";
  analysisModeEl.textContent = "";

  const file = fileInput.files[0];

  if (!file) {
    statusDiv.textContent = "Please upload a PDF resume.";
    return;
  }

  try {
    // Demo-safe placeholder text
    const resumeText = `
Experienced software developer with hands-on experience in JavaScript, Node.js,
REST APIs, serverless architecture, and cloud deployment. Built multiple full-stack
projects involving frontend UI, backend APIs, and third-party integrations.
Strong understanding of debugging, error handling, and production-ready systems.
`;

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    });

    const data = await response.json();

    if (!response.ok) {
      statusDiv.textContent = data.error?.message || "Analysis failed.";
      return;
    }

    // explicit, recruiter-safe analysis mode transparency
    if (data._meta && data._meta.ai_used === false) {
      analysisModeEl.textContent =
        "Analysis Mode: Fallback (Mock) — AI calls disabled for cost-controlled demo";
    } else {
      analysisModeEl.textContent = "Analysis Mode: AI";
    }

    statusDiv.textContent = "Analysis complete ✅";
    resultPre.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Something went wrong.";
  }
});
