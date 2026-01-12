const form = document.getElementById("resume-form");
const fileInput = document.getElementById("resume");
const output = document.getElementById("output");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  output.textContent = "Analyzing resume...";

  const file = fileInput.files[0];
  if (!file) {
    output.textContent = "Please upload a PDF resume.";
    return;
  }

  if (file.type !== "application/pdf") {
    output.textContent = "Only PDF files are supported.";
    return;
  }

  try {
    const text = await extractTextFromPDF(file);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resumeText: text }),
    });

    const data = await response.json();

    if (!response.ok) {
      output.textContent = data.error || "Analysis failed.";
      return;
    }

    output.textContent = data.analysis;
  } catch (err) {
    console.error(err);
    output.textContent = "Something went wrong. Please try again.";
  }
});

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    content.items.forEach((item) => {
      text += item.str + " ";
    });
  }
  return text;
}
