import { ENDPOINTS } from "../api/endpoints";
import { GET_FEED, GET_FEED_PENDING } from "../constants/feedConstants";
import { getFeedPending } from "../reducers/feed/feedSlice";
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
  } catch (error) {}
};
