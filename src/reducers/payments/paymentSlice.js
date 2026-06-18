import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payment: null,
  getPayment: {
    status: "idle",
    error: null,
  },
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    getPaymentPending: (state) => {
      state.getPayment.status = "pending";
      state.getPayment.error = null;
    },

    getPaymentSuccess: (state, action) => {
      state.getPayment.status = "success";
      state.payment = action.payload;
      state.getPayment.error = null;
    },

    getPaymentError: (state, action) => {
      state.getPayment.status = "error";
      state.getPayment.error =
        action.payload || "Unable to create payment. Please try again.";
    },

    resetPayment: (state) => {
      state.payment = null;
      state.getPayment.status = "idle";
      state.getPayment.error = null;
    },
  },
});

export const {
  getPaymentPending,
  getPaymentSuccess,
  getPaymentError,
  resetPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
