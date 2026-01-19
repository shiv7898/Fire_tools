import React, { useEffect, useState, useRef } from "react";
import { ImSwitch } from "react-icons/im";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell } from "react-icons/gi";
import { GiRingingAlarm } from "react-icons/gi";
import { FaPersonRunning } from "react-icons/fa6";
import { GiFireZone } from "react-icons/gi";
import { FaEdit } from "react-icons/fa";
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

export default function RegalPopup({
  data: {
    selectedPanelEvent,
    processLEDStatus,
    selectPanelLedStatuses,
    panel,
    onClose,
    selectedPanel,
    updateCurrentData,
    sendMqttCommand,
  },
}) {
  const [activeTab, setActiveTab] = useState("fire");
  const [popupValue, setPopupValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [confirmation, setConfirmation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Filter only current panel data based on ID or Topic
  const panelData = Array.isArray(updateCurrentData)
    ? updateCurrentData.find((p) => p.id === selectedPanel?.id)
    : updateCurrentData?.id === selectedPanel?.id
      ? updateCurrentData
      : selectedPanel;

  console.log("Matched regal Panel Data:", panelData);
  const led_status = processLEDStatus(
    selectedPanel,
    selectPanelLedStatuses || ""
  );
  console.log("Regal LED Statuses:", led_status);

  // ✅ Extract live LED & event data safely
  const fireEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 2) || [];
  const faultEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 3) || [];
  const sysFaultEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 4) || [];
  const activatedEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 5) || [];


  const options = [
    {
      label: "RESET",
      icon: <RiResetLeftFill className="action_icon_regal" />,
      command: "5",
    },
    {
      label: "SIL BUZZ",
      icon: <GiRingingBell className="action_icon_regal" />,
      command: "9",
    },
    {
      label: "SIL ALARM",
      icon: <GiRingingAlarm className="action_icon_regal" />,
      command: "13",
    },
    {
      label: "EVACUATE",
      icon: <FaPersonRunning className="action_icon_regal" />,
      command: "11",
    },
  ];

  // Function to handle command sending
  const handleCommand = (command) => {
    if (sendMqttCommand && selectedPanel?.topic) {
      sendMqttCommand(selectedPanel.topic, command);
      console.log(`Sending command: ${command} to ${selectedPanel.topic}`);
    }
    setIsOpen(false);
  };

  // Function to render event data based on hex format

  const handleOpenPopup = () => {
    setPopupValue(selectedPanel?.name || "");
    setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleSave = () => {
    if (confirmation === "Yes") {
      setMainValue(popupValue);
    }
    handleClosePopup();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="regal-event-container">
      <div className="regal-subtitle">
        <div className="regal-panel-name">
          <span className="">{selectedPanel?.type || "Regal Panel"}</span>
        </div>
        <div
          className="regal-location regal-update-popup"
          onClick={handleOpenPopup}
        >
          <span>{selectedPanel?.name || ""}</span>
          <FaEdit className="input-icon-regal" />
        </div>
        <div className="regal-iotid">
          <span>IOT ID: {selectedPanel?.topic || "N/A"}</span>
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
              {/* <span className="regal-arrow-drop"> */}
              {isOpen ? <RiArrowDropUpLine className="drop" /> : <RiArrowDropDownLine className="drop" />}
              {/* </span> */}
            </button>
            {isOpen && (
              <div className="regal-dropdown-menu">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className="regal-dropdown-item  slide-in"
                    onClick={() => handleCommand(opt.command)}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
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
            <div className="regal-popup-box slide-in-right-regal">
              <h3>Update Panel Name</h3>
              <input
                type="text"
                id="regal-popup-input"
                value={popupValue}
                onChange={(e) => setPopupValue(e.target.value)}
              />
              <div className="regal-popup-actions">
                <button
                  onClick={handleClosePopup}
                  className="regal-btn regal-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="regal-btn regal-confirm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LED Status Grid */}
      <div className="regal-status-grid">
        <div
          className={`regal-status-item ${led_status.MAIN === 1 ? "green" : "gray"
            }`}
        >
          <div className="regal_icon_background">
            <ImSwitch className="regal-icon" />
          </div>
          <span>MAINS</span>
        </div>
        <div
          className={`regal-status-item ${led_status.FIRE === 1 ? "red" : "gray"
            }`}
        >
          <div className="regal_icon_background">
            <FaFire className="regal-icon" />
          </div>
          <span>FIRE</span>
        </div>
        <div
          className={`regal-status-item ${led_status.BATTMODE === 1 ? "yellow" : "gray"
            }`}
        >
          <div className="regal_icon_background">
            <IoMdBatteryCharging className="regal-icon" />
          </div>
          <span>BATTERY MODE</span>
        </div>
        <div
          className={`regal-status-item ${led_status.FAULT === 1 ? "yellow" : "gray"
            }`}
        >
          <div className="regal_icon_background">
            <FaExclamationCircle className="regal-icon" />
          </div>
          <span>FAULT</span> <div className="regal_icon_background"></div>
        </div>
        <div
          className={`regal-status-item ${led_status.SILENCE === 1 ? "yellow" : "gray"
            }`}
        >
          {" "}
          <div className="regal_icon_background">
            <FaVolumeUp className="regal-icon" />
          </div>
          <span>SIL ALARM</span>
        </div>
        <div
          className={`regal-status-item ${led_status.SYSFAULT === 1 ? "blue" : "gray"
            }`}
        >
          {" "}
          <div className="regal_icon_background">
            <FaCogs className="regal-icon" />
          </div>
          <span>SYS FAULT</span>
        </div>
        <div
          className={`regal-status-item ${led_status.ZONEISO === 1 ? "yellow" : "gray"
            }`}
        >
          <div className="regal_icon_background">
            <GiFireZone className="regal-icon" />
          </div>
          <span>ZONE ISO</span>
        </div>
        <div
          className={`regal-status-item ${led_status.EVACUATE === 1 ? "yellow" : "gray"
            }`}
        >
          {" "}
          <div className="regal_icon_background">
            {" "}
            <FaPersonRunning className="regal-icon" />
          </div>
          <span>EVACUATE</span>
        </div>
      </div>


      {/* Events Tabs */}
      {selectedPanel && (
        <div className="regal-container">
          <div className="regal-status-container">
            <div className="regal-tabs">
              <button
                className={`regal-tab ${activeTab === "fire" ? "active fire" : ""
                  }`}
                onClick={() => setActiveTab("fire")}
              >
                FIRE ({fireEvents.length})
              </button>
              <button
                className={`regal-tab ${activeTab === "fault" ? "active fault" : ""
                  }`}
                onClick={() => setActiveTab("fault")}
              >
                FAULT ({faultEvents.length})
              </button>
              <button
                className={`regal-tab ${activeTab === "activated" ? "active activated" : ""
                  }`}
                onClick={() => setActiveTab("activated")}
              >
                ACTIVATED ({activatedEvents.length})
              </button>
              <button
                className={`regal-tab ${activeTab === "sysfault" ? "active sysfault" : ""
                  }`}
                onClick={() => setActiveTab("sysfault")}
              >
                SYS FAULT ({sysFaultEvents.length})
              </button>
            </div>

            <div className={`regal-content-box ${activeTab}`}>
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
                              {event.deviceTypeText}
                            </span>
                            <span className="event-time">
                              {event.formattedDateTime}
                            </span>
                          </div>
                          <div className="event-device">{event.deviceText}</div>
                          <div className="event-meta">
                            <span>Loop: {event.loopNo || "-"}</span>
                            <span>Device: {event.deviceNo || "-"}</span>
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
                              {event.deviceTypeText}
                            </span>
                            <span className="event-time">
                              {event.formattedDateTime}
                            </span>
                          </div>
                          <div className="event-device">{event.deviceText}</div>
                          <div className="event-meta">
                            <span>Loop: {event.loopNo || "-"}</span>
                            <span>Device: {event.deviceNo || "-"}</span>
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
                      <div key={index} className="regal-event-card activated">
                        <div className="regal-event-icon">🚨</div>
                        <div className="regal-event-content">
                          <div className="regal-event-header">
                            <span className="regal-event-title">
                              {event.deviceTypeText}
                            </span>
                            <span className="regal-event-time">
                              {event.formattedDateTime}
                            </span>
                          </div>
                          <div className="regal-event-device">
                            {event.deviceText}
                          </div>
                          <div className="regal-event-meta">
                            <span>Loop: {event.loopNo || "-"}</span>
                            <span>Device: {event.deviceNo || "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="regal-no-event">No Activated Events</div>
                  ))}

                {/* 🧰 SYS FAULT */}
                {activeTab === "sysfault" &&
                  (sysFaultEvents.length > 0 ? (
                    sysFaultEvents.map((event, index) => (
                      <div key={index} className="event-card sysfault">
                        <div className="event-icon">🧰</div>
                        <div className="event-content">
                          <div className="event-header">
                            <span className="event-title">
                              {event.deviceTypeText}
                            </span>
                            <span className="event-time">
                              {event.formattedDateTime}
                            </span>
                          </div>
                          <div className="event-device">
                            {event.faultDescription ||
                              event.deviceText ||
                              "System Fault"}
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
