import React, { useMemo } from "react";
import { AiOutlineTable } from "react-icons/ai";
import "./InactivePanel.css";

export default function InactivePanel({ ActiveInactive = [] }) {
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

  // ✅ STEP 2: Separate Active & Inactive panels
  const activePanels = panelTableData.filter((p) => p.is_active);
  const inactivePanels = panelTableData.filter((p) => !p.is_active);
  return (
    <div className="inactive-panel-container">
      <div className="panel-header-title">
        <div className="table-icon-wrapper">
          <AiOutlineTable className="table-icon-modern" />
        </div>
        <h2 className="inactive-title">INACTIVE PANELS</h2>
      </div>
      <div className="inactive-table-wrapper">
        <table className="inactive-table">
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
                  <td>{index + 1}</td>

                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.time || "N/A"}</td>
                  <td>{row.date || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No Inactive Panels</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
