import {
  GET_PAYMENT_STATUS,
  GET_PAYMENT_STATUS_PENDING,
  GET_PAYMENT_STATUS_ERROR,
} from "../constants/paymentConstants";

import {
  getPaymentPending,
  getPaymentSuccess,
  getPaymentError,
} from "../reducers/payments/paymentSlice";

import { ENDPOINTS } from "../api/endpoints";
import { buildAuthHeaders } from "../api/auth";

export const getPayments =
  ({ membershipType }) =>
  async (dispatch) => {
    console.info(`[payment] ${GET_PAYMENT_STATUS}`);

    dispatch(getPaymentPending());

    console.info(`[payment] ${GET_PAYMENT_STATUS_PENDING}`);

    try {
      const res = await fetch(ENDPOINTS.PREMIUM_PAYMENT_CREATE, {
        method: "POST",
        headers: {
          ...buildAuthHeaders(),
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          membershipType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to create payment (${res.status})`
        );
      }

      dispatch(getPaymentSuccess(data));

      console.info(`[payment] Order Created`, {
        orderId: data.orderId,
      });

      return {
        success: true,
        data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? "Network error. Please check your connection and try again."
          : error.message || "Failed to create payment.";

      dispatch(getPaymentError(errorMessage));

      console.error(`[payment] ${GET_PAYMENT_STATUS_ERROR}`, {
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };
