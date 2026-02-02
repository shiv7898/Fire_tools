import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";
import { useNavigate } from "react-router-dom";

import { IoArrowBackSharp } from "react-icons/io5";

import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { ImSwitch } from "react-icons/im";
import { FaFire, FaCogs } from "react-icons/fa";

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

function ConventionalEvent({
  panel,
  onClose,
  selectedPanel,
  selectPanelLedStatuses,
  processLEDStatus,
  updateCurrentData,
  sendMqttCommand,
}) {



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



  // const [latitude, longitude] = panel?.location
  //   .split(",")
  //   .map((item) => item.trim());
  // const panels = [{ name: panel.name, position: [latitude, longitude] }];

  const navigate = useNavigate();
  console.log("selectedPanel in con event:", selectedPanel);
  const led_status = processLEDStatus(panel, panel?.led_status);
  console.log("LED STATUS IN con....", led_status);

  return (
    <div className="tower-popup-overlay">
      <div className="towerheading">
        <button className="close-btn" onClick={onClose}>
          {/* ⬅ */}
          <IoArrowBackSharp size={25} color="#5e5b5b" />
        </button>
        <p>{`${panel.name}`} (Conventional)</p>
      </div>
      <div className="aboutpanel">
        <div className="panel-information">
          <div className="led-info">
            <div className="panel-status-grid">
              <div className={`status-item `}>
                <div className={`add-icon-back ${led_status.main == 1 ? "mains-active" : ""
                  }`}>
                  {" "}
                  <span
                    className={`status-icon mains ${led_status.main == 1 ? "green" : "gray"
                      }`}
                  >
                    <ImSwitch />
                  </span>
                </div>

                <span className="status-label">MAINS</span>
              </div>
              <div className={`status-item `}>
                <div className={`add-icon-back ${led_status.fault == 1 ? "fire-active" : ""}`}>
                  <span
                    className={`status-icon fire ${led_status.fire == 1 ? "red" : "gray"
                      }`}
                  >
                    <FaFire />
                  </span>
                </div>

                <span className="status-label">FIRE</span>
              </div>
              <div className={`status-item `}>
                <div className={`add-icon-back ${led_status.fault == 1 ? "fault-active" : ""}`}>
                  {" "}
                  <span
                    className={`status-icon fault ${led_status.fault == 1 ? "yellow" : "gray"
                      }`}
                  >
                    <FaCogs />
                  </span>
                </div>

                <span className="status-label">FAULT</span>
              </div>
              <div className={`status-item `}>
                <div className={`add-icon-back ${led_status.batt == 1 ? "batt-active" : ""}`}>
                  {" "}
                  <span
                    className={`status-icon battery ${led_status.batt == 1 ? "yellow" : "gray"
                      }`}
                  >
                    <IoMdBatteryCharging />
                  </span>
                </div>

                <span className="status-label">BATTERY MODE</span>
              </div>

              <div className={`status-item `}>
                <div className={`add-icon-back ${led_status.fault == 1 ? "hooter-active" : ""}`}>
                  {" "}
                  <span
                    className={`status-icon sil-alarm ${led_status.hooter == 1 ? "yellow" : "gray"
                      }`}
                  >
                    <FaVolumeUp />
                  </span>
                </div>

                <span className="status-label">HOOTER</span>
              </div>
              {/* <div className={`status-item ${leds.preAlarm ? "active" : ""}`}>
                <span className="status-icon pre-alarm">
                  <FaBell />
                </span>
                <span className="status-label">PRE ALARM</span>
              </div> */}
            </div>
          </div>
          <div className="panel-card-container-con">
            <h1>Conventional Panel</h1>
            <div className="img-conv-back"></div>
            {/* <div className="fire-card">
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
                <p className="faultcount">({panel?.faults?.length || 0})</p>
              </div>

              <div className="fault-data">
                <ul>
                  {panel?.fault?.length > 0 ? (
                    panel.fault.map((item, index) => (
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
                <p className="faultcount">({panel?.faults?.length || 0})</p>
              </div>
              <div className="activated-data">
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
            <div className="sysfault-card">
              <div className="sysfault-heading">
                <p className="chead">SYS FAULT</p>
                <p className="faultcount">({panel?.sysfaults?.length || 0})</p>
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
            </div> */}

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
                style={{ height: "clamp(260px, 80vh, 600px)", width: "100%" }}
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
}

export default ConventionalEvent;
