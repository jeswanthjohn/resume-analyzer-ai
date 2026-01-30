export function apiError(res, status, code, message) {
  return res.status(status).json({
    success: false,
    error: { code, message },
  });
}
