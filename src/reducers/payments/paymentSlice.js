import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payment: null,
  premiumVerify: {
    isPremium: false,
    membershipType: null,
    status: "idle",
    error: null,
  },
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

    getPremiumVerifyPending: (state) => {
      state.premiumVerify.status = "pending";
      state.premiumVerify.error = null;
    },
    getPremiumVerifySuccess: (state, action) => {
      state.premiumVerify.status = "success";
      state.premiumVerify.isPremium = action.payload.isPremium;
      state.premiumVerify.membershipType = action.payload.membershipType;
      state.premiumVerify.error = null;
    },
    getPremiumVerifyError: (state, action) => {
      state.premiumVerify.status = "error";
      state.premiumVerify.error =
        action.payload || "Unable to verify premium status. Please try again.";
    },
    resetPremiumVerify: (state) => {
      state.premiumVerify = {
        isPremium: false,
        membershipType: null,
        status: "idle",
        error: null,
      };
    },
  },
});

export const {
  getPaymentPending,
  getPaymentSuccess,
  getPaymentError,
  resetPayment,
  getPremiumVerifyPending,
  getPremiumVerifySuccess,
  getPremiumVerifyError,
  resetPremiumVerify,
} = paymentSlice.actions;

export default paymentSlice.reducer;
