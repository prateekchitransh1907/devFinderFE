import { ENDPOINTS } from "../api/endpoints";
import { buildAuthHeaders } from "../api/auth";
import {
  getConnectionsPending,
  getConnectionsSuccess,
  getConnectionsError,
} from "../reducers/connections/connectionsSlice";
import {
  GET_CONNECTIONS,
  GET_CONNECTIONS_PENDING,
  GET_CONNECTIONS_SUCCESS,
  GET_CONNECTIONS_ERROR,
} from "../constants/connectionConstants";

export const getConnections = () => async (dispatch) => {
  console.info(`[connections] ${GET_CONNECTIONS}`);
  dispatch(getConnectionsPending());
  console.info(`[connections] ${GET_CONNECTIONS_PENDING}`);

  try {
    const res = await fetch(ENDPOINTS.CONNECTIONS, {
      method: "GET",
      headers: buildAuthHeaders(),
      credentials: "include",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Failed to load connections (${res.status})`;
      throw new Error(message);
    }

    const raw = Array.isArray(data)
      ? data
      : data?.connections ?? data?.data ?? []; // Normalise: each item may be { connectionId, user } or a user object directly

    const connections = raw.map((item) =>
      item?.user ? { ...item.user, connectionId: item.connectionId } : item
    );
    dispatch(getConnectionsSuccess(connections));
    console.info(`[connections] ${GET_CONNECTIONS_SUCCESS}`, {
      count: connections?.length,
    });

    return { success: true, data: connections };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : error.message || "Failed to load connections.";

    dispatch(getConnectionsError(errorMessage));
    console.error(`[connections] ${GET_CONNECTIONS_ERROR}`, {
      error: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};
