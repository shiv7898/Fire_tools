import React, { useState } from "react";
import axios from "axios";
import { ImSwitch } from "react-icons/im";
import { FaBatteryHalf } from "react-icons/fa6";
import { FaVolumeUp } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell } from "react-icons/gi";
import { GiRingingAlarm } from "react-icons/gi";
import { TbBulbFilled } from "react-icons/tb";
import "../CssComponent/PanelTypePopup/ConventionalPopup.css";
import { FaFire, FaExclamationCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { logActivity } from "../Log/activityLogger";

export default function ConventionalPopup({
  data: {
    panel,

    selectedPanel,
    selectPanelLedStatuses,
    processLEDStatus,
    updateCurrentData,
    sendMqttCommand,
  },
}) {
  const { name } = selectedPanel;

  const handleActionClick = (action) => {
    sendMqttCommand(selectedPanel.topic, action);
  };
  const handlePanelSave = async () => {
    if (!popupValue.trim()) return;

    try {
      const res = await axios.put(`/v2/panels/${selectedPanel.id}`, {
        panel_name: popupValue,
      });

      handleClosePopup();
      window.location.reload();

      // ✅ Close popup
    } catch (error) {
      console.error("Failed to update panel name", error);
    }
  };

  const led_status = processLEDStatus(
    selectedPanel,
    selectedPanel?.led_status || selectPanelLedStatuses
  );


  // ✅ Filter only current panel data based on ID or Topic
  const panelData = Array.isArray(updateCurrentData)
    ? updateCurrentData.find((p) => p.id === selectedPanel?.id)
    : updateCurrentData?.id === selectedPanel?.id
      ? updateCurrentData
      : null;




  const [popupValue, setPopupValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [confirmation, setConfirmation] = useState("");

  const handleOpenPopup = () => {
    setPopupValue(selectedPanel?.name || "");
    setShowPopup(true);
  };
  const handleClosePopup = () => setShowPopup(false);


  return (
    <div className="conventional-event-container">
      {/* 🔹 Header */}
      <div className="conventional-subtitle">
        <div className="conventional-name-container">
          {selectedPanel?.type || ""}
        </div>
        <div
          className="conventional-location conventional-update-popup"
          onClick={handleOpenPopup}
        >
          <div className="conv-input-icon-container ">
            <span>{selectedPanel?.name || ""} </span>
            <FaEdit
              className="conventional-edit-icon"
              onClick={handleOpenPopup}
            />
          </div>
        </div>
      </div>
      <div className="conventional-iotid">
        <span>IOT ID: {selectedPanel?.topic || "N/A"}</span>
      </div>

      {/* 🔹 Update Name Popup */}
      {showPopup && (
        <div className="conventional-popup-overlay">
          <div className="conventional-popup-box slide-in-right">
            <div className="popup-title-container">
              <div className="popup-title-icon">
                <RxUpdate />
              </div>
              <h3>Update Panel Name</h3>
            </div>

            <input
              type="text"
              id="conventional-popup-input"
              value={popupValue}
              onChange={(e) => setPopupValue(e.target.value)}
            />

            <div className="conventional-popup-actions">
              <button
                onClick={handleClosePopup}
                className="conventional-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handlePanelSave}
                className="conventional-confirm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 LED Status Indicators */}
      <div className="conventional-status-grid">
        <div
          className={`conventional-status-item ${led_status.main == 1 ? "green" : "gray"
            }`}
        >
          <div className="add_icon_background_conve">
            <ImSwitch className="conventional-icon" />
          </div>
          <span>MAINS</span>
        </div>

        <div
          className={`conventional-status-item ${led_status.fire == 1 ? "red" : "gray"
            }`}
        >
          <div className="add_icon_background_conve">
            <FaFire className="conventional-icon" />
          </div>
          <span>FIRE</span>
        </div>

        <div
          className={`conventional-status-item ${led_status.batt == 1 ? "yellow" : "gray"
            }`}
        >
          <div className="add_icon_background_conve">
            <FaBatteryHalf className="conventional-icon" />
          </div>

          <span>BATTERY MODE</span>
        </div>

        <div
          className={`conventional-status-item ${led_status.fault == 1 ? "yellow" : "gray"
            }`}
        >
          <div className="add_icon_background_conve">
            <FaExclamationCircle className="conventional-icon" />
          </div>

          <span>FAULT</span>
        </div>

        <div
          className={`conventional-status-item ${led_status.hooter == 1 ? "yellow" : "gray"
            }`}
        >
          <div className="add_icon_background_conve">
            <FaVolumeUp className="conventional-icon" />
          </div>
          <span>HOOTER</span>
        </div>
      </div>

      {/* 🔹 Panel Buttons */}
      <div className="conventional-button-container">
        <button
          className="conventional-btn-main"
          onClick={() => {
            handleActionClick(1);
            logActivity(`RESET PRESSED (${name})`);
          }}
        >
          <RiResetLeftFill className="conventional-btn-icon" />
          <span className="conventional-btn-label">RESET</span>
        </button>
        <button
          className="conventional-btn-main"
          onClick={() => {
            handleActionClick(2);
            logActivity(`SIL BUZZ PRESSED (${name})`);
          }}
        >
          <GiRingingBell className="conventional-btn-icon" />
          <span className="conventional-btn-label">SIL BUZZ</span>
        </button>
        <button
          className="conventional-btn-main"
          onClick={() => {
            handleActionClick(3);
            logActivity(`SIL ALARM PRESSED (${name})`);
          }}
        >
          <GiRingingAlarm className="conventional-btn-icon" />
          <span className="conventional-btn-label">SIL ALARM</span>
        </button>
        <button
          className="conventional-btn-main"
          onClick={() => {
            handleActionClick(6);
            logActivity(`L TEST PRESSED (${name})`);
          }}
        >
          <TbBulbFilled className="conventional-btn-icon" />
          <span className="conventional-btn-label">L TEST</span>
        </button>
      </div>
    </div>
  );
}
