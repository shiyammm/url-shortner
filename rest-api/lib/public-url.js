function getConfiguredBaseUrl() {
  const baseUrl = process.env.BASE_URL
  return baseUrl || null;
}

export function toShortUrl(code, req) {
  const baseUrl = getConfiguredBaseUrl();

  if (baseUrl) {
    return `${baseUrl}/${code}`;
  }

  return `${req.protocol}://${req.get('host')}/${code}`;
}
