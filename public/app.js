const resumeInput = document.getElementById("resumeInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusDiv = document.getElementById("status");
const resultPre = document.getElementById("result");

analyzeBtn.addEventListener("click", async () => {
  const file = resumeInput.files[0];

  if (!file) {
    statusDiv.innerText = "❌ Please select a PDF file";
    return;
  }

  statusDiv.innerText = "⏳ Analyzing resume...";
  resultPre.innerText = "";

  const formData = new FormData();
  formData.append("resume", file);

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown error");
    }

    statusDiv.innerText = "✅ Analysis complete";
    resultPre.innerText = JSON.stringify(data, null, 2);

  } catch (err) {
    statusDiv.innerText = "❌ Analysis failed";
    resultPre.innerText = err.message;
  }
});
