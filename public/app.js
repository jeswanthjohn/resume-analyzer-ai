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

    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    result.textContent = data.result;
    status.textContent = "Analysis complete ✅";
  } catch (err) {
    status.textContent = "Analysis failed ❌";
    result.textContent = err.message;
  }
});
