import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: null,
  status: "idle",
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getChatPending: (state) => {
      state.status = "pending";
      state.error = null;
    },
    getChatSuccess: (state, action) => {
      state.status = "success";
      state.chat = action.payload;
    },
    getChatError: (state, action) => {
      state.status = "error";
      state.error =
        action.payload || "Unable to fetch chats. Please try again.";
    },
    addChatMessage: (state, action) => {
      if (state.chat && state.chat.messages) {
        state.chat.messages.push(action.payload);
      }
    },
  },
});

export const { getChatPending, getChatSuccess, getChatError, addChatMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
