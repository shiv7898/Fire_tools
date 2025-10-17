import React, { useState } from "react";
import { IoBulb } from "react-icons/io5";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { GiRingingBell } from "react-icons/gi";
import { GiRingingAlarm } from "react-icons/gi";
import { TbBulbFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import "../CssComponent/PanelTypePopup/ConventionalPopup.css"
import {
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";
export default function AddressablePopup({ panel, onClose, selectedPanel }) {
   const [activeTab, setActiveTab] = useState("fire");
   const [popupValue, setPopupValue] = useState("");
   const [showPopup, setShowPopup] = useState(false);
    const [mainValue, setMainValue] = useState("r1/tower/1111");
     const [confirmation, setConfirmation] = useState("");
 
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
     }}
 
   return (
     // <div className="container">
     //   <div className="status-container">
     //     <div className="tabs">
     //       <button
     //         className={`tab ${activeTab === "fire" ? "active fire" : ""}`}
     //         onClick={() => setActiveTab("fire")}
     //       >
     //         FIRE({panel?.fire ?? 0})
     //       </button>
     //       <button
     //         className={`tab ${activeTab === "fault" ? "active fault" : ""}`}
     //         onClick={() => setActiveTab("fault")}
     //       >
     //         FAULT({panel?.fault ?? 0})
     //       </button>
     //       <button
     //         className={`tab ${
     //           activeTab === "activated" ? "active activated" : ""
     //         }`}
     //         onClick={() => setActiveTab("activated")}
     //       >
     //         ACTIVATED({panel?.activated ?? 0})
     //       </button>
     //       <button
     //         className={`tab ${
     //           activeTab === "sysfault" ? "active sysfault" : ""
     //         }`}
     //         onClick={() => setActiveTab("sysfault")}
     //       >
     //         SYS FAULT({panel?.sysfault ?? 0})
     //       </button>
     //     </div>
 
     //     <div className={`content-box ${activeTab}`}>
     //       {data.map((item, index) => (
     //         <div key={index} className={`inner-box ${activeTab}`}>
     //           {item.split(",").map((line, i) => (
     //             <div key={i}>{line}</div>
     //           ))}
     //         </div>
     //       ))}
     //     </div>
 
     //     <div style={{ textAlign: "center", marginTop: "10px" }}>
     //       <button onClick={onClose} className="btn cancel">
     //         Close
     //       </button>
     //     </div>
     //   </div>
     // </div>
 
     <div className="conventional-event-container">
       <div className="conventional-subtitle">
         {/* <div className="address">
           <span>Addressable Panel</span>
         </div> */}
         <div className="conventional-location">
          {selectedPanel?.type || ""}
         </div>
         <div className="conventional-location conventional-update-popup">
           <input
             type="text"
             value={selectedPanel?.name || ""}
             className="conventional-location-input-1"
             readOnly
             onClick={handleOpenPopup}
             title="Update panel name"
           />
         </div>
       </div>
       <div>
         {showPopup && (
           <div className="conventional-popup-overlay">
             <div className="conventional-popup-box">
               <h3>Update</h3>
 
               <input
                 type="text"
                 id="conventional-popup-input"
                 value={popupValue}
                 onChange={(e) => setPopupValue(e.target.value)}
               />
 
               <div className="conventional-popup-actions">
                 <button onClick={handleClosePopup} className="conventional-btn conventional-cancel">
                   Cancel
                 </button>
                 <button onClick={handleSave} className="conventional-btn conventional-confirm">
                   Save
                 </button>
               </div>
             </div>
           </div>
         )}
       </div>
 
       <div className="conventional-status-grid">
         <div className="conventional-status-item green">
           <IoBulb className="conventional-icon" /> <span>MAINS</span>
         </div>
         <div className="conventional-status-item red">
           <FaFire className="conventional-icon" /> <span>FIRE</span>
         </div>
         <div className="conventional-status-item gray">
           <IoMdBatteryCharging className="conventional-icon" /> <span>BATTERY MODE</span>
         </div>
         <div className="conventional-status-item gray">
           <FaExclamationCircle className="conventional-icon" /> <span>FAULT</span>
         </div>
         <div className="conventional-status-item gray">
           <FaVolumeUp className="conventional-icon" /> <span>HOOTER</span>
         </div>
         </div>
         <div className="conventional-button-container">
          <button className="conventional-btn-main">
            <RiResetLeftFill className="conventional-btn-icon" /><span className="conventional-btn-label">RESET</span>
          </button>
          <button className="conventional-btn-main">
            <GiRingingBell className="conventional-btn-icon" /><span className="conventional-btn-label">SIL BUZZ </span>
          </button>
          <button className="conventional-btn-main">
            <GiRingingAlarm className="conventional-btn-icon" /><span className="conventional-btn-label">SIL ALARM</span>
          </button>
          <button className="conventional-btn-main">
            <TbBulbFilled className="conventional-btn-icon" /><span className="conventional-btn-label">L TEST</span>
          </button>
          
         </div>
         {/* <div className="conventional-status-item gray">
           <FaCogs className="conventional-icon" /> <span>SYS FAULT</span>
         </div>
         <div className="conventional-status-item gray">
           <FaBell className="conventional-icon" /> <span>PRE ALARM</span>
         </div>
         <div className="conventional-status-item gray">
           <FaInfinity className="conventional-icon" /> <span>CONNECTED</span>
         </div> */}
       
 
       {/* {selectedPanel && (
         <div className="conventional-container">
           <div className="conventional-status-container">
             <div className="conventional-tabs">
               <button
                 className={`conventional-tab ${activeTab === "fire" ? "active fire" : ""}`}
                 onClick={() => setActiveTab("fire")}
               >
                 FIRE({selectedPanel.fire ?? 0})
               </button>
               <button
                 className={`conventional-tab ${activeTab === "fault" ? "active fault" : ""}`}
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
                 className={`conventional-tab ${
                   activeTab === "sysfault" ? "active sysfault" : ""
                 }`}
                 onClick={() => setActiveTab("sysfault")}
               >
                 SYS FAULT({selectedPanel.sysfault ?? 0})
               </button>
             </div>
 
             <div className={`conventional-content-box ${activeTab}`}>
               {data.map((item, index) => (
                 <div key={index} className={`conventional-inner-box ${activeTab}`}>
                   {item.split(",").map((line, i) => (
                     <div key={i}>{line}</div>
                   ))}
                 </div>
               ))}
             </div>
           </div>
         </div>
       )} */}
     </div>
   );
 }
 