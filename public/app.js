alert("app.js loaded");

const input = document.getElementById("resumeInput");
const button = document.getElementById("analyzeBtn");
const status = document.getElementById("status");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  const file = input.files[0];

  if (!file) {
    alert("Please upload a PDF resume");
    return;
  }

  if (file.type !== "application/pdf") {
    alert("Only PDF files allowed");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);

  status.textContent = "Analyzing resume...";
  result.textContent = "";

  try {
    const res = await fetch("/analyze", {
  method: "POST",
  body: formData,
});

if (!res.ok) {
  const errorText = await res.text();
  throw new Error(errorText || "Analysis failed");
}

const data = await res.json();

status.textContent = "Analysis complete ✅";

// render nicely instead of dumping raw JSON
result.innerHTML = `
  <p><strong>ATS Score:</strong> ${data.ats_score}</p>
  <p><strong>Strengths:</strong></p>
  <ul>${data.strengths.map(s => `<li>${s}</li>`).join("")}</ul>

  <p><strong>Weaknesses:</strong></p>
  <ul>${data.weaknesses.map(w => `<li>${w}</li>`).join("")}</ul>

  <p><strong>Missing Skills:</strong></p>
  <ul>${data.missing_skills.map(m => `<li>${m}</li>`).join("")}</ul>

  <p><strong>Suggestions:</strong></p>
  <ul>${data.suggestions.map(s => `<li>${s}</li>`).join("")}</ul>
`;

  } catch (err) {
    status.textContent = "Analysis failed ❌";
    result.textContent = err.message;
  }
});
