import React, { useState, useRef, useEffect } from "react";
import "./CssComponent/dashboard.css";
import { GrCalculator } from "react-icons/gr";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { PiProhibitFill } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";
import { IoBulb } from "react-icons/io5";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  FaPlug,
  FaBatteryHalf,
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";
import TowerPopup from "../Pages/TowerPopup";
import Panels from "../Pages/Allpanels/Panels";
import axios from "axios";
import ActivePanel from "../Pages/ActivePanel/ActivePanel";
import InactivePanel from "../Pages/InactivePanel/InactivPanel";
import PanelLocations from "../Pages/PanelLocations/PanelLocations";

export default function Dashboard({ userData }) {
  console.log("dash...", userData);
  const [isOpen, setIsOpen] = useState(false);
  const [locationSidebarOpen, setLocationSidebarOpen] = useState(false);

  const [panels, setPanels] = useState([]);

  const sidebarRef = useRef(null);

  const [active, setActive] = useState("sysfault");
  const [clipPath, setClipPath] = useState("");
  const containerRef = useRef(null);
  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [popupValue, setPopupValue] = useState(mainValue);
  const [confirmation, setConfirmation] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTowerPopup, setShowTowerPopup] = useState(false);
  const [selectedTower, setSelectedTower] = useState(""); // store clicked tower
  const [activeTab, setActiveTab] = useState("fire");
  const [activeButton, setActiveButton] = useState(true);
  const [allPanel, setAllPanel] = useState(false);
  const [activePanel, setActivePanel] = useState(false);
  const [inactivePanel, setInctivePanel] = useState(false);
  const [location, setLocation] = useState(false);

  const [tower, setTowers] = useState([
    "r1/tower/1111",
    "r1/tower/1112",
    "r1/tower/1113",
    "r1/tower/1114",
    "r1/tower/1115",
    "r1/tower/1116",
    "r1/tower/1117",
    "r1/tower/1118",
    "r1/tower/1119",
    "r1/tower/1120",
    "r1/tower/1121",
    "r1/tower/1122",
    "r1/tower/1123",
    "r1/tower/1124",
    "r1/tower/1125",
  ]);

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
    setPopupValue(mainValue);
    setShowPopup(true);
  };
  const handleTowerPopup = (userData) => {
    setSelectedTower(userData);
    setShowTowerPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleSave = () => {
    if (confirmation === "Yes") {
      setMainValue(popupValue);
    }
    console.log("Updated Value:", popupValue);
    console.log("Confirmation:", confirmation);
    handleClosePopup();
  };

  const handleClick = (btnId, e) => {
    setActive(btnId);

    const btn = e.target.getBoundingClientRect();
    const parent = containerRef.current.getBoundingClientRect();

    // const startX = btn.left - parent.left;
    // const endX = startX + btn.width;

    // build path (rounded tab-like curve)
    // const path = `M ${startX} 0
    //             Q ${startX + 10} 25 ${startX + 40} 25
    //             H ${endX - 40}
    //             Q ${endX - 10} 25 ${endX} 0
    //             V 40 H ${startX} Z`;

    // setClipPath(path);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Dashboard User Data:", parsedUser.panels);
      // Example: If API sends panels
      if (parsedUser.panels) {
        const uniqueTowers = [
          ...new Set(Object.keys(parsedUser.panels).map((key) => key)),
        ];
        console.log("uuuu", uniqueTowers);
        setTowers(uniqueTowers);
      }
    }
  }, []);

  const buttons = [
    { id: "fire", label: "FIRE", count: 3, color: "#e74c3c" }, // red
    { id: "fault", label: "FAULT", count: 3, color: "#f1c40f" }, // yellow
    { id: "activated", label: "ACTIVATED", count: 3, color: "#27ae60" }, // green
    { id: "sysfault", label: "SYS FAULT", count: 3, color: "#8e44ad" }, // purple
  ];
  // const toggle = (key) => {
  //   setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  // };
  const [selectedPanel, setSelectedPanel] = useState("Panel-1");
  console.log(selectedPanel);

  const activePanels = [
    {
      id: 1,
      name: "r1/tower/1111",
      type: "addressable",
      status1: "01",
      status2: "05",
      status3: "00",
    },
    {
      id: 2,
      name: "r1/tower/11112",
      type: "conventional",
      status1: "01",
      status2: "00",
      status3: "00",
    },
    {
      id: 3,
      name: "r1/tower/1113",
      type: "regal",
      status1: "00",
      status2: "04",
      status3: " 00",
    },
    {
      id: 4,
      name: "r1/tower/1114",
      type: "eco",
      status1: "00",
      status2: "00",
      status3: "00",
    },
    {
      id: 5,
      name: "r1/tower/1115",
      type: "addressable",
      status1: "01",
      status2: "05",
      status3: "11",
    },
    {
      id: 6,
      name: "r1/tower/1116",
      type: "conventional",
      status1: "01",
      status2: "04",
      status3: "04",
    },
    {
      id: 7,
      name: "r1/tower/1117",
      type: "regal",
      status1: "00",
      status2: "00",
      status3: " 00",
    },
    {
      id: 8,
      name: "r1/tower/1118",
      type: "eco",
      status1: "01",
      status2: "04",
      status3: "04",
    },
    {
      id: 9,
      name: "r1/tower/1119",
      type: "addressable",
      status1: "01",
      status2: "05",
      status3: "11",
    },
    {
      id: 10,
      name: "r1/tower/1120",
      type: "conventional",
      status1: "01",
      status2: "04",
      status3: "04",
    },
    {
      id: 11,
      name: "r1/tower/1121",
      type: "regal",
      status1: "01",
      status2: "04",
      status3: " 04",
    },
    {
      id: 12,
      name: "r1/tower/1122",
      type: "eco",
      status1: "01",
      status2: "04",
      status3: "04",
    },
    {
      id: 13,
      name: "r1/tower/1123",
      type: "addressable",
      status1: "01",
      status2: "05",
      status3: "11",
    },
    {
      id: 14,
      name: "r1/tower/1124",
      type: "conventional",
      status1: "01",
      status2: "04",
      status3: "04",
    },
    {
      id: 15,
      name: "r1/tower/1125",
      type: "regal",
      status1: "01",
      status2: "04",
      status3: " 04",
    },
  ];

  const inactivePanels = [
    {
      id: 16,
      name: "r1/tower/1111",
      type: "Addressable",
      time: "5:02",
      date: "03/09/2025",
    },
    {
      id: 17,
      name: "Panel-10",
      type: "conventional",
      time: "5:02",
      date: "03/09/2025",
    },
    {
      id: 18,
      name: "Panel-11",
      type: "regal",
      time: "5:02",
      date: "03/09/2025",
    },
    { id: 19, name: "Panel-12", type: "eco", time: "5:02", date: "03/09/2025" },
  ];
  // API CALLING

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
        setLocationSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  function handleAllPanelClick() {
    setActiveButton(false);
    setAllPanel(true);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(false);
    console.log("Clicked panel:");
    // You can add more actions here, like navigating to a detail view
  }
  function handleActivePanelClick() {
    setActiveButton(false);
    setAllPanel(false);
    setActivePanel(true);
    setInctivePanel(false);
    setLocation(false);
    
    
  }
  function handleInactivePanelClick() {
    setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(true);
    setLocation(false);
    
  
  }
  function handleLocationClick() {
    setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(true);
   
  
  }
    function handleDashboardClick() {
    setActiveButton(true);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(false);
   
    
  }
  return (
    <div className="main-container">
      <div className="outer-toggle-container">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`sidebar-container ${isOpen ? "open" : ""}`}
        >
          <button
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen, setLocationSidebarOpen(false))}
          >
            ☰
          </button>
          {isOpen && (
            <div className="sidebar-menu">
              <Link
                className="log"
                to="/dashboard"
                onClick={handleDashboardClick}
              >
                Home
              </Link>
              <Link
                className="log"
                to=""
                onClick={() => setLocationSidebarOpen((prev) => !prev)}
              >
                Panels
              </Link>
              <Link className="log" to="/">
                Logout
              </Link>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className={`sub-maincontainer1 ${isOpen ? "shrink" : ""}`}>
          <div className="tower-container" style={{ position: "relative" }}>
            {/* Location Sidebar */}
            <div
              className={`location-sidebar${
                locationSidebarOpen ? " open" : ""
              }`}
            >
              <div className="location-sidebar-header">Panels</div>
              <ul className="location-list">
                {tower.map((v, i) => (
                  <li
                    key={i}
                    className="location-list-item"
                    onClick={() => handleTowerPopup(v)} // pass clicked tower
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="tower-heading">
              {showTowerPopup === true && (
                <TowerPopup towerName={selectedTower} />
              )}
            </div>
            <div className="card-container">
              <div className="card1" onClick={handleAllPanelClick}>
                <div className="card1-text">
                  <span>Panel</span>
                  <span>18</span>
                </div>
                <div className="card1-icon">
                  <GrCalculator />
                </div>
              </div>
              <div className="card2" onClick={handleActivePanelClick}>
                <div className="card2-text">
                  <span className="panel-name">Active Panel</span>
                  <span>15</span>
                </div>
                <div className="card2-icon">
                  <AiOutlineThunderbolt />
                </div>
              </div>
              <div className="card3" onClick={handleInactivePanelClick}>
                <div className="card3-text">
                  <span className="panel-name">Inactive Panel</span>
                  <span>03</span>
                </div>
                <div className="card3-icon">
                  <PiProhibitFill />
                </div>
              </div>
              <div className="card4" onClick={handleLocationClick}>
                <div className="card4-text">
                  <span className="panel-name">Location</span>
                </div>
                <div className="card4-icon">
                  <FaLocationDot />
                </div>
              </div>
            </div>

            <div className="table-main-container">
              {/* Active Panels */}
              <div className="table-card">
                {/* <div className="acive-header">
                  <>Active Panels</>
                </div> */}
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Fire</th>
                        <th>Fault</th>
                        <th>Sys Fault</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePanels.map((panel) => (
                        <tr
                          onClick={() => setSelectedPanel(panel.name)}
                          key={panel.id + panel.name}
                          style={
                            selectedPanel === panel.name
                              ? {
                                  backgroundColor: "#d7e9ffff",
                                  cursor: "pointer",
                                }
                              : {}
                          }
                        >
                          <td>
                            <span className="badge panel">{panel.name}</span>
                          </td>
                          <td>
                            <span className="badge type">{panel.type}</span>
                          </td>
                          <td>
                            <span className="badge fire">{panel.status1}</span>
                          </td>
                          <td>
                            <span className="badge fault">{panel.status2}</span>
                          </td>
                          <td>
                            <span className="badge sysfault">
                              {panel.status3}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {activeButton === true && (
            <div className="event-container">
              <div className="subtitle">
                {/* <div className="address"><span>Addressable Panel</span></div> */}
                <div className="location">
                  <input
                    type="text"
                    value={"Addressable Panel"}
                    id="location-input"
                    readOnly
                  />
                </div>
                <div className="location update-popup">
                  <input
                    type="text"
                    value={mainValue}
                    className="location-input-1"
                    readOnly
                    onClick={handleOpenPopup}
                    title="Update panel name"
                  />
                </div>
              </div>
              <div>
                {/* Main input (initial visible) */}

                {/* Popup */}
                {showPopup && (
                  <div className="popup-overlay">
                    <div className="popup-box">
                      <h3>Update</h3>

                      {/* Input inside popup */}
                      <input
                        type="text"
                        id="popup-input"
                        value={popupValue}
                        onChange={(e) => setPopupValue(e.target.value)}
                      />

                      {/* Buttons */}
                      <div className="popup-actions">
                        <button
                          onClick={handleClosePopup}
                          className="btn cancel"
                        >
                          Cancel
                        </button>
                        <button onClick={handleSave} className="btn confirm">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="status-grid">
                <div className="status-item green">
                  <IoBulb className="icon" /> <span>MAINS</span>
                </div>
                <div className="status-item red">
                  <FaFire className="icon" /> <span>FIRE</span>
                </div>
                <div className="status-item gray">
                  <IoMdBatteryCharging className="icon" />{" "}
                  <span>BATTERY MODE</span>
                </div>
                <div className="status-item gray">
                  <FaExclamationCircle className="icon" /> <span>FAULT</span>
                </div>
                <div className="status-item gray">
                  <FaVolumeUp className="icon" /> <span>SIL ALARM</span>
                </div>
                <div className="status-item gray">
                  <FaCogs className="icon" /> <span>SYS FAULT</span>
                </div>
                <div className="status-item gray">
                  <FaBell className="icon" /> <span>PRE ALARM</span>
                </div>
                <div className="status-item gray">
                  <FaInfinity className="icon" /> <span>CONNECTED</span>
                </div>
              </div>

              <div className="container">
                <div className="status-container">
                  {/* Tabs */}
                  <div className="tabs">
                    <button
                      className={`tab ${
                        activeTab === "fire" ? "active fire" : ""
                      }`}
                      onClick={() => setActiveTab("fire")}
                    >
                      FIRE (4)
                    </button>
                    <button
                      className={`tab ${
                        activeTab === "fault" ? "active fault" : ""
                      }`}
                      onClick={() => setActiveTab("fault")}
                    >
                      FAULT (5)
                    </button>
                    <button
                      className={`tab ${
                        activeTab === "activated" ? "active activated" : ""
                      }`}
                      onClick={() => setActiveTab("activated")}
                    >
                      ACTIVATED (2)
                    </button>
                    <button
                      className={`tab ${
                        activeTab === "sysfault" ? "active sysfault" : ""
                      }`}
                      onClick={() => setActiveTab("sysfault")}
                    >
                      SYS FAULT (2)
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className={`content-box ${activeTab}`}>
                    {data.map((item, index) => (
                      <div key={index} className={`inner-box ${activeTab}`}>
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
          {allPanel === true && (
            <div className="event-container1">
              <Panels />
            </div>
          )}
          
          {activePanel === true && (
            <div className="event-container1">
              <ActivePanel />
            </div>
          )}
          
          {inactivePanel === true && (
            <div className="event-container1">
              <InactivePanel />
            </div>
          )}
           {location === true && (
            <div className="event-container1">
              <PanelLocations />
            </div>
          )}
          
        
        </div>
      </div>
    </div>
  );
}
