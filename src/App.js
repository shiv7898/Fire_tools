import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Components/Login";
import Dashboard from "./Components/dashboard";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import ConfermPassword from "./Components/ResetPassword/ConfermPassword";
import ActivityRecord from "./Components/Log/activityRecord";

import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  function getData(responseData) {
    setUserData(responseData);
  }

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("access_token");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setLoading(false); // ✅ Done checking
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  if (loading) return <div>Loading...</div>; // ✅ Wait until storage check finishes

  return (
    <Router>
      <Routes>

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-confirm" element={<ConfermPassword />} />
        <Route
          path="/login"
          element={
            userData ? <Navigate to="/" replace /> : <Login getData={getData} />
          }
        />
        <Route
          path="/activity-record"
          element={
            <ProtectedRoute userData={userData}>
              <ActivityRecord />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute userData={userData}>
              <Dashboard userData={userData} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
