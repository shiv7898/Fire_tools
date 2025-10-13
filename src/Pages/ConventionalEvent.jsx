import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoBulb } from "react-icons/io5";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import {
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";
import { LuSiren } from "react-icons/lu";
import { FaF } from "react-icons/fa6";

const ConventionalEvent = ({ panel, onClose }) => {
  const navigate = useNavigate();
  const led = panel?.led_status || "";
  const leds = {
    mains: led[0] === "1",
    battery: led[1] === "1",
    fire: led[2] === "1",
    fault: led[3] === "1",
    silAlarm: led[4] === "1",
    preAlarm: led[5] === "1",
  };
  console.log("leds", leds);

  return (
    <div className="tower-popup-overlay">
      <div className="towerheading">
        <button className="close-btn" onClick={onClose}>
          {/* ⬅ */}
          <IoArrowBackSharp size={25} color="black" />
        </button>
        <p>{`${panel.name}`} (Conventional)</p>
      </div>
      <div className="aboutpanel">
        <div className="panel-information">
          <div className="led-info">
            <div className="panel-status-grid">
              <div className={`status-item ${leds.mains ? "active" : ""}`}>
                <span className="status-icon mains">
                  <IoBulb />
                </span>
                <span className="status-label">MAINS</span>
              </div>
              <div className={`status-item ${leds.battery ? "active" : ""}`}>
                <span className="status-icon battery">
                  <IoMdBatteryCharging />
                </span>
                <span className="status-label">BATTERY MODE</span>
              </div>
              <div className={`status-item ${leds.fire ? "active" : ""}`}>
                <span className="status-icon fire">
                  <FaFire />
                </span>
                <span className="status-label">FIRE</span>
              </div>
              <div className={`status-item ${leds.fault ? "active" : ""}`}>
                <span className="status-icon fault">
                  <FaCogs />
                </span>
                <span className="status-label">FAULT</span>
              </div>
              <div className={`status-item ${leds.silAlarm ? "active" : ""}`}>
                <span className="status-icon sil-alarm">
                  <FaVolumeUp />
                </span>
                <span className="status-label">SIL ALARM</span>
              </div>
              <div className={`status-item ${leds.preAlarm ? "active" : ""}`}>
                <span className="status-icon pre-alarm">
                  <FaBell />
                </span>
                <span className="status-label">PRE ALARM</span>
              </div>
            </div>
          </div>
          <div className="panel-card-container">
            <div className="fire-card">
              <div className="fire-heading">
                <p className="chead">FIRE</p>
                <p className="faultcount">({panel?.fires?.length || 0})</p>
              </div>
              <div className="fire-data">
                <ul>
                  {panel?.fires?.length > 0 ? (
                    panel.fires.map((item, i) => (
                      <li key={i}>{JSON.stringify(item)}</li>
                    ))
                  ) : (
                    <li>No Fire Events</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="fault-card">
              <div className="fault-heading">
                <p className="chead">FAULT</p>
                <p className="faultcount">{panel?.sysfaults?.length > 0
                    ? `(${panel.sysfaults.length})`
                    : ""}</p>
              </div>

              <div className="fault-data">
                <ul>
                  {panel?.faults?.length > 0 ? (
                    panel.faults.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>No Faults</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="activated-card">
              <div className="activated-heading">
                <p className="chead">ACTIVATED</p>
                <p className="faultcount">{panel?.activated?.length > 0
                    ? `(${panel.sysfaults.length})`
                    : ""}</p>
              </div>
              <div className="activated-data">
                <ul>
                  {panel?.activated?.length > 0 ? (
                    panel.activated.map((item, i) => (
                      <li key={i}>{JSON.stringify(item)}</li>
                    ))
                  ) : (
                    <div className="nofault"><li>No Faults</li></div>
                  )}
                </ul>
              </div>
            </div>
            <div className="sysfault-card">
              <div className="sysfault-heading">
                <p className="chead">SYS FAULT</p>
                <p className="faultcount">{panel?.sysfaults?.length > 0
                    ? `(${panel.sysfaults.length})`
                    : ""}</p>
              </div>
              <div className="sysfault-data">
                <ul>
                  {panel?.faults?.length > 0 ? (
                    panel.faults.map((item, i) => (
                      <li key={i}>{JSON.stringify(item)}</li>
                    ))
                  ) : (
                    <li>No Faults</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="map-containers">
          <div className="map-card">
            <div className="map-heading">
              <p>Panel Location</p>
            </div>
            <MapContainer
              center={[28.6139, 77.209]}
              zoom={8}
              scrollWheelZoom={false}
              style={{ height: "89%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* <Marker position={[51.505, -0.09]}>
               <Popup>
                 A pretty CSS3 popup. <br /> Easily customizable.
               </Popup>
             </Marker> */}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConventionalEvent;
