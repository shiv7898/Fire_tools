import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoBulb } from "react-icons/io5";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { TbSettingsExclamation } from "react-icons/tb";
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdWrongLocation } from "react-icons/md";
import { MdDirectionsRun } from "react-icons/md";
import { RiBatteryLowFill } from "react-icons/ri";
import { IoBatteryChargingOutline } from "react-icons/io5";
import {
  FaBell,
  FaFire,
  FaExclamationCircle,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";
import { LuSiren } from "react-icons/lu";
import { FaF } from 'react-icons/fa6';


const EchoEvent = ({ panel , onClose }) => {
   const navigate = useNavigate();
   



  return (
     <div className="tower-popup-overlay">
         <div className='towerheading' >
           <button className="close-btn" onClick={onClose}>
           {/* ⬅ */}<IoArrowBackSharp size={25} color='black' />
         </button>
             <p>{`${panel.name}`} (Echo)</p>
         </div>
         <div className='aboutpanel'>
         <div className='panel-information'>  
          <div className='led-info' >
         
 
   <div className="panel-status-grid-two">
     <div className="status-item">
       <span className="status-icon mains"><IoBulb /></span>
       <span className="status-label">MAINS</span>
     </div>
     <div className="status-item">
       <span className="status-icon battery"><IoMdBatteryCharging />
     </span>
       <span className="status-label">BATTERY MODE</span>
     </div>
     <div className="status-item">
       <span className="status-icon fire"><FaFire /></span>
       <span className="status-label">FIRE</span>
     </div>
     <div className="status-item">
       <span className="status-icon fault"><FaCogs /></span>
       <span className="status-label">FAULT</span>
     </div>
     <div className="status-item">
       <span className="status-icon sil-alarm"><TbSettingsExclamation /></span>
       <span className="status-label">SYS FAULT</span>
     </div>
       <div className="status-item">
       <span className="status-icon sil-alarm"><IoBatteryChargingOutline /></span>
       <span className="status-label">B.CHARGE</span>
     </div>
      <div className="status-item">
       <span className="status-icon sil-alarm"><RiBatteryLowFill /></span>
       <span className="status-label">B.LOW</span>
     </div>
      <div className="status-item">
       <span className="status-icon sil-alarm"><HiMiniSpeakerXMark /></span>
       <span className="status-label">SILENCE</span>
     </div>
    
   </div>
          </div>
         <div className='panel-card-container'>
             <div className ="fire-card">
               <div className='fire-heading'>
                 <p className='chead'>FIRE</p><p className="faultcount">({panel?.fires?.length || 0})</p>
               </div>
              <div className="fire-data">
              <ul>
                  {panel?.fires?.length > 0 ? (
                  panel.fires.map((item, index) => <li key={index}>{item}</li>)
                  ) : (
                  <div className='nofault'><li>No Fire Faults</li></div>
                    )}
                  </ul>
                   </div>
                     </div>
             <div className ="fault-card">
               <div className='fault-heading'>
                 <p className ='chead'>FAULT</p><p className="faultcount">({panel?.faults?.length || 0})</p>
               </div>
             
                 <div className="fault-data">
                  <ul>
                  {panel?.faults?.length > 0 ? (
                   panel.faults.map((item, index) => <li key={index}>{item}</li>)
                    ) : (
                  <div className='nofault'><li>No Faults</li></div>
                    )}
                     </ul>
                       </div>              
                           </div>
                <div className ="activated-card">
                 <div className='activated-heading'>
                   <p className ='chead'>ACTIVATED</p><p className="faultcount">({panel?.activated?.length || 0})</p>
                      </div>
                  <div className="activated-data">
                   <ul>
                   {panel?.activated?.length > 0 ? (
                   panel.activated.map((item, index) => <li key={index}>{item}</li>)
                      ) : (
                    <div className='nofault'><li>No Activations</li></div>
                      )}
                       </ul>
                         </div>       
                            </div>
                    <div className ="sysfault-card">
                    <div className='sysfault-heading'>
                    <p className ='chead'>SYS FAULT</p><p className="faultcount">({panel?.sysfaults?.length || 0})</p>
                    </div>
                    <div className="sysfault-data">
                     <ul>
                     {panel?.sysfaults?.length > 0 ? (
                      panel.sysfaults.map((item, index) => <li key={index}>{item}</li>)
                       ) : (
                     <div className='nofault'><li>No System Faults</li></div>
                          )}
                           </ul>
                            </div>
 
                              </div>
                                   </div>
           </div>
         <div className="map-container">
          <div className='map-card'>
           <div className='map-heading'>
             <p>Panel Location</p>
           </div>
           <MapContainer center={[28.6139, 77.209]} zoom={8} scrollWheelZoom={false} style={{ height: "89%", width: "100%" }}>
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
 }
export default EchoEvent;
 