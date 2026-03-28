const fileInput = document.getElementById("resumeInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusDiv = document.getElementById("status");
const resultPre = document.getElementById("result");
const analysisModeEl = document.getElementById("analysis-mode");

let isAnalyzing = false;

analyzeBtn.addEventListener("click", async () => {
  if (isAnalyzing) return;

  const file = fileInput.files[0];

  if (!file) {
    statusDiv.textContent = "Please upload a PDF resume.";
    return;
  }

  isAnalyzing = true;
  analyzeBtn.disabled = true;

  statusDiv.textContent = "Analyzing resume...";
  resultPre.textContent = "";
  analysisModeEl.textContent = "";

  let timeoutId;

  try {
    const resumeText = `Experienced software developer...`;

    // Frontend timeout (10s)
    timeoutId = setTimeout(() => {
      statusDiv.textContent = "Request taking too long. Please try again.";
    }, 10000);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      statusDiv.textContent = data.error?.message || "Analysis failed.";
      return;
    }

    if (data._meta?.ai_used === false) {
      analysisModeEl.textContent = "Fallback mode (AI unavailable)";
    } else {
      analysisModeEl.textContent = "AI mode";
    }

    statusDiv.textContent = "Analysis complete ✅";
    resultPre.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    clearTimeout(timeoutId);
    statusDiv.textContent = "Something went wrong.";
  } finally {
    isAnalyzing = false;
    analyzeBtn.disabled = false;
  }
});