import { ENDPOINTS } from "../api/endpoints";
import {
  GET_FEED,
  GET_FEED_ERROR,
  GET_FEED_PENDING,
  GET_FEED_SUCCESS,
} from "../constants/feedConstants";
import {
  getFeedError,
  getFeedPending,
  getFeedSuccess,
} from "../reducers/feed/feedSlice";
import { buildAuthHeaders } from "../api/auth";

export const getFeed = () => async (dispatch) => {
  console.info(`[feed] ${GET_FEED}`);
  dispatch(getFeedPending());
  console.info(`[feed] ${GET_FEED_PENDING}`);

  try {
    const res = await fetch(ENDPOINTS.FEED, {
      method: "GET",
      headers: buildAuthHeaders(),
      credentials: "include",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        data?.message || data?.error || `Failed to load feed (${res.status})`;
      throw new Error(message);
    }

    //API may return array directly or wrapped in {feedUsers:[...] or {data:[...] }}
    const items = Array.isArray(data)
      ? data
      : data?.feedUsers ?? data?.data ?? [];
    dispatch(getFeedSuccess(items));
    console.info(`[feed] ${GET_FEED_SUCCESS}`, { count: items.length });

    return { success: true, data: items };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error: Unable to reach the server. Please check your connection."
        : error.message ||
          "An unexpected error occurred while fetching the feed.";
    dispatch(getFeedError(errorMessage));
    console.error(`[feed] ${GET_FEED_ERROR}`, { error: errorMessage });

    return { success: false, error: errorMessage };
  }
};
