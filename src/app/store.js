import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth/authSlice";
import profileReducer from "../reducers/profile/profileSlice";
import feedReducer from "../reducers/feed/feedSlice";
import connectionsReducer from "../reducers/connections/connectionsSlice";
import requestsReducer from "../reducers/requests/requestsSlice";
import paymentReducer from "../reducers/payments/paymentSlice";
import chatReducer from "../reducers/chats/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests: requestsReducer,
    payments: paymentReducer,
    chat: chatReducer,
  },
});
