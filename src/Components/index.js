import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./dashboard/Dashboard";

export default function Profile() {
  // const [responseData, setResponseData] = useState(null);
  async function getData({ responseData }) {
    console.log("Sending data:", responseData);
  }

  console.log("Response Data in Profile:", responseData);

  return (
    <div>
      {!responseData ? (
        <Login getData={getData} />
      ) : (
        <Dashboard data={responseData} />
      )}
    </div>
  );
}
