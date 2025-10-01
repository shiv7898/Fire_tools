import React from 'react';
import './panels.css';

export default function Panels() {
  const activePanelData = [
    { name: 'r1/tower/1111', type: 'addressable', status: 'True' },
    { name: 'r1/tower/1112', type: 'conventional', status: 'True' },
    { name: 'r1/tower/1113', type: 'regal', status: 'False' },
    { name: 'r1/tower/1114', type: 'eco', status: 'True' },  { name: 'r1/tower/1111', type: 'addressable', status: 'True' },
    { name: 'r1/tower/1112', type: 'conventional', status: 'True' },
    { name: 'r1/tower/1113', type: 'regal', status: 'False' },
    { name: 'r1/tower/1114', type: 'eco', status: 'True' },
  ];

  const inactivePanelData = [
    { name: 'r1/tower/1115', type: 'conventional', time: '02:10 pm', date: '01/08/25' },
    { name: 'r1/tower/1116', type: 'regal', time: '06:10 pm', date: '01/08/25' },
    { name: 'r1/tower/1117', type: 'addressable', time: '01:10 am', date: '01/08/25' },
    { name: 'r1/tower/1118', type: 'addressable', time: '03:10 am', date: '01/08/25' },
  ];

  return (
    <div className="panels-page">
      <div className="page-header">Panel</div>

      {/* Active Panel Table */}
      <div className="panel-section">
        <h3 className="panel-title">Active Panel</h3>
        <div className="table-container">
          <table className="panel-table-1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activePanelData.map((row, index) => (
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

      {/* Inactive Panel Table */}
      <div className="panel-section">
        <h3 className="panel-title">Inactive Panel</h3>
        <div className="table-container">
          <table className="panel-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {inactivePanelData.map((row, index) => (
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
    </div>
  );
}
