import { LIMITS } from "./constants.js";

export function validateResumeInput({ text, fileSize }) {
  if (!text || typeof text !== "string") {
    return { ok: false, message: "Resume text is required." };
  }

  if (text.length < LIMITS.MIN_TEXT_LENGTH) {
    return {
      ok: false,
      message: "Resume text is too short to analyze meaningfully.",
    };
  }

  if (text.length > LIMITS.MAX_TEXT_LENGTH) {
    return {
      ok: false,
      message: "Resume text exceeds allowed length.",
    };
  }

  if (fileSize && fileSize > LIMITS.MAX_PDF_SIZE_BYTES) {
    return {
      ok: false,
      message: "Uploaded PDF exceeds size limit.",
    };
  }

  return { ok: true };
}
