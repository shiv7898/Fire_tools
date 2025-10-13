import React, { useEffect, useState, useRef } from "react";
import { IoBulb } from "react-icons/io5";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell } from "react-icons/gi";
import { GiRingingAlarm } from "react-icons/gi";
import { FaPersonRunning } from "react-icons/fa6";

import { Link } from "react-router-dom";
import "../CssComponent/PanelTypePopup/EchoPopup.css";
import {
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
export default function EchoPopup({ panel, onClose, selectedPanel }) {
  const [activeTab, setActiveTab] = useState("fire");
  const [popupValue, setPopupValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [confirmation, setConfirmation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { label: "RESET", icon: <RiResetLeftFill /> },
    { label: "SILENCE", icon: <GiRingingBell /> },
    { label: "L.TEST", icon: <GiRingingAlarm /> },
   
    { label: "EVACUATE", icon: <FaPersonRunning /> },
  ];

  const data = [
    "Fire DEV :01 LOOP:01, []",
    "Fire D :01 L:01,[]",
    "P.NO\\LN-0 Main Fan",
    "P.NO\\LN-0 Main Fan",
    "P.NO\\LN-0 Main Fan",
    "P.NO\\LN-0 Main Fan",
    "P.NO\\LN-0 Main Fan",
    "P.NO\\LN-0 Main Fan",
    "P.NO\\LN-0 Main Fan",
    "P.NO\\LN-0 Main Fan",
  ];
  const handleOpenPopup = () => {
    setPopupValue("popupValue");
    setShowPopup(true);
  };
  const handleClosePopup = () => setShowPopup(false);
  const handleSave = () => {
    if (confirmation === "Yes") {
      setMainValue(popupValue);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // cleanup listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="echo-event-container">
      <div className="echo-subtitle">
        {/* <div className="address">
           <span>Addressable Panel</span>
         </div> */}
        <div className="echo-panel-name">
          <span className="">{selectedPanel?.type || ""}</span>
        </div>
        <div className="echo-location echo-update-popup">
          <input
            type="text"
            value={selectedPanel?.name || ""}
            className="echo-location-input-1"
            readOnly
            onClick={handleOpenPopup}
            title="Update panel name"
          />
        </div>
        <div
          className="echo-button-container echo-location"
          ref={dropdownRef}
        >
          <div className="echo-dropdown">
            <button
              className="echo-dropdown-toggle"
              onClick={() => setIsOpen(!isOpen)}
            >
              Actions
              <span className="echo-arrow-drop">
                {isOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
              </span>
            </button>
            {isOpen && (
              <div className="echo-dropdown-menu">
                {options.map((opt, index) => (
                  <div key={index} className="echo-dropdown-item">
                    <span className="echo-icon">{opt.icon}</span>
                    <span className="echo-label">{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {showPopup && (
          <div className="echo-popup-overlay">
            <div className="echo-popup-box">
              <h3>Update</h3>

              <input
                type="text"
                id="echo-popup-input"
                value={popupValue}
                onChange={(e) => setPopupValue(e.target.value)}
              />

              <div className="echo-popup-actions">
                <button
                  onClick={handleClosePopup}
                  className="echo-btn echo-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="echo-btn echo-confirm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="echo-status-grid">
        <div className="echo-status-item green">
          <IoBulb className="echo-icon" /> <span>MAINS ON</span>
        </div>
        <div className="echo-status-item red">
          <FaFire className="echo-icon" /> <span>FIRE</span>
        </div>
        <div className="echo-status-item gray">
          <IoMdBatteryCharging className="echo-icon" />{" "}
          <span>B.MODE</span>
        </div>
        <div className="echo-status-item gray">
          <FaExclamationCircle className="echo-icon" />{" "}
          <span>FAULT</span>
        </div>
        <div className="echo-status-item gray">
          <FaVolumeUp className="echo-icon" /> <span>EVACUATE</span>
        </div>
        <div className="echo-status-item gray">
          <FaCogs className="echo-icon" /> <span>SILENCE</span>
        </div>
        <div className="echo-status-item gray">
          <FaBell className="echo-icon" /> <span>B.LOW</span>
        </div>
        <div className="echo-status-item gray">
          <FaInfinity className="echo-icon" /> <span>B.CHARGE</span>
        </div>
      </div>

      {selectedPanel && (
        <div className="echo-container">
          <div className="echo-status-container">
            {/* <div className="echo-tabs">
              <button
                className={`echo-tab ${
                  activeTab === "fire" ? "active fire" : ""
                }`}
                onClick={() => setActiveTab("fire")}
              >
                FIRE({selectedPanel.fire ?? 0})
              </button>
              <button
                className={`echo-tab ${
                  activeTab === "fault" ? "active fault" : ""
                }`}
                onClick={() => setActiveTab("fault")}
              >
                FAULT({selectedPanel.fault ?? 0})
              </button>
              <button
                className={`tab ${
                  activeTab === "activated" ? "active activated" : ""
                }`}
                onClick={() => setActiveTab("activated")}
              >
                ACTIVATED({selectedPanel.activated ?? 0})
              </button>
              <button
                className={`echo-tab ${
                  activeTab === "sysfault" ? "active sysfault" : ""
                }`}
                onClick={() => setActiveTab("sysfault")}
              >
                SYS FAULT({selectedPanel.sysfault ?? 0})
              </button>
            </div> */}

            <div className={`echo-content-box ${activeTab}`}>
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`echo-inner-box ${activeTab}`}
                >
                  {item.split(",").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
