
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./PanelLocations.css";
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const panelIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // small location pin
  iconSize: [30, 30],
});

export default function PanelLocations() {
  // Example panel locations (lat, lng + name)
  const panels = [
    { name: "Panel 1111 - Delhi", position: [28.6139, 77.209] },
    { name: "Panel 1112 - Mumbai", position: [19.076, 72.8777] },
    { name: "Panel 1113 - Kolkata", position: [22.5726, 88.3639] },
    { name: "Panel 1114 - Bengaluru", position: [12.9716, 77.5946] },
    { name: "Panel 1115 - Chennai", position: [13.0827, 80.2707] },
  ];

  return (
    <div className="map-container">
      <h2 className="map-title">Location</h2>
      <MapContainer
        center={[22.9734, 78.6569]} // Center of India
        zoom={5}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {panels.map((panel, index) => (
          <Marker key={index} position={panel.position} icon={panelIcon}>
            <Popup>{panel.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
// import React, { useState } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   Marker,
//   InfoWindow,
// } from "@react-google-maps/api";
// import "./PanelLocations.css";

// export default function PanelLocations() {
//   const panels = [
//     { name: "Panel 1111 - Delhi", position: { lat: 28.6139, lng: 77.209 } },
//     { name: "Panel 1112 - Mumbai", position: { lat: 19.076, lng: 72.8777 } },
//     { name: "Panel 1113 - Kolkata", position: { lat: 22.5726, lng: 88.3639 } },
//     { name: "Panel 1114 - Bengaluru", position: { lat: 12.9716, lng: 77.5946 } },
//     { name: "Panel 1115 - Chennai", position: { lat: 13.0827, lng: 80.2707 } },
//   ];

//   const [activeMarker, setActiveMarker] = useState(null);

//   const mapContainerStyle = {
//     width: "100%",
//     height: "500px",
//     borderRadius: "12px",
//   };

//   const center = { lat: 22.9734, lng: 78.6569 }; // Center of India

//   return (
//     <div className="map-container">
//       <h2 className="map-title">Location</h2>

//       {/* 🚀 Using Google's demo key (only for testing, not production) */}
//       <LoadScript googleMapsApiKey="AIzaSyA-KEe1xnjX8dZNRUt_7V_WXFMW-L5_2rA">
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           center={center}
//           zoom={5}
//         >
//           {panels.map((panel, index) => (
//             <Marker
//               key={index}
//               position={panel.position}
//               onClick={() => setActiveMarker(index)}
//             >
//               {activeMarker === index && (
//                 <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                   <div>{panel.name}</div>
//                 </InfoWindow>
//               )}
//             </Marker>
//           ))}
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// }
