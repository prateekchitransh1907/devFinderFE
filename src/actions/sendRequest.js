import { ENDPOINTS } from "../api/endpoints";
import { buildAuthHeaders } from "../api/auth";

/**
 * Send a connection request to a user.
 * @param {'interested'|'ignored'} status
 * @param {string} userId
 */
export const sendRequest = (status, userId) => async () => {
  try {
    const res = await fetch(ENDPOINTS.REQUEST_SEND(status, userId), {
      method: "POST",
      headers: buildAuthHeaders(),
      credentials: "include",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        data?.message || data?.error || `Request failed (${res.status})`;
      throw new Error(message);
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : error.message || "Failed to send request.";

    console.error("[sendRequest] error", {
      status,
      userId,
      error: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};
