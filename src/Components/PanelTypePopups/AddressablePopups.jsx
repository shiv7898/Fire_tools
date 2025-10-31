import React, { useEffect, useState, useRef } from "react";
import { IoBulb } from "react-icons/io5";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell } from "react-icons/gi";
import { GiRingingAlarm } from "react-icons/gi";
import { FaPersonRunning } from "react-icons/fa6";
import { TbSettingsExclamation } from "react-icons/tb";

import { Link } from "react-router-dom";
import "../CssComponent/PanelTypePopup/AddressablePopup.css";
import {
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
export default function AddressablePopup({ panel, onClose, selectedPanel }) {
  const [activeTab, setActiveTab] = useState("fire");
  const [popupValue, setPopupValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [confirmation, setConfirmation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(null);
  const dropdownRef = useRef(null);

  const options = [
    { label: "RESET", icon: <RiResetLeftFill /> },
    { label: "SIL BUZZ", icon: <GiRingingBell /> },
    { label: "SIL ALARM", icon: <GiRingingAlarm /> },
    { label: "RESOUND", icon: <FaVolumeUp /> },
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
  const handleClosePopup = () => {
    setClicked("cancel");
    setShowPopup(false);
 
 
    
  }
  const handleSave = () => {
    if (confirmation === "Yes") {
      setMainValue(popupValue);
    }
     setShowPopup(false);
    
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
    <div className="addressable-event-container">
      <div className="addressable-subtitle">
        {/* <div className="address">
           <span>Addressable Panel</span>
         </div> */}
        <div className="addressable-panel-name">
          <span className="">{selectedPanel?.type || ""}</span>
        </div>
        <div className="addressable-location addressable-update-popup">
          <input
            type="text"
            value={selectedPanel?.name || ""}
            className="addressable-location-input-1"
            readOnly
            onClick={handleOpenPopup}
            title="Update panel name"
          />
        </div>
        <div
          className="addressable-button-container addressable-location"
          ref={dropdownRef}
        >
          <div className="addressable-dropdown">
            <button
              className="addressable-dropdown-toggle"
              onClick={() => setIsOpen(!isOpen)}
            >
              Actions
              <span className="addressable-arrow-drop">
                {isOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
              </span>
            </button>
            {isOpen && (
              <div className="addressable-dropdown-menu">
                {options.map((opt, index) => (
                  <div key={index} className="addressable-dropdown-item">
                    <span className="addressable-icon">{opt.icon}</span>
                    <span className="addressable-label">{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {showPopup && (
          <div className="addressable-popup-overlay">
            <div className="addressable-popup-box">
              <h3>Update</h3>

              <input
                type="text"
                id="addressable-popup-input"
                value={popupValue}
                onChange={(e) => setPopupValue(e.target.value)}
              />

              <div className="addressable-popup-actions">
                <button
                  onClick={handleClosePopup}
                  className="addressable-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="addressable-confirm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="addressable-status-grid">
        <div className="addressable-status-item green">
          <IoBulb className="addressable-icon" /> <span>MAINS</span>
        </div>
        <div className="addressable-status-item red">
          <FaFire className="addressable-icon" /> <span>FIRE</span>
        </div>
        <div className="addressable-status-item gray">
          <IoMdBatteryCharging className="addressable-icon" />{" "}
          <span>B.MODE</span>
        </div>
        <div className="addressable-status-item gray">
          <FaExclamationCircle className="addressable-icon" />{" "}
          <span>FAULT</span>
        </div>
        <div className="addressable-status-item gray">
          <FaVolumeUp className="addressable-icon" /> <span>SIL ALARM</span>
        </div>
        <div className="addressable-status-item gray">
          <TbSettingsExclamation  className="addressable-icon" /> <span>SYS FAULT</span>
        </div>
        <div className="addressable-status-item gray">
          <FaBell className="addressable-icon" /> <span>PRE ALARM</span>
        </div>
        <div className="addressable-status-item gray">
          <FaInfinity className="addressable-icon" /> <span>CONNECTED</span>
        </div>
      </div>

      {selectedPanel && (
        <div className="addressable-container">
          <div className="addressable-status-container">
            <div className="addressable-tabs">
              <button
                className={`addressable-tab ${
                  activeTab === "fire" ? "active fire" : ""
                }`}
                onClick={() => setActiveTab("fire")}
              >
                FIRE ({selectedPanel.fire ?? 0})
              </button>
              <button
                className={`addressable-tab ${
                  activeTab === "fault" ? "active fault" : ""
                }`}
                onClick={() => setActiveTab("fault")}
              >
                FAULT ({selectedPanel.fault ?? 0})
              </button>
              <button
                className={`addressable-tab ${
                  activeTab === "activated" ? "active activated" : ""
                }`}
                onClick={() => setActiveTab("activated")}
              >
                ACTIVATED ({selectedPanel.activated ?? 0})
              </button>
              <button
                className={`addressable-tab ${
                  activeTab === "sysfault" ? "active sysfault" : ""
                }`}
                onClick={() => setActiveTab("sysfault")}
              >
                SYS FAULT ({selectedPanel.sysfault ?? 0})
              </button>
            </div>

            <div className={`addressable-content-box ${activeTab}`}>
              <div className="addressable-content-scroll">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`addressable-inner-box ${activeTab}`}
                >
                  {item.split(",").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
