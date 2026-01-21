import React, { useState, useEffect } from "react";
import "./activityRecord.css";
import { getLogs, subscribeToLogs, logActivity } from "./activityLogger";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function ActivityRecord() {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    // Load logs on mount and subscribe to updates
    useEffect(() => {
        // Initial load
        setActivities(getLogs());

        // Real-time subscription
        const unsubscribe = subscribeToLogs((updatedLogs) => {
            setActivities(updatedLogs);
        });

        // Cleanup listener
        return () => unsubscribe();
    }, []);

    return (
        <div className="activity-page">
            <div className="table-container-log">

                {/* Header Section */}
                <div className="table-header">
                    <div className="header-content">
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <button
                                className="back-btn"
                                onClick={() => navigate(-1)}
                                aria-label="Go Back"
                            >
                                <IoArrowBack />
                            </button>
                            <h2>Activity Log</h2>
                        </div>
                        {/* Demonstration Button */}
                        {/* <button
                            className="demo-btn"
                            onClick={() => logActivity("Sil Buz Pressed")}
                        >
                            Simulate "Sil Buz"
                        </button> */}
                    </div>
                </div>

                {/* Scrollable Table Wrapper */}
                <div className="responsive-table-wrapper">
                    <table className="activity-table">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Action</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <tr key={activity.id}>
                                        <td className="sn-cell">{index + 1}</td>
                                        <td>{activity.action}</td>
                                        <td>{activity.date}</td>
                                        <td>{activity.time}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                        No history found. Press the button above to test.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}