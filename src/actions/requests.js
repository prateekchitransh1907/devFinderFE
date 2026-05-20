import { ENDPOINTS } from "../api/endpoints";
import { buildAuthHeaders } from "../api/auth";
import {
  getRequestsPending,
  getRequestsSuccess,
  getRequestsError,
  reviewRequestPending,
  reviewRequestSuccess,
  reviewRequestError,
} from "../reducers/requests/requestsSlice";
import {
  GET_REQUESTS,
  GET_REQUESTS_PENDING,
  GET_REQUESTS_SUCCESS,
  GET_REQUESTS_ERROR,
  REVIEW_REQUEST,
  REVIEW_REQUEST_PENDING,
  REVIEW_REQUEST_SUCCESS,
  REVIEW_REQUEST_ERROR,
} from "../constants/requestsConstants";

export const getPendingRequests = () => async (dispatch) => {
  console.info(`[requests] ${GET_REQUESTS}`);
  dispatch(getRequestsPending());
  console.info(`[requests] ${GET_REQUESTS_PENDING}`);

  try {
    const res = await fetch(ENDPOINTS.REQUESTS_PENDING, {
      method: "GET",
      headers: buildAuthHeaders(),
      credentials: "include",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Failed to load requests (${res.status})`;
      throw new Error(message);
    }

    const items = Array.isArray(data)
      ? data
      : data?.pendingRequests ?? data?.data ?? [];
    dispatch(getRequestsSuccess(items));
    console.info(`[requests] ${GET_REQUESTS_SUCCESS}`, { count: items.length });

    return { success: true, data: items };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : error.message || "Failed to load requests.";

    dispatch(getRequestsError(errorMessage));
    console.error(`[requests] ${GET_REQUESTS_ERROR}`, { error: errorMessage });

    return { success: false, error: errorMessage };
  }
};

export const reviewRequest = (requestId, status) => async (dispatch) => {
  console.info(`[requests] ${REVIEW_REQUEST}`, { requestId, status });
  dispatch(reviewRequestPending(requestId));
  console.info(`[requests] ${REVIEW_REQUEST_PENDING}`, { requestId });

  try {
    const res = await fetch(ENDPOINTS.REQUEST_REVIEW(status, requestId), {
      method: "POST",
      headers: buildAuthHeaders(),
      credentials: "include",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Failed to ${status} request (${res.status})`;
      throw new Error(message);
    }

    dispatch(reviewRequestSuccess(requestId));
    console.info(`[requests] ${REVIEW_REQUEST_SUCCESS}`, { requestId, status });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : error.message || `Failed to ${status} request.`;

    dispatch(reviewRequestError({ id: requestId, error: errorMessage }));
    console.error(`[requests] ${REVIEW_REQUEST_ERROR}`, {
      requestId,
      error: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};
