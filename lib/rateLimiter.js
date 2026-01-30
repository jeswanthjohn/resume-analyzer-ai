const requests = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = requests.get(ip) || [];

  const recent = entry.filter(ts => now - ts < windowMs);
  recent.push(now);

  requests.set(ip, recent);

  if (recent.length > limit) {
    return false;
  }

  return true;
}
