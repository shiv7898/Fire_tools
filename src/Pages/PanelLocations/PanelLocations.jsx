import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "./PanelLocations.css";
import "leaflet/dist/leaflet.css";
import { FaLocationDot } from "react-icons/fa6";

import ReactDOMServer from "react-dom/server";

// Custom marker icon
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
const normalIcon = new L.DivIcon({
  html: `
    <div class="pulse-container" style="--pulse-color:#16a34a">
      <div class="pulse-ring"></div>
      <div class="pulse-center"></div>
    </div>
  `,
  iconSize: [30, 30],
  className: "icon-pulse",
});
const redIcon = new L.DivIcon({
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
const greenIcon = new L.DivIcon({
  html: `
    <div class="pulse-container-green" style="--pulse-color:#16a34a">
      <div class="pulse-ring-green"></div>
      <div class="pulse-center-green">
       ${ReactDOMServer.renderToString(
          <FaLocationDot size={30} color="#16a34a" />
        )}
      </div>
    </div>
  `,
  iconSize: [30, 30],
  className: "icon-pulse-green",
});


function FitBounds({ locations }) {
  const map = useMap();

  React.useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map((l) => l.position);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [locations, map]);

  return null;
}

export default function PanelLocations({ dataResponse, selectedPanel }) {
  console.log("selectedTower in PanelLocations:", selectedPanel.id);

  const panels = Array.isArray(dataResponse?.panels) ? dataResponse.panels : [];

  const panelLocations = panels
    .map((panel) => {
      if (
        panel?.location &&
        typeof panel.location === "string" &&
        panel.location.includes(",")
      ) {
        const [lat, lng] = panel.location
          .split(",")
          .map((v) => Number(v.trim()));

        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            id: panel.id,
            name: panel.panel_name,
            position: [lat, lng],
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  if (panelLocations.length === 0) {
    return (
      <div className="map-container">
        <h2 className="map-title">Location</h2>
        <div className="no-location">📍 No valid panel locations</div>
      </div>
    );
  }

  return (
       <div className="map-container">
      <h2 className="map-title">Location</h2>

      <MapContainer zoom={5} className="leaflet-map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitBounds locations={panelLocations} />

        {panelLocations.map((panel) => {
          const isSelected = panel.id === selectedPanel?.id;

          return (
            <Marker
              key={panel.id}
              position={panel.position}
              icon={isSelected ? greenIcon : redIcon}
            >
              <Popup>{panel.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
