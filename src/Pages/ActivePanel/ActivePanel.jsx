import React, { useMemo } from "react";
import "./ActivePanel.css"; // we’ll create styles separately

export default function ActivePanel({dataResponse, eventsResponseAPI,ActiveInactive = [],}) {

  
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
   

    
 

  
  

  return (
    <div className="active-panel-container">
      <h2 className="title">ACTIVE PANELS</h2>
      <div className="table-wrapper-active-panel">
        <table className="panel-table-active">
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
                <tr>
                  <td >No Active Panels</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

