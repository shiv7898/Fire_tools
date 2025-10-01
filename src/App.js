// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Components/Login";

import Dashboard from "./Components/dashboard";
import TowerPopup from "./Pages/TowerPopup";
import { useEffect, useState } from "react";
import UploadForm from "./Components/Demo";

function App() {
  const [userData, setUserData] = useState(null);
  console.log("user data from login",userData)
  // const { isAuthenticated } = useContext(AppContext);
  function getData( responseData ) {
    setUserData( responseData );
  }
  // 
  useEffect(() => {
    getData();
    
  }, []);

  return (
    <Router>
      <Routes>
        {/* <Route path="/dashboard" element={<UploadForm/>} /> */}

        <Route path="/" element={<Login getData={getData }/>} />
        <Route path="/dashboard" element={<Dashboard userData={userData}/>} />
        {/* <Route path="/dashboard/event" element={<TowerPopup />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
