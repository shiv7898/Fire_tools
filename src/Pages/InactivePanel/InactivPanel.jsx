import React from "react";
import "./InactivePanel.css";

export default function InactivePanel() {
  const data = [
    { name: "r1/tower/1116", type: "addressable", time: "02:10 pm", date: "01/08/25" },
    { name: "r1/tower/1117", type: "conventional", time: "02:10 pm", date: "01/08/25" },
    { name: "r1/tower/1118", type: "regal", time: "02:10 pm", date: "01/08/25" },
    { name: "r1/tower/1119", type: "addressable", time: "02:10 pm", date: "01/08/25" },
    { name: "r1/tower/1120", type: "addressable", time: "02:10 pm", date: "01/08/25" },
    { name: "r1/tower/1121", type: "eco", time: "02:10 pm", date: "01/08/25" },
  ];

  return (
    <div className="inactive-panel-container">
      <h2 className="inactive-title">Inactive Panel</h2>
      <div className="inactive-table-wrapper">
        <table className="inactive-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.type}</td>
                <td>{row.time}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

