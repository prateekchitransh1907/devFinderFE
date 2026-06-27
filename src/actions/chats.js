import { buildAuthHeaders } from "../api/auth";
import { ENDPOINTS } from "../api/endpoints";
import {
  GET_CHAT,
  GET_CHAT_PENDING,
  GET_CHAT_SUCCESS,
  GET_CHAT_ERROR,
} from "../constants/chatConstants";
import {
  getChatSuccess,
  getChatPending,
  getChatError,
} from "../reducers/chats/chatSlice";

export const getChat = (userId) => async (dispatch) => {
  console.info(`[chat] ${GET_CHAT}`);

  dispatch(getChatPending());

  console.info(`[chat] ${GET_CHAT_PENDING}`);

  try {
    const res = await fetch(ENDPOINTS.GET_CHAT(userId), {
      method: "GET",
      headers: buildAuthHeaders(),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.message || data?.error || `Failed to load chat (${res.status})`
      );
    }

    dispatch(getChatSuccess(data));

    console.info(`[chat] ${GET_CHAT_SUCCESS}`, {
      messages: data.messages.length,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`[chat] ${GET_CHAT_ERROR}`, error);

    dispatch(getChatError(error.message));

    return {
      success: false,
      error: error.message,
    };
  }
};
