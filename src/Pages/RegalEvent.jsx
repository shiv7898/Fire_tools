import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";
import { useNavigate } from "react-router-dom";

import { IoArrowBackSharp } from "react-icons/io5";

import { IoMdBatteryCharging } from "react-icons/io";

import { TbSettingsExclamation } from "react-icons/tb";
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { GiFireZone } from "react-icons/gi";
import { MdDirectionsRun } from "react-icons/md";
import { ImSwitch } from "react-icons/im";
import { FaFire, FaCogs } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";

const panelIcon = new L.DivIcon({
  html: `
    <div class="pulse-container">
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
      <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
           alt="marker" 
           class="pulse-icon" />
    </div>
  `,
  iconSize: [30, 30],
  className: "icon-pulse",
});

const RegalEvent = ({
  panel,
  onClose,
  updateCurrentData,
  selectedPanelEvent,
  processLEDStatus,
}) => {
  let latitude = null;
  let longitude = null;

  if (
    panel?.location &&
    typeof panel.location === "string" &&
    panel.location.includes(",")
  ) {
    const parts = panel.location.split(",").map((item) => item.trim());

    if (parts.length === 2) {
      latitude = Number(parts[0]);
      longitude = Number(parts[1]);
    }
  }

  const panels =
    latitude !== null && longitude !== null
      ? [{ name: panel.name, position: [latitude, longitude] }]
      : [];

  const led_status = processLEDStatus(panel, panel.led_status || "");
  console.log("LED STATUS IN TOWER POPUP....", led_status);

  const fireEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 2) || [];
  const faultEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 3) || [];
  const sysFaultEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 4) || [];
  const activatedEvents =
    selectedPanelEvent?.filter((ev) => ev.eventType === 5) || [];
  const navigate = useNavigate();

  return (
    <div className="tower-popup-overlay">
      <div className="towerheading">
        <button className="close-btn" onClick={onClose}>
          {/* ⬅ */}
          <IoArrowBackSharp size={25} color="#5e5b5b" />
        </button>
        <p>{`${panel.name}`} (Regal)</p>
      </div>
      <div className="aboutpanel">
        <div className="panel-information">
          <div className="led-info">
            <div className="panel-status-grid-two">
              <div className="status-item">
                <div className={`add-icon-back ${led_status.MAIN == 1 ? "mains-active" : "gray"
                  }`}>
                  {" "}
                  <span
                    className={`status-icon mains ${led_status.MAIN == 1 ? "green" : "gray"
                      }`}
                  >
                    <ImSwitch />
                  </span>
                </div>

                <span className={`status-label ${led_status.MAIN == 1 ? "green" : "gray"}`}>MAINS</span>
              </div>
              <div className="status-item">
                <div className={`add-icon-back ${led_status.FIRE == 1 ? "fire-active" : "gray"
                  }`}>
                  {" "}
                  <span
                    className={`status-icon fire ${led_status.FIRE === 1 ? "red" : "gray"
                      }`}
                  >
                    <FaFire />
                  </span>
                </div>

                <span className={`status-label ${led_status.FIRE == 1 ? "red" : "gray"}`}>FIRE</span>
              </div>
              <div className="status-item">
                <div className={`add-icon-back ${led_status.FAULT == 1 ? "fault-active" : "gray"
                  }`}>
                  <span
                    className={`status-icon fault ${led_status.FAULT === 1 ? "yellow" : "gray"
                      }`}
                  >
                    <FaCogs />
                  </span>
                </div>

                <span className={`status-label ${led_status.FAULT == 1 ? "yellow" : "gray"}`}>FAULT</span>
              </div>
              <div className="status-item">
                <div className={`add-icon-back ${led_status.SYSFAULT == 1 ? "sys-active" : "gray"
                  }`}>
                  {" "}
                  <span
                    className={`status-icon sil-alarm ${led_status.SYSFAULT === 1 ? "blue" : "gray"
                      }`}
                  >
                    <TbSettingsExclamation />
                  </span>
                </div>

                <span className={`status-label ${led_status.SYSFAULT == 1 ? "blue" : "gray"}`}>SYS FAULT</span>
              </div>
              <div className="status-item">
                <div className={`add-icon-back ${led_status.BATTMODE == 1 ? "batt-active" : "gray"
                  }`}>
                  {" "}
                  <span
                    className={`status-icon battery ${led_status.BATTMODE === 1 ? "yellow" : "gray"
                      }`}
                  >
                    <IoMdBatteryCharging />
                  </span>
                </div>

                <span className={`status-label ${led_status.BATTMODE == 1 ? "yellow" : "gray"}`}>BATTERY MODE</span>
              </div>

              <div className="status-item">
                <div className={`add-icon-back ${led_status.ZONEISO == 1 ? "fault-active" : "gray"
                  }`}>
                  {" "}
                  <span
                    className={`status-icon sil-alarm ${led_status.ZONEISO == 1 ? "yellow" : "gray"
                      }`}
                  >
                    <GiFireZone />
                  </span>
                </div>

                <span className={`status-label ${led_status.ZONEISO == 1 ? "yellow" : "gray"}`}>ZONE ISO</span>
              </div>
              <div className="status-item">
                <div className={`add-icon-back ${led_status.SILENCE == 1 ? "fault-active" : "gray"
                  }`}>
                  {" "}
                  <span
                    className={`status-icon sil-alarm ${led_status.SILENCE === 1 ? "yellow" : "gray"
                      }`}
                  >
                    <FaVolumeUp />
                  </span>
                </div>

                <span className={`status-label ${led_status.SILENCE == 1 ? "yellow" : "gray"}`}>SIL ALARM</span>
              </div>
              <div className="status-item">
                <div className={`add-icon-back ${led_status.EVACUATE == 1 ? "fault-active" : "gray"
                  }`}>
                  {" "}
                  <span
                    className={`status-icon sil-alarm ${led_status.EVACUATE === 1 ? "yellow" : "gray"
                      }`}
                  >
                    <MdDirectionsRun />
                  </span>
                </div>

                <span className={`status-label ${led_status.EVACUATE == 1 ? "yellow" : "gray"}`}>EVACUATE</span>
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
                    panel.fires.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <div className="nofault">
                      <li>No Fire Faults</li>
                    </div>
                  )}
                </ul>
              </div>
            </div>
            <div className="fault-card">
              <div className="fault-heading">
                <p className="chead">FAULT</p>
                <p className="faultcount">({panel?.faults?.length || 0})</p>
              </div>

              <div className="fault-data">
                <ul>
                  {panel?.faults?.length > 0 ? (
                    panel.faults.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <div className="nofault">
                      <li>No Faults</li>
                    </div>
                  )}
                </ul>
              </div>
            </div>
            <div className="activated-card">
              <div className="activated-heading">
                <p className="chead">ACTIVATED</p>
                <p className="faultcount">({panel?.activated?.length || 0})</p>
              </div>
              <div className="activated-data">
                <ul>
                  {panel?.activated?.length > 0 ? (
                    panel.activated.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <div className="nofault">
                      <li>No Activations</li>
                    </div>
                  )}
                </ul>
              </div>
            </div>
            <div className="sysfault-card">
              <div className="sysfault-heading">
                <p className="chead">SYS FAULT</p>
                <p className="faultcount">({panel?.sysfaults?.length || 0})</p>
              </div>
              <div className="sysfault-data">
                <ul>
                  {panel?.sysfaults?.length > 0 ? (
                    panel.sysfaults.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <div className="nofault">
                      <li>No System Faults</li>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="tower-map-container">
          <div className="map-card">
            <div className="map-heading">
              <p>Panel Location</p>
            </div>

            {latitude && longitude ? (
              <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "80vh", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {panels.map((panel, index) => (
                  <Marker
                    key={index}
                    position={panel.position}
                    icon={panelIcon}
                  >
                    <Popup>{panel.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="no-location">📍 Location not available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegalEvent;
