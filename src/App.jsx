import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes with navbar */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Profile />} />
          <Route path="/contact" element={<Connections />} />
          <Route path="/requests" element={<Requests />} />
          </Route>
        {/* standalone public pages */}
        <Route path="/login" element={<Login />} />
        
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;