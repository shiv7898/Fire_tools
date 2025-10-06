import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Components/CssComponent/towerPopup.css";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoArrowBackSharp } from "react-icons/io5";


const TowerPopup = ({ towerName , onClose }) => {
   const navigate = useNavigate();
   const Faults = [
  {
    id: 1,
    name: "r1/tower/1111",
    firefault: ["Fire DEV :01 LOOP:01[        ]"],
    
    fault: ["Not triggering", "No sounds"],
    activated: [
      "[()oi))Limen @$)3 SEc 4",
      "[sec 5 loop 24}",
      "pool3$%^*()UHCCVBD",
    ],
    systemfault: ["Battery not connected", "Display not available", "Camera not working"],
  },
  {
    id: 2,
    name: "r1/tower/1112",
    firefault: ["[L2] loop 3 Dev:5","[L7] comp 1,2", "[Loop4 Dev6]", "[L5] comp3", "[Dev8] loop7", "[L9] comp1,4"],
    fault: ["Sounder line break", "Power supply failure", "No buzzer sound", "Sensor bus fail", "Damper not closing"],
    activated: ["[Sec9] Loop$33  HH*8", "dsd@!23 Loop-8", "((Pool 7 SEC 66))", "((LOOP 5@!))"],
    systemfault: ["Main board failure", "IP module dead", "Camera not working", "Touchscreen frozen", "Communication error", "No power backup", "Sensor bus fail"],
  },
  {
    id: 3,
    name: "r1/tower/1113",
    firefault: [],
    fault: ["Smoke detector offline", "Relay stuck"],
    activated: ["[(9*UI) mmSEC@88}"],
    systemfault: [],
  },
  {
    id: 4,
    name: "r1/tower/1114",
    firefault: ["[Loop1 Dev9]", "[L4] comp1, comp7"],
    fault: [],
    activated: ["PP*(*&)LL-secc4", "((LOOP 5@!))"],
    systemfault: ["LCD panel dead", "No power backup"],
  },
  {
    id: 5,
    name: "r1/tower/1115",
    firefault: ["[L3 Dev2] comp5"],
    fault: ["Device missing", "Siren cable cut"],
    activated: [],
    systemfault: ["Camera not working"],
  },
  {
    id: 6,
    name: "r1/tower/1116",
    firefault: ["[Dev7] loop2", "[L8] comp 4,9"], 
    fault: ["Unresponsive module"],
    activated: ["SEc@#777 loop33"],
    systemfault: ["IP module dead", "Display not available"],
  },
  {
    id: 7,
    name: "r1/tower/1117",
    firefault: [],
    fault: ["Manual call point jammed"],
    activated: ["loop 66 COMP$@3"],
    systemfault: [],
  },
  {
    id: 8,
    name: "r1/tower/1118",
    firefault: ["[Dev4 L1]", "[Loop3] comp 2,8,9"],
    fault: ["Damper not closing"],
    activated: [],
    systemfault: ["Battery not connected"],
  },
  {
    id: 9,
    name: "r1/tower/1119",
    firefault: ["[L6 Dev3]"],
    fault: ["Short circuit detected", "No buzzer sound"],
    activated: ["sec 77 &^% 990", "[loop 11]@!847"],
    systemfault: ["Communication error"],
  },
  {
    id: 10,
    name: "r1/tower/1120",
    firefault: [],
    fault: [],
    activated: ["Pool3 88*&^%  SEC99", "(*@LoopHH22))"],
    systemfault: ["Touchscreen frozen"],
  },
  {
    id: 11,
    name: "r1/tower/1121",
    firefault: ["[Dev:10 Loop4]"],
    fault: ["Alarm bell disconnected"],
    activated: [],
    systemfault: ["Camera not working", "Sensor bus fail"],
  }
  //  id: 1,
  //   name: "r1/tower/1111",
  //   firefault: ["[Dev:0] [loop 1] comp 3 ,4 & ui", "[L1] sec 2 comp 3 ,4 & ui"],
  //   fault: ["Not triggering", "No sounds"],
  //   activated: [
  //     "[()oi))Limen @$)3 SEc 4",
  //     "[sec 5 loop 24}",
  //     "pool3$%^*()UHCCVBD",
  //   ],
];
const matchedTower = Faults.find(tower => tower.name === towerName);


  return (
    <div className="tower-popup-overlay">
        <div className='towerheading' >
          <button className="close-btn" onClick={onClose}>
          {/* ⬅ */}<IoArrowBackSharp size={25} color='black' />
        </button>
            <p>{`${towerName}`}(Addressable)</p>
        </div>
        <div className='aboutpanel'>
        <div className='panel-card-container'>
            <div className ="fire-card">
              <div className='fire-heading'>
                <p className='chead'>FIRE</p><p className="faultcount">({matchedTower?.firefault?.length || 0})</p>
              </div>
             <div className="fire-data">
             <ul>
                 {matchedTower?.firefault?.length > 0 ? (
                 matchedTower.firefault.map((item, index) => <li key={index}>{item}</li>)
                 ) : (
                 <li>No Fire Faults</li>
                   )}
                 </ul>
                  </div>
                    </div>
            <div className ="fault-card">
              <div className='fault-heading'>
                <p className ='chead'>FAULT</p><p className="faultcount">({matchedTower?.fault?.length || 0})</p>
              </div>
            
                <div className="fault-data">
                 <ul>
                 {matchedTower?.fault?.length > 0 ? (
                  matchedTower.fault.map((item, index) => <li key={index}>{item}</li>)
                   ) : (
                 <li>No Faults</li>
                   )}
                    </ul>
                      </div>              
                          </div>
               <div className ="activated-card">
                <div className='activated-heading'>
                  <p className ='chead'>ACTIVATED</p><p className="faultcount">({matchedTower?.activated?.length || 0})</p>
                     </div>
                 <div className="activated-data">
                  <ul>
                  {matchedTower?.activated?.length > 0 ? (
                  matchedTower.activated.map((item, index) => <li key={index}>{item}</li>)
                     ) : (
                   <li>No Activations</li>
                     )}
                      </ul>
                        </div>       
                           </div>
                   <div className ="sysfault-card">
                   <div className='sysfault-heading'>
                   <p className ='chead'>SYS FAULT</p><p className="faultcount">({matchedTower?.systemfault?.length || 0})</p>
                   </div>
                   <div className="sysfault-data">
                    <ul>
                    {matchedTower?.systemfault?.length > 0 ? (
                     matchedTower.systemfault.map((item, index) => <li key={index}>{item}</li>)
                      ) : (
                    <li>No System Faults</li>
                         )}
                          </ul>
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


export default TowerPopup
