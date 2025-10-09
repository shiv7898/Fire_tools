import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Components/Login";
import Dashboard from "./Components/dashboard";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  function getData(responseData) {
    setUserData(responseData);
  }

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
        <Route path="/" element={<Login getData={getData} />} />
        <Route
          path="/dashboard"
          element={
            userData ? (
              <Dashboard userData={userData} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
// ??

export default App;
