export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
export const SOCKET_URL = "http://localhost:3000";

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
  PREMIUM_PAYMENT_CREATE: `${API_BASE_URL}/payment/createOrder`,
  PREMIUM_VERIFY: `${API_BASE_URL}/premium/verify`,
  GET_CHAT: (userId) => `${API_BASE_URL}/chat/${userId}`,
  UPLOAD_PROFILE_PICTURE: `${API_BASE_URL}/upload/profile-picture`,
};
