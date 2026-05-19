const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/login`,
  AUTH_SIGNUP: `${API_BASE_URL}/signup`,
  PROFILE_VIEW: `${API_BASE_URL}/profile/view`,
  PROFILE_EDIT: `${API_BASE_URL}/profile/edit`,
  FEED: `${API_BASE_URL}/user/feed`,
  CONNECTIONS: `${API_BASE_URL}/user/connections`,
  REQUESTS_PENDING: `${API_BASE_URL}/user/requests/pending`,
  REQUEST_SEND: (status, userId) =>
    `${API_BASE_URL}/request/send/${status}/${userId}`,
  REQUEST_REVIEW: (status, requestId) =>
    `${API_BASE_URL}/request/review/${status}/${requestId}`,
};
