import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { IoBulb } from "react-icons/io5";
import { ImSwitch } from "react-icons/im";
import { FaBatteryHalf } from "react-icons/fa6";
import { FaVolumeUp } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell, GiRingingAlarm } from "react-icons/gi";
import { FaPersonRunning } from "react-icons/fa6";
import { TbSettingsExclamation } from "react-icons/tb";
import {
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaInfinity,
} from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import "../CssComponent/PanelTypePopup/AddressablePopup.css";

export default function AddressablePopup({
  data: {
    panel,
    selectedPanel,
    selectPanelLedStatuses,
    processLEDStatus,
    updateCurrentData,
    selectedPanelEvent,
    sendMqttCommand,
  },
}) {
  console.log("Panel Props (Addressable):", selectedPanelEvent);
  const [activeTab, setActiveTab] = useState("fire");
  const [popupValue, setPopupValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [confirmation, setConfirmation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(null);
  const dropdownRef = useRef(null);

  const options = [
    {
      label: "RESET",
      action: "RESET",
      icon: <RiResetLeftFill className="icon_color" />,
    },
    {
      label: "SIL BUZZ",
      action: "SILENCE",
      icon: <GiRingingBell className="icon_color" />,
    },
    {
      label: "SIL ALARM",
      action: "SILENCE_ALARM",
      icon: <GiRingingAlarm className="icon_color" />,
    },
    {
      label: "EVACUATE",
      action: "EVACUATE",
      icon: <FaPersonRunning className="icon_color" />,
    },
    {
      label: "RESOUND",
      action: "RESOUND",
      icon: <FaVolumeUp className="icon_color" />,
    },
  ];

  const handleActionClick = (action) => {
    sendMqttCommand(selectedPanel.topic, action);
    setIsOpen(false);
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
    selectedPanel?.led_status || selectPanelLedStatuses || ""
  );
  console.log("LED Status:", selectedPanel);

  // ✅ Extract live event data safely

  const fireEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 2) || [];
  const faultEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 3) || [];
  const sysFaultEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 4) || [];
  const activatedEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 5) || [];
  console.log("Fire Events:", fireEvents);
  console.log("Fault Eventsaaa:", faultEvents);
  console.log("Sys Fault Eventsqdw:", sysFaultEvents);
  console.log("Activated Events:", activatedEvents);

  const uniqueFireEvents = Array.from(
  new Map(
    fireEvents.map(ev => [
      `${ev.deviceNo}-${ev.deviceTypeText}`, // 🔑 unique key
      ev
    ])
  ).values()
);

console.log("Unique Fire Events:", uniqueFireEvents);

  // 🧩 Popup handlers
  const handleOpenPopup = () => {
    setPopupValue(selectedPanel?.name || "");
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setClicked("cancel");
    setShowPopup(false);
  };
  const handleSave = () => {
    if (confirmation === "Yes") setMainValue(popupValue);
    setShowPopup(false);
  };

  // 🧩 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="addressable-event-container">
      {/* ---------------- Header Section ---------------- */}
      <div className="addressable-subtitle">
        <div className="addressable-panel-name">
          <span>{selectedPanel?.type || ""}</span>
        </div>

        <div
          className="addressable-location addressable-update-popup"
          onClick={handleOpenPopup}
        >
          <div className="input-with-icon">
            <span>{selectedPanel?.name || ""} </span>
            <FaEdit className="input-icon" />
          </div>
        </div>
      </div>
      <div className="addressable-subtitle">
        <div className="addressable-iot-section">
          <span className="addressable-location-label">
            {" "}
            IOT ID: {selectedPanel?.topic || "N/A"}
          </span>
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
              {/* <span className="addressable-arrow-drop"> */}
                {isOpen ? <RiArrowDropUpLine className="drop" /> : <RiArrowDropDownLine className="drop" />}
              {/* </span> */}
            </button>
            {isOpen && (
              <div className="addressable-dropdown-menu">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className="addressable-dropdown-item slide-in"
                    style={{ animationDelay: `${index * 70}ms` }}
                    onClick={() => handleActionClick(index + 1)}
                  >
                    <span className="addressable-icon">{opt.icon}</span>
                    <span className="addressable-label">{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- Edit Popup ---------------- */}
      {showPopup && (
        <div className="addressable-popup-overlay">
          <div className="addressable-popup-box slide-in-right">
            <h3>Update Panel Name</h3>

            <input
              type="text"
              value={popupValue}
              onChange={(e) => setPopupValue(e.target.value)}
              id="addressable-popup-input"
            />

            <div className="addressable-popup-actions">
              <button onClick={handleClosePopup} className="addressable-cancel">
                Cancel
              </button>
              <button onClick={handlePanelSave} className="addressable-confirm">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- LED Status Grid ---------------- */}
      <div className="addressable-status-grid">
        <div
          className={`addressable-status-item ${
            led_status.main == 1 ? "green" : "gray"
          }`}
        >
          <div className="add_icon_background">
            <ImSwitch className="addressable-icon" />
          </div>{" "}
          <span>MAINS</span>
        </div>

        <div
          className={`addressable-status-item ${
            led_status.fire == 1 ? "red" : "gray"
          }`}
        >
          <div className="add_icon_background">
            <FaFire className="addressable-icon" />
          </div>
          <span>FIRE</span>
        </div>

        <div className="addressable-status-item gray">
          <div className="add_icon_background">
            <FaBatteryHalf className="addressable-icon" />
          </div>

          <span>BATTERY MODE</span>
        </div>

        <div
          className={`addressable-status-item ${
            led_status.fault == 1 ? "yellow" : "gray"
          }`}
        >
          <div className="add_icon_background">
            <FaExclamationCircle className="addressable-icon" />
          </div>

          <span>FAULT</span>
        </div>

        <div
          className={`addressable-status-item ${
            led_status.sil == 1 ? "yellow" : "gray"
          }`}
        >
          <div className="add_icon_background">
            {" "}
            <FaVolumeUp className="addressable-icon" />
          </div>
          <span>SIL ALARM</span>
        </div>

        <div
          className={`addressable-status-item ${
            led_status.sys == 1 ? "blue" : "gray"
          }`}
        >
          <div className="add_icon_background">
            <TbSettingsExclamation className="addressable-icon" />
          </div>

          <span>SYS FAULT</span>
        </div>

        <div
          className={`addressable-status-item ${
            led_status.pre == 1 ? "yellow" : "gray"
          }`}
        >
          <div className="add_icon_background">
            <FaBell className="addressable-icon" />
          </div>
          <span>PRE ALARM</span>
        </div>

        {/* <div className="addressable-status-item gray">
          <FaInfinity className="addressable-icon" /> <span>CONNECTED</span>
        </div> */}
      </div>

      {/* ---------------- Tabs & Events Section ---------------- */}
      {selectedPanel && (
        <div className="addressable-container">
          <div className="addressable-status-container">
            {/* ---------- Tabs ---------- */}
            <div className="addressable-tabs">
              <button
                className={`addressable-tab ${
                  activeTab === "fire" ? "active fire" : ""
                }`}
                onClick={() => setActiveTab("fire")}
              >
                FIRE ({fireEvents.length})
              </button>

              <button
                className={`addressable-tab ${
                  activeTab === "fault" ? "active fault" : ""
                }`}
                onClick={() => setActiveTab("fault")}
              >
                FAULT ({faultEvents.length})
              </button>

              <button
                className={`addressable-tab ${
                  activeTab === "activated" ? "active activated" : ""
                }`}
                onClick={() => setActiveTab("activated")}
              >
                ACTIVATED ({activatedEvents.length})
              </button>

              <button
                className={`addressable-tab ${
                  activeTab === "sysfault" ? "active sysfault" : ""
                }`}
                onClick={() => setActiveTab("sysfault")}
              >
                SYS FAULT ({sysFaultEvents.length})
              </button>
            </div>

            {/* ---------- Content ---------- */}
            <div className={`addressable-content-box ${activeTab}`}>
              <div className="content-scroll">
                {/* 🔥 FIRE */}
                {activeTab === "fire" &&
                  (fireEvents.length > 0 ? (
                    fireEvents.map((event, index) => (
                      <div key={index} className="event-card fire">
                        <div className="event-icon">🔥</div>
                        <div className="event-content">
                          <div className="event-header">
                            <span className="event-title">
                              {`${event.eventDescription}(${
                                event.deviceTypeText || ""
                              })`}
                            </span>
                            <span className="event-time">
                              {event.formattedDateTime}
                            </span>
                          </div>
                          <div className="event-device">{event.deviceText}</div>
                          <div className="event-meta">
                            <span>Loop: {event.loopNo || "-"}</span>
                            <span>Device: {event.deviceNo || "-"}</span>
                            <span>PanelNo:: {event.panelNo || "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-event">No Fire Events</div>
                  ))}

                {/* ⚠️ FAULT */}
                {activeTab === "fault" &&
                  (faultEvents.length > 0 ? (
                    faultEvents.map((event, index) => (
                      <div key={index} className="event-card fault">
                        <div className="event-icon">⚠️</div>
                        <div className="event-content">
                          <div className="event-header">
                            <span className="event-title">
                               {`${event.faultDescription}(${
                                event.deviceTypeText || ""
                              })`}
                            </span>
                            <span className="event-time">
                              {event.formattedDateTime}
                            </span>
                          </div>
                          <div className="event-device">{event.deviceText}</div>
                          <div className="event-meta">
                            <span>Loop: {event.loopNo || "-"}</span>
                            <span>Device: {event.deviceNo || "-"}</span>
                            <span>PanelNo: {event.panelNo || "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-event">No Fault Events</div>
                  ))}

                {/* 🚨 ACTIVATED */}
                {activeTab === "activated" &&
                  (activatedEvents.length > 0 ? (
                    activatedEvents.map((event, index) => (
                      <div key={index} className="event-card activated">
                        <div className="event-icon">🚨</div>
                        <div className="event-content">
                          <div className="event-header">
                            <span className="event-title">
                               {`${event.eventDescription}(${
                                event.deviceTypeText || ""
                              })`}
                            </span>
                            <span className="event-time">
                              {event.formattedDateTime}
                            </span>
                          </div>
                          <div className="event-device">{event.deviceText}</div>
                          <div className="event-meta">
                            <span>Loop: {event.loopNo || "-"}</span>
                            <span>Device: {event.deviceNo || "-"}</span>
                             <span>PanelNo: {event.panelNo || "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-event">No Activated Events</div>
                  ))}

                {/* 🧰 SYS FAULT */}
                {activeTab === "sysfault" &&
                  (sysFaultEvents.length > 0 ? (
                    sysFaultEvents.map((event, index) => (
                      <div key={index} className="event-card sysfault">
                        <div className="event-icon">🧰</div>
                        <div className="event-content">
                          <div className="event-header">
                                    <span className="event-time">
                              {event.formattedDateTime}
                            </span>
                            <span className="event-title">
                              {event.deviceTypeText}
                            </span>
                           
                          </div>
                          <div className="event-device">
                            {event.faultDescription
                             }
                          </div>
                              <div className="event-meta">
                            <span>Loop: {event.loopNo}</span>
                             <span>PanelNo: {event.panelNo}</span>
                          
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-event">No System Faults</div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
