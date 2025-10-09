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
import AddressablePopup from "./PanelTypePopups/AddressablePopup";
import ConventionalPopup from "./PanelTypePopups/ConventionalPopup";
import RegalPopup from "./PanelTypePopups/RegalPopup";
import EchoPopup from "./PanelTypePopups/EchoPopup";

export default function Dashboard({ userData }) {
  console.log("dash...", userData);
  const [isOpen, setIsOpen] = useState(false);
  const [locationSidebarOpen, setLocationSidebarOpen] = useState(false);

  const [panels, setPanels] = useState();

  const sidebarRef = useRef(null);

  const [mainValue, setMainValue] = useState("r1/tower/1111");
  const [popupValue, setPopupValue] = useState(mainValue);
  const [confirmation, setConfirmation] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTowerPopup, setShowTowerPopup] = useState(false);
  const [selectedTower, setSelectedTower] = useState(""); // store clicked tower
  // const [activeTab, setActiveTab] = useState("fire");
  const [activeButton, setActiveButton] = useState(true);
  const [allPanel, setAllPanel] = useState(false);
  const [activePanel, setActivePanel] = useState(false);
  const [inactivePanel, setInctivePanel] = useState(false);
  const [location, setLocation] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const [events, setEvents] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState();
  const [popupPanel, setPopupPanel] = useState(null);
  const [popupType, setPopupType] = useState("");

  console.log("events...", events);

  const [tower, setTowers] = useState([]);

  // const data = [
  //   "Fire DEV :01 LOOP:01, []",
  //   "Fire D :01 L:01,[]",
  //   "P.NO\\LN-0 Main Fan",
  //   "P.NO\\LN-0 Main Fan",
  //   "P.NO\\LN-0 Main Fan",
  //   "P.NO\\LN-0 Main Fan",
  //   "P.NO\\LN-0 Main Fan",
  //   "P.NO\\LN-0 Main Fan",
  //   "P.NO\\LN-0 Main Fan",
  //   "P.NO\\LN-0 Main Fan",
  // ];
  // 🔹 Fetch data from API when token exists
  useEffect(() => {
    const fetchPanels = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("No access token found in localStorage");
        return;
      }

      try {
        const response = await axios.get(
          "http://192.168.14.4:8000/v2/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Panels API Response:", response.data);

        if (response.data) {
          setDataResponse(response.data);
          setPanels(response.data.panels);

          // ✅ Call events API after fetching user id
          if (response.data.id) {
            fetchEvents(response.data?.id);
          }
        }
      } catch (error) {
        console.error("Error fetching panels:", error);
      }
    };

    const fetchEvents = async (userId, token) => {
      console.log("Fetching events for user ID:", userId);
      try {
        const response = await axios.get(
          `http://192.168.14.4:8000/v2/events/temps?id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Events API Response:", response.data);
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchPanels();
  }, []);
  // Example: after fetching panels & events
  const combinedPanels = React.useMemo(() => {
    if (!dataResponse?.panels || events.length === 0) return [];

    return dataResponse.panels.map((panel) => {
      const matchedEventPanel = events.panels?.find((ev) => ev.id === panel.id);

      let panelType = "";
      if (panel.panel_type === 0) panelType = "Conventional";
      else if (panel.panel_type === 1) panelType = "Addressable";
      else if (panel.panel_type === 2) panelType = "Echo";
      else panelType = "Regal";

      return {
        id: panel.id || panel.serial_number || panel.panel_topic,
        name: panel.panel_topic || "N/A",
        topic: panel.panel_topic || "",
        type: panelType,
        fire: matchedEventPanel?.fires?.length || 0,
        fault: matchedEventPanel?.faults?.length || 0,
        sysfault: matchedEventPanel?.sysfaults?.length || 0,
        led_status: matchedEventPanel?.led_status || null,
      };
    });
  }, [dataResponse, events]);
  useEffect(() => {
    if (combinedPanels.length > 0 && !selectedPanel) {
      setSelectedPanel(combinedPanels[0]);
    }
  }, [combinedPanels, selectedPanel]);

  console.log("combinedPanels", combinedPanels);
  console.log("dataResponse", dataResponse);

  console.log("panel....", panels);

  // const handleOpenPopup = () => {
  //   setPopupValue(mainValue);
  //   setShowPopup(true);
  // };
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

  const buttons = [
    { id: "fire", label: "FIRE", count: 3, color: "#e74c3c" }, // red
    { id: "fault", label: "FAULT", count: 3, color: "#f1c40f" }, // yellow
    { id: "activated", label: "ACTIVATED", count: 3, color: "#27ae60" }, // green
    { id: "sysfault", label: "SYS FAULT", count: 3, color: "#8e44ad" }, // purple
  ];

  console.log("selectedPanel", selectedPanel);

  // Select first panel by default when combinedPanels is ready
  //   useEffect(() => {
  //   if (combinedPanels.length > 0 && !selectedPanel) {
  //     setSelectedPanel(combinedPanels[0]);
  //   }
  // }, [combinedPanels, selectedPanel]);

  //   console.log("selectedPanel", selectedPanel);

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
      type: "echo",
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
      type: "echo",
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
    { id: 19, name: "Panel-12", type: "echo", time: "5:02", date: "03/09/2025" },
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
    setPopupType(false)
 
  }
  function handleActivePanelClick() {
    setActiveButton(false);
    setAllPanel(false);
    setActivePanel(true);
    setInctivePanel(false);
    setLocation(false);
    setPopupType(false);
  }
  function handleInactivePanelClick() {
    setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(true);
    setLocation(false);
    setPopupType(false);
  }
  function handleLocationClick() {
    setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(true);
    setPopupType(false);
  }
  function handleDashboardClick() {
    setActiveButton(true);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(false);
    setPopupType(false);
  }
  // Handle click on panel row
  const handlePanelClick = (panel) => {
    if (!panel || !panel.type) return; // 🧱 Prevent crash if panel undefined

    setSelectedPanel(panel);
     setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(false);

    // ✅ Open popup safely
    const type = panel.type.toLowerCase();

    if (type === "addressable") setPopupType("addressable");
    else if (type === "conventional") setPopupType("conventional");
    else if (type === "regal") setPopupType("regal");
    else if (type === "echo") setPopupType("echo");

    setPopupPanel(panel);
  };

  // Close popup
  const handleCloseTypePopup = () => {
    setPopupType("");
    setPopupPanel(null);
  };
  //  Auto-select logic
  useEffect(() => {
    if (combinedPanels && combinedPanels.length > 0) {
      const firePanel = combinedPanels.find((p) => p?.fire > 0);
      const defaultPanel = firePanel || combinedPanels[0];
      if (defaultPanel) {
        setSelectedPanel(defaultPanel);
        handlePanelClick(defaultPanel); // 👈 optional: open popup automatically
      }
    }
  }, [combinedPanels]);

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
                {panels?.map((v, i) => (
                  <li
                    key={i}
                    className="location-list-item"
                    onClick={() => handleTowerPopup(v)} // pass clicked tower
                  >
                    {v.panel_topic}
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
                  <span>{combinedPanels.length}</span>
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
                      {combinedPanels.map((panel) => (
                        <tr
                          key={panel.id}
                          onClick={() => handlePanelClick(panel)}
                          style={
                            selectedPanel?.id === panel.id
                              ? {
                                  backgroundColor: "#d7e9ff",
                                  cursor: "pointer",
                                }
                              : { cursor: "pointer" }
                          }
                        >
                          <td>
                            <span className="badge panel">{panel.name}</span>
                          </td>
                          <td>
                            <span className="badge type">{panel?.type}</span>
                          </td>
                          <td>
                            <span className="badge fire">{panel.fire}</span>
                          </td>
                          <td>
                            <span className="badge fault">{panel.fault}</span>
                          </td>
                          <td>
                            <span className="badge sysfault">
                              {panel.sysfault}
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
          {/* {activeButton === true && (
            <div className="event-container">
              <div className="subtitle">
                <div className="address"><span>Addressable Panel</span></div>
                <div className="location">
                  <input
                    type="text"
                    value={selectedPanel?.type || ""}
                    id="location-input"
                    readOnly
                  />
                </div>
                <div className="location update-popup">
                  <input
                    type="text"
                    value={selectedPanel?.name || ""}
                    className="location-input-1"
                    readOnly
                    onClick={handleOpenPopup}
                    title="Update panel name"
                  />
                </div>
              </div>
              <div>
             

             
                {showPopup && (
                  <div className="popup-overlay">
                    <div className="popup-box">
                      <h3>Update</h3>

                     
                      <input
                        type="text"
                        id="popup-input"
                        value={popupValue}
                        onChange={(e) => setPopupValue(e.target.value)}
                      />

                    
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

              {selectedPanel && (
                <div className="container">
                  <div className="status-container">
                  
                    <div className="tabs">
                      <button
                        className={`tab ${
                          activeTab === "fire" ? "active fire" : ""
                        }`}
                        onClick={() => setActiveTab("fire")}
                      >
                        FIRE({selectedPanel.fire ?? 0})
                      </button>
                      <button
                        className={`tab ${
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
                        className={`tab ${
                          activeTab === "sysfault" ? "active sysfault" : ""
                        }`}
                        onClick={() => setActiveTab("sysfault")}
                      >
                        SYS FAULT({selectedPanel.sysfault ?? 0})
                      </button>
                    </div>
             
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
              )}
            </div>
          )} */}
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
          {popupType === "addressable" && (
            <AddressablePopup
              panel={popupPanel}
              onClose={handleCloseTypePopup}
              selectedPanel={selectedPanel}
            />
          )}
          {popupType === "conventional" && (
            <ConventionalPopup
              panel={popupPanel}
              onClose={handleCloseTypePopup}
              selectedPanel={selectedPanel}
            />
          )}
          {popupType === "regal" && (
            <RegalPopup panel={popupPanel}
              onClose={handleCloseTypePopup}
              selectedPanel={selectedPanel} />
          )}
          {popupType === "echo" && (
            <EchoPopup  panel={popupPanel}
              onClose={handleCloseTypePopup}
              selectedPanel={selectedPanel}/>
          )}
        </div>
      </div>
    </div>
  );
}
