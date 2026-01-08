import React from "react";
import "./ActivePanel.css"; // we’ll create styles separately

export default function ActivePanel({dataResponse, eventsResponseAPI}) {

  const mergedPanels = dataResponse.panels.map(panel => {

    // 1️⃣ Set Panel Type Name
    let panelType = "";
    if (panel.panel_type === 0) panelType = "Conventional";
    else if (panel.panel_type === 1) panelType = "Addressable";
    else if (panel.panel_type === 2) panelType = "Echo";
    else panelType = "Regal";

    // 2️⃣ Match events by panel_id and topic
    const matchedEvents = eventsResponseAPI.filter(event =>
      event.panel_id === panel.id &&
      event.topic === panel.panel_topic
    );

    // 3️⃣ Return final merged structure
    return {
      panel_id: panel.id,
      panel_name: panel.panel_name,
      panel_type: panelType,        // ← added
      panel_topic: panel.panel_topic,
      led_status: panel.led_status,
      status: dataResponse.status,
      events: matchedEvents
    };
  });

  console.log("MERGED PANELS FINAL:", mergedPanels);
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
             { mergedPanels.map((row, index) => (
                <tr key={index}>
                  <td>{row.panel_name}</td>
                  <td>{row.panel_type}</td>
                  <td>{row.status?"Active":"Inactive"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

