import React, { useMemo } from "react";
import "./panels.css";

export default function Panels({
  dataResponse,
  eventsResponseAPI,
  ActiveInactive = [],
}) {
  console.log("ActiveInactive Raw:", ActiveInactive);

  // ✅ STEP 1: Prepare table-ready data (date & time separated)
  const panelTableData = useMemo(() => {
    return ActiveInactive.map((item) => {
      let date = "";
      let time = "";

      if (item.last_update) {
        const istDate = new Date(item.last_update);

        date = istDate.toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
        });

        time = istDate.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",

          hour12: true,
        });
      }

      return {
        ...item,
        date,
        time,
      };
    });
  }, [ActiveInactive]);

  console.log("Processed Panel Data:", panelTableData);

  // ✅ STEP 2: Separate Active & Inactive panels
  const activePanels = panelTableData.filter((p) => p.is_active);
  const inactivePanels = panelTableData.filter((p) => !p.is_active);
  console.log("Active Panels:", activePanels.length);
  console.log("Inactive Panels:", inactivePanels.length);

  return (
    <div className="panels-page">
      {/* <div className="page-header">Panel</div> */}

      {/* ================= ACTIVE PANEL TABLE ================= */}
      <div className="panel-section">
        <h3 className="panel-title">ACTIVE PANELS</h3>
        <div className="table-container">
          <table className="panel-table-1">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activePanels.length > 0 ? (
                activePanels.map((row, index) => (
                  <tr key={row.id || index}>
                    <td>{index+1}</td>

                    <td>{row.name}</td>
                    <td>{row.type}</td>
                    <td className="status-active">
                      {row.is_active ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-data">
                  <td >No Active Panels</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= INACTIVE PANEL TABLE ================= */}
      <div className="panel-section">
        <h3 className="panel-title">INACTIVE PANELS</h3>
        <div className="table-container">
          <table className="panel-table inactive">
            <thead>
              <tr>
                <th>S/N</th>

                <th>Name</th>
                <th>Type</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {inactivePanels.length > 0 ? (
                inactivePanels.map((row, index) => (
                  <tr key={row.id || index}>
                    <td>{index+1}</td>

                    <td>{row.name}</td>
                    <td>{row.type}</td>
                    <td>{row.time || "N/A"}</td>
                    <td>{row.date || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Inactive Panels</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
