export function getStoredAuthToken() {
  return localStorage.getItem("authToken") || null;
}

export function buildAuthHeaders(headers = {}) {
  const authToken = getStoredAuthToken();

  if (!authToken) return headers;
  return {
    ...headers,
    Authorization: `Bearer ${authToken}`,
  };
}
