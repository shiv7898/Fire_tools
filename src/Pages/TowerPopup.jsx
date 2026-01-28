import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";

import { IoArrowBackSharp } from "react-icons/io5";
import { TbSettingsExclamation } from "react-icons/tb";

import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { ImSwitch } from "react-icons/im";
import { FaBell, FaFire, FaExclamationCircle } from "react-icons/fa";
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
const TowerPopup = ({
  panel,
  onClose,
  updateCurrentData,
  selectedPanelEvent,
  processLEDStatus,
}) => {
  console.log("Panel prop in TowerPopup....", panel);

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
  console.log("fireEventsIN TowerPopup.....", fireEvents);

  return (
    <>
      {panel && (
        <div className="tower-popup-overlay">
          <div className="towerheading">
            <button className="close-btn" onClick={onClose}>
              {/* ⬅ */}
              <IoArrowBackSharp size={25} color="white" />
            </button>
            <p>{`${panel.name}`} (Addressable)</p>
          </div>
          <div className="aboutpanel">
            <div className="panel-information">
              <div className="led-info">
                <div className="panel-status-grid">
                  <div className="status-item">
                    <div
                      className={`add-icon-back ${led_status.main == 1 ? "mains-active" : ""
                        }`}
                    >
                      <span
                        className={`status-icon ${led_status.main == 1 ? "green" : "gray"
                          }`}
                      >
                        <ImSwitch className="address-icon" />
                      </span>
                    </div>
                    <span className="status-label">MAINS</span>
                  </div>
                  <div className="status-item">
                    <div className={`add-icon-back ${led_status.fire == 1 ? "fire-active" : ""}`}>
                      <span
                        className={`status-icon ${led_status.fire == 1 ? "red" : "gray"
                          }`}
                        fire
                      >
                        <FaFire />
                      </span>
                    </div>

                    <span className="status-label">FIRE</span>
                  </div>
                  <div className="status-item">
                    <div className={`add-icon-back ${led_status.fault == 1 ? "fault-active" : "gray"}`}>
                      {" "}
                      <span
                        className={`status-icon ${led_status.fault == 1 ? "yellow" : "gray"
                          }`}
                        fault
                      >
                        <FaExclamationCircle />
                      </span>
                    </div>

                    <span className="status-label">FAULT</span>
                  </div>
                  <div className="status-item">
                    <div className={`add-icon-back ${led_status.sysfault == 1 ? "sys-active" : "gray"}`}>
                      {" "}
                      <span
                        className={`status-icon sil-alarm ${led_status.sysfault == 1 ? "blue" : "gray"
                          }`}
                      >
                        <TbSettingsExclamation />
                      </span>
                    </div>

                    <span className="status-label"> Sys_Fault</span>
                  </div>
                  <div className="status-item">
                    <div className="add-icon-back">
                      {" "}
                      <span className="status-icon battery">
                        <IoMdBatteryCharging />
                      </span>
                    </div>

                    <span className="status-label">BATTERY MODE</span>
                  </div>

                  <div className="status-item">
                    <div className={`add-icon-back ${led_status.sil == 1 ? "sil-active" : "gray"}`}>
                      {" "}
                      <span
                        className={`status-icon sil-alarm ${led_status.sil == 1 ? "yellow" : "gray"
                          }`}
                      >
                        <FaVolumeUp />
                      </span>
                    </div>

                    <span className="status-label">SIL ALARM</span>
                  </div>
                  <div className="status-item">
                    <div className={`add-icon-back ${led_status.pre == 1 ? "pre-active" : "gray"}`}>
                      {" "}
                      <span
                        className={`status-icon pre-alarm ${led_status.pre == 1 ? "yellow" : "gray"
                          }`}
                      >
                        <FaBell />
                      </span>
                    </div>

                    <span className="status-label">PRE ALARM</span>
                  </div>
                </div>
              </div>
              <div className="panel-card-container">
                <div className="fire-card">
                  <div className="fire-heading">
                    <p className="chead">FIRE</p>
                    <p className="faultcount">
                      {fireEvents.length > 0 ? `(${fireEvents.length})` : "(0)"}
                    </p>
                  </div>
                  <div className="fire-data">
                    <div className="content-scroll">
                      {fireEvents.length > 0 ? (
                        fireEvents.map((event, index) => (
                          <div key={index} className="event-card-popup fire">
                            {/* <div className="event-icon-popup">🔥</div> */}
                            <div className="event-content-popup">
                              <div className="event-header-popup">
                                <span className="event-title-popup">
                                  {`${event.eventDescription}(${event.deviceTypeText || ""
                                    })`}
                                </span>
                                <span className="event-time-popup">
                                  {event.formattedDateTime}
                                </span>
                              </div>
                              <div className="event-device-popup">
                                {event.deviceText}
                              </div>
                              <div className="event-meta-popup">
                                <span>LoopNo: {event.loopNo || "-"}</span>
                                <span>DeviceNo: {event.deviceNo || "-"}</span>
                                <span>PanelNo: {event.panelNo || "-"}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="nofault">
                          <li>No Fire Faults</li>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="fault-card">
                  <div className="fault-heading">
                    <p className="chead">FAULT</p>
                    <p className="faultcount">
                      {faultEvents.length > 0
                        ? `(${faultEvents.length})`
                        : "(0)"}
                    </p>
                  </div>

                  <div className="fault-data">
                    <div className="content-scroll">
                      {faultEvents.length > 0 ? (
                        faultEvents.map((event, index) => (
                          <div key={index} className="event-card-popup fault">
                            {/* <div className="event-icon-popup">⚠️</div> */}
                            <div className="event-content-popup">
                              <div className="event-header-popup">
                                <span className="event-title-popup">
                                  {`${event.faultDescription}(${event.deviceTypeText || ""
                                    })`}
                                </span>
                                <span className="event-time-popup">
                                  {event.formattedDateTime}
                                </span>
                              </div>
                              <div className="event-device-popup">
                                {event.deviceText}
                              </div>
                              <div className="event-meta-popup">
                                <span>LoopNo: {event.loopNo || "-"}</span>
                                <span>DeviceNo: {event.deviceNo || "-"}</span>
                                <span>PanelNo: {event.panelNo || "-"}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="nofault">
                          <li>No Faults</li>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="activated-card">
                  <div className="activated-heading">
                    <p className="chead">ACTIVATED </p>
                    <p className="faultcount">
                      {activatedEvents.length > 0
                        ? `(${activatedEvents.length})`
                        : "(0)"}
                    </p>
                  </div>
                  <div className="activated-data">
                    <div className="content-scroll">
                      {activatedEvents.length > 0 ? (
                        activatedEvents.map((event, index) => (
                          <div
                            key={index}
                            className="event-card-popup activated"
                          >
                            {/* <div className="event-icon-popup">🚨</div> */}
                            <div className="event-content-popup">
                              <div className="event-header-popup">
                                <span className="event-title-popup">
                                  {`${event.eventDescription}(${event.deviceTypeText || ""
                                    })`}
                                </span>
                                <span className="event-time-popup">
                                  {event.formattedDateTime}
                                </span>
                              </div>
                              <div className="event-device-popup">
                                {event.deviceText}
                              </div>
                              <div className="event-meta-popup">
                                <span>LoopNo: {event.loopNo || "-"}</span>
                                <span>DeviceNo: {event.deviceNo || "-"}</span>
                                <span>PanelNo: {event.panelNo || "-"}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="nofault">
                          <li>No Activations</li>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sysfault-card">
                  <div className="sysfault-heading">
                    <p className="chead">SYS FAULT</p>
                    <p className="faultcount">
                      {sysFaultEvents.length > 0
                        ? `(${sysFaultEvents.length})`
                        : ""}
                    </p>
                  </div>
                  <div className="sysfault-data">
                    <div className="content-scroll">
                      {sysFaultEvents.length > 0 ? (
                        sysFaultEvents.map((event, index) => (
                          <div
                            key={index}
                            className="event-card-popup sysfault"
                          >
                            {/* <div className="event-icon-popup">🧰</div> */}
                            <div className="event-content-popup">
                              <div className="event-header-popup">
                                <span className="event-time-popup">
                                  {event.formattedDateTime}
                                </span>
                                <span className="event-title-popup">
                                  {event.deviceTypeText}
                                </span>
                              </div>
                              <div className="event-device-popup">
                                {event.faultDescription}
                              </div>
                              <div className="event-meta-popup">
                                <span>LoopNo: {event.loopNo}</span>
                                <span>PanelNo: {event.panelNo}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="nofault">
                          <li>No System Faults</li>
                        </div>
                      )}
                    </div>
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
                    zoom={16}
                    scrollWheelZoom={true}
                    className="mapContainer"
                  // style={{ height: "clamp(260px, 80vh, 600px)", width: "100%" }}
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
      )}
    </>
  );
};

export default TowerPopup;
