import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfUsage";
import RefundPolicy from "./pages/legal/RefundPolicy";
import ContactUs from "./pages/legal/ContactUs";
import Pricing from "./pages/legal/Pricing";
import Premium from "./pages/Premium";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPremiumVerifyStatus } from "./actions/payments";
import { resetPremiumVerify } from "./reducers/payments/paymentSlice";
import Chat from "./pages/Chat";


function App() {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getPremiumVerifyStatus());
    } else {
      dispatch(resetPremiumVerify());
    }
  }, [dispatch, isAuthenticated]);
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected routes with navbar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:userId" element={<Chat />} />
            </Route>
          </Route>
          {/* standalone public pages */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
