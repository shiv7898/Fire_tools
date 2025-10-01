import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";

export default function TowerPopup({ towerName }) {
  const navigate = useNavigate();
  return (
    <div className="tower-popup-overlay">
      <div className="tower-popup">
        <button className="close-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Cancel
        </button>

        <h2>Addressable{`(${towerName})`}</h2>
        <div className="tower-subcontainer">
          <div className="tower-popup-card-container">
            <div className="popup-card1 cards">
              <div className="fire-heading">
                <h3>2</h3>
                <h3>Fire{"  "}</h3>
              </div>
            </div>
            <div className="popup-card2 cards">
              <div className="fire-heading">
                <h3>1</h3>
                <h3>Fault</h3>
              </div>
            </div>
            <div className="popup-card3 cards">
              <div className="fire-heading">
                <h3>3</h3>
                <h3>Activated</h3>
              </div>
            </div>
            <div className="popup-card4 cards">
              <div className="fire-heading">
                <h3>2</h3>
                <h3>Sys Fault</h3>
              </div>
            </div>
          </div>
          <div
            className="map-container"
            // style={{ width: "100%", height: "400px" }}
          >
            <MapContainer
              center={[28.6139, 77.209]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {/* <Marker position={[28.6139, 77.209]}>
                <Popup>New Delhi (Demo)</Popup>
              </Marker> */}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
