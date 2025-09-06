import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/HomePage";
import DashBoard from "./pages/DashBoard";
import TemplatesPage from "./pages/TemplatesPage";
import ActivityPage from "./pages/ActivityPage";
import AboutPage from "./pages/AboutPage";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute"; // NEW

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/TemplatesPage" element={<TemplatesPage />} />
          <Route path="/ActivityPage" element={<ActivityPage />} />
          <Route path="/AboutPage" element={<AboutPage />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
