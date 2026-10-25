export function httpError(status, message, cause) {
  return Object.assign(new Error(message), { status, ...(cause && { cause }) });
}

export function isHttpError(err) {
  return Number.isInteger(err?.status);
}

export function toServiceError(err, fallbackMessage) {
  if (isHttpError(err)) return err;
  return httpError(500, fallbackMessage, err);
}

export function sendError(res, err, fallbackMessage) {
  if (isHttpError(err)) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: fallbackMessage });
}
