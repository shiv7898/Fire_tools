import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";

export default function TowerPopup({ towerName }) {
  const navigate = useNavigate();
  return (
    <div className="tower-popup-overlay">
  <p>Panels popup open</p>
    </div>
  );
}
