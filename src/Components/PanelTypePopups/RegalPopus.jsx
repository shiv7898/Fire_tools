import React, { useEffect, useState, useRef } from "react";
import { IoBulb } from "react-icons/io5";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp , FaBellSlash } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell } from "react-icons/gi";
import { FaPersonRunning } from "react-icons/fa6";
import { TbSettingsExclamation } from "react-icons/tb";
import { MdWrongLocation } from "react-icons/md";

import { Link } from "react-router-dom";
import "../CssComponent/PanelTypePopup/RegalPopup.css";
import {
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
export default function RegalPopup({ panel, onClose, selectedPanel }) {
  const [activeTab, setActiveTab] = useState("fire");
  const [popupValue, setPopupValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [confirmation, setConfirmation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { label: "RESET", icon: <RiResetLeftFill /> },
    { label: "SILENCE", icon: <FaBellSlash /> },
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
    <div className="regal-event-container">
      <div className="regal-subtitle">
        {/* <div className="address">
           <span>Addressable Panel</span>
         </div> */}
        <div className="regal-panel-name">
          <span className="">{selectedPanel?.type || ""}</span>
        </div>
        <div className="regal-location regal-update-popup">
          <input
            type="text"
            value={selectedPanel?.name || ""}
            className="regal-location-input-1"
            readOnly
            onClick={handleOpenPopup}
            title="Update panel name"
          />
        </div>
        <div
          className="regal-button-container regal-location"
          ref={dropdownRef}
        >
          <div className="regal-dropdown">
            <button
              className="regal-dropdown-toggle"
              onClick={() => setIsOpen(!isOpen)}
            >
              Actions
              <span className="regal-arrow-drop">
                {isOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
              </span>
            </button>
            {isOpen && (
              <div className="regal-dropdown-menu">
                {options.map((opt, index) => (
                  <div key={index} className="regal-dropdown-item">
                    <span className="regal-icon">{opt.icon}</span>
                    <span className="regal-label">{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {showPopup && (
          <div className="regal-popup-overlay">
            <div className="regal-popup-box">
              <h3>Update</h3>

              <input
                type="text"
                id="regal-popup-input"
                value={popupValue}
                onChange={(e) => setPopupValue(e.target.value)}
              />

              <div className="regal-popup-actions">
                <button
                  onClick={handleClosePopup}
                  className="regal-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="regal-confirm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="regal-status-grid">
        <div className="regal-status-item green">
          <IoBulb className="regal-icon" /> <span>MAINS</span>
        </div>
        <div className="regal-status-item red">
          <FaFire className="regal-icon" /> <span>FIRE</span>
        </div>
        <div className="regal-status-item gray">
          <IoMdBatteryCharging className="regal-icon" />{" "}
          <span>B.MODE</span>
        </div>
        <div className="regal-status-item gray">
          <FaExclamationCircle className="regal-icon" />{" "}
          <span>FAULT</span>
        </div>
        <div className="regal-status-item gray">
          <FaBellSlash className="regal-icon" /> <span>SILENCE</span>
        </div>
        <div className="regal-status-item gray">
          <TbSettingsExclamation className="regal-icon" /> <span>SYS FAULT</span>
        </div>
        <div className="regal-status-item gray">
          <MdWrongLocation  className="regal-icon" /> <span>ZONE ISO</span>
        </div>
        <div className="regal-status-item gray">
          <FaPersonRunning className="regal-icon" /> <span>EVACUATE</span>
        </div>
      </div>

      {selectedPanel && (
        <div className="regal-container">
          <div className="regal-status-container">
            <div className="regal-tabs">
              <button
                className={`regal-tab ${
                  activeTab === "fire" ? "active fire" : ""
                }`}
                onClick={() => setActiveTab("fire")}
              >
                FIRE({selectedPanel.fire ?? 0})
              </button>
              <button
                className={`regal-tab ${
                  activeTab === "fault" ? "active fault" : ""
                }`}
                onClick={() => setActiveTab("fault")}
              >
                FAULT({selectedPanel.fault ?? 0})
              </button>
              {/* <button
                className={`tab ${
                  activeTab === "activated" ? "active activated" : ""
                }`}
                onClick={() => setActiveTab("activated")}
              >
                ACTIVATED({selectedPanel.activated ?? 0})
              </button> */}
              <button
                className={`regal-tab ${
                  activeTab === "sysfault" ? "active sysfault" : ""
                }`}
                onClick={() => setActiveTab("sysfault")}
              >
                SYS FAULT({selectedPanel.sysfault ?? 0})
              </button>
            </div>

            <div className={`regal-content-box ${activeTab}`}>
              <div className="regal-content-scroll">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`regal-inner-box ${activeTab}`}
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

