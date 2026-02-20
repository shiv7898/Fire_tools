import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { IoBulb } from "react-icons/io5";
import { ImSwitch } from "react-icons/im";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaBatteryQuarter } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell } from "react-icons/gi";
import { GiRingingAlarm } from "react-icons/gi";
import { FaPersonRunning } from "react-icons/fa6";
import { MdOutlineBatterySaver } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";

import { Link } from "react-router-dom";
import "../CssComponent/PanelTypePopup/EchoPopup.css";
import {

  FaFire,
  FaExclamationCircle,

} from "react-icons/fa";

export default function EchoPopup({
  data: {
    selectedPanel,
    selectPanelLedStatuses,
    processLEDStatus,
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


  const led_status = processLEDStatus(
    selectedPanel,
    selectPanelLedStatuses || ""
  );


  const options = [
    {
      label: "RESET",
      action: 1,
      icon: <RiResetLeftFill className="echo_icon_color" />,
    },
    {
      label: "SILENCE",
      action: 2,
      icon: <GiRingingBell className="echo_icon_color" />,
    },
    {
      label: "EVACUATE",
      action: 4,
      icon: <FaPersonRunning className="echo_icon_color" />,
    },
    {
      label: "L.TEST",
      action: 6,
      icon: <GiRingingAlarm className="echo_icon_color" />,
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
  const data = ["No Event Data"];
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
        <div className="echo-panel-name">
          <span className="">{selectedPanel?.type || ""}</span>
        </div>
        <div
          className="echo-location echo-update-popup"
          onClick={handleOpenPopup}
        >
          <span>{selectedPanel?.name || ""}</span>
          <FaEdit className="input-icon-echo" onClick={handleOpenPopup} />
        </div>
        <div className="echo-iotid">
          <span>IOT ID: {selectedPanel?.topic || "N/A"}</span>
        </div>
        <div className="echo-button-container echo-location" ref={dropdownRef}>
          <div className="echo-dropdown">
            <button
              className="echo-dropdown-toggle"
              onClick={() => setIsOpen(!isOpen)}
            >
              Actions
              {/* <span className="echo-arrow-drop"> */}
              {isOpen ? <RiArrowDropUpLine className="drop" /> : <RiArrowDropDownLine className="drop" />}
              {/* </span> */}
            </button>
            {isOpen && (
              <div className="echo-dropdown-menu">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className="echo-dropdown-item slide-in"
                    style={{ animationDelay: `${index * 70}ms` }}
                    onClick={() => handleActionClick(opt.action)}
                  >
                    <span className="echo-icon">{opt.icon}</span>
                    <span className="echo-label">{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="echo-popup-overlay">
          <div className="echo-popup-box slide-in-right">
            <div className="popup-title-container">
              <div className="popup-title-icon">
                <RxUpdate />
              </div>
              <h3>Update Panel Name</h3>
            </div>

            <input
              type="text"
              id="addressable-popup-input"
              value={selectedPanel?.name || ""}
              onChange={(e) => setPopupValue(e.target.value)}
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

      <div className="echo-status-grid">
        <div className={`echo-status-item ${led_status.MAINSON == 1 ? "green" : "gray"}`}>
          <div className="add_icon_background_echo">
            {" "}
            <ImSwitch className="echo-icon" />
          </div>
          <span>MAINS ON</span>
        </div>
        <div className={`echo-status-item ${led_status.FIRE == 1 ? "red" : "gray"}`}>
          <div className="add_icon_background_echo">
            <FaFire className="echo-icon" />
          </div>
          <span>FIRE</span>
        </div>
        <div className={`echo-status-item ${led_status.BATTMODE == 1 ? "yellow" : "gray"}`}>
          <div className="add_icon_background_echo">
            <MdOutlineBatterySaver className="echo-icon" />
          </div>

          <span>B.MODE</span>
        </div>
        <div className={`echo-status-item ${led_status.FAULT == 1 ? "yellow" : "gray"}`}>
          <div className="add_icon_background_echo">
            <FaExclamationCircle className="echo-icon" />
          </div>

          <span>FAULT</span>
        </div>
        <div className={`echo-status-item ${led_status.EVACUATE == 1 ? "yellow" : "gray"}`}>
          <div className="add_icon_background_echo">
            <FaPersonRunning className="echo-icon" />
          </div>
          <span>EVACUATE</span>
        </div>
        <div className={`echo-status-item ${led_status.SILENCE == 1 ? "yellow" : "gray"}`}>
          <div className="add_icon_background_echo">
            <FaVolumeUp className="echo-icon" />
          </div>
          <span>SILENCE</span>
        </div>
        <div className={`echo-status-item ${led_status.BATTLOW == 1 ? "yellow" : "gray"}`}>
          <div className="add_icon_background_echo">
            {" "}
            <FaBatteryQuarter className="echo-icon" />
          </div>
          <span>B.LOW</span>
        </div>
        <div className={`echo-status-item ${led_status.BATTCHARGE == 1 ? "yellow" : "gray"}`}>
          <div className="add_icon_background_echo">
            {" "}
            <IoMdBatteryCharging className="echo-icon" />
          </div>
          <span>B.CHARGE</span>
        </div>
      </div>

      {selectedPanel && (
        <div className="echo-container">
          <div className="echo-status-container">


            <div className={`echo-content-box ${activeTab}`}>
              {data.map((item, index) => (
                <div key={index} className={`echo-inner-box ${activeTab}`}>
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
