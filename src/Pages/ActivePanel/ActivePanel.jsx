import React from "react";
import "./ActivePanel.css"; // we’ll create styles separately

export default function ActivePanel() {
  const data = [
    { name: "r1/tower/1111", type: "addressable", status: "True" },
    { name: "r1/tower/1112", type: "conventional", status: "True" },
    { name: "r1/tower/1113", type: "regal", status: "True" },
    { name: "r1/tower/1114", type: "addressable", status: "False" },
    { name: "r1/tower/1115", type: "addressable", status: "True" },
    { name: "r1/tower/1116", type: "eco", status: "True" }, { name: "r1/tower/1111", type: "addressable", status: "True" },
    { name: "r1/tower/1112", type: "conventional", status: "True" },
    { name: "r1/tower/1113", type: "regal", status: "True" },
    { name: "r1/tower/1114", type: "addressable", status: "False" },
    { name: "r1/tower/1115", type: "addressable", status: "True" },
    { name: "r1/tower/1116", type: "eco", status: "True" },
  ];

  return (
    <div className="active-panel-container">
      <h2 className="title">Active Panel</h2>
      <div className="table-wrapper-active-panel">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.type}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

