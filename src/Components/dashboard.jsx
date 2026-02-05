import React, { useState, useRef, useEffect } from "react";
import "./CssComponent/dashboard.css";
import { GrCalculator } from "react-icons/gr";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { PiProhibitFill } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";
import { HiHome } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { LuAlignJustify } from "react-icons/lu";

import { ImProfile } from "react-icons/im";
import { IoEyeOutline } from "react-icons/io5";

import { Link } from "react-router-dom";
import {
  DEV_TYPE,
  FIRE_EVENT,
  FAULT_EVENT,
  SYS_FAULT_EVENT,
  ACTIVATED,
} from "./constants.jsx";

import TowerPopup from "../Pages/TowerPopup";
import Panels from "../Pages/Allpanels/Panels";
import axios from "axios";
import ActivePanel from "../Pages/ActivePanel/ActivePanel";
import InactivePanel from "../Pages/InactivePanel/InactivPanel";
import PanelLocations from "../Pages/PanelLocations/PanelLocations";
import AddressablePopup from "./PanelTypePopups/AddressablePopups";
import ConventionalPopup from "./PanelTypePopups/ConventionalPopups";
import RegalPopup from "./PanelTypePopups/RegalPopus";
import EchoPopup from "./PanelTypePopups/EchoPopups";
import EchoEvent from "../Pages/EchoEvent";
import RegalEvent from "../Pages/RegalEvent";
import ConventionalEvent from "../Pages/ConventionalEvent";
import mqtt from "mqtt";
import ProfileView from "./profileView.jsx";
import PanelBarGraph from "./GraphView/graphView.jsx";

export default function Dashboard({ userData }) {
  console.log("🔹 Dashboard loaded with userData:", userData);

  // MQTT States
  const [mqttClient, setMqttClient] = useState(null);

  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isConnected, setIsConnected] = useState(false);

  // Your existing states
  const [isOpen, setIsOpen] = useState(false);
  const [locationSidebarOpen, setLocationSidebarOpen] = useState(false);
  const [panels, setPanels] = useState();
  console.log("Panels data in Dashboard....", panels);

  const [showTowerPopup, setShowTowerPopup] = useState(false);
  const [selectedTower, setSelectedTower] = useState("");
  console.log("Selected Tower in Dashboard....", selectedTower);

  const [allPanel, setAllPanel] = useState(false);
  const [activePanel, setActivePanel] = useState(false);
  const [inactivePanel, setInctivePanel] = useState(false);
  const [location, setLocation] = useState(false);
  const [dataResponse, setDataResponse] = useState();
  const [eventsResponseAPI, setEventsResponseAPI] = useState([]);

  const [events, setEvents] = useState([]);

  const [selectedPanel, setSelectedPanel] = useState();
  const [selectedPanelEvent, setSelectedPanelEvent] = useState([]);
  console.log("Selected Panel Events in Dashboard....", selectedPanelEvent);
  const [popupPanel, setPopupPanel] = useState(null);
  const [popupType, setPopupType] = useState("");

  const [combinedPanels, setCombinedPanels] = useState([]);
  console.log("Combined Panels in Dashboard....nnn", combinedPanels);

  const [panelLedStatuses, setPanelLedStatuses] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [isBarView, setIsBarView] = useState(false);

  const panelLedStatusesRef = useRef({});
  const panelUseRef = useRef([]);
  const panelPopupRef = useRef({});
  const subscribedTopicsRef = useRef(new Set());
  useEffect(() => {
    panelLedStatusesRef.current = panelLedStatuses;
  }, [panelLedStatuses]);
  useEffect(() => {
    panelPopupRef.current = popupPanel;
  }, [popupPanel]);
  useEffect(() => {
    panelUseRef.current = combinedPanels;
  }, [combinedPanels]);
  console.log("Panel Led Statuses in Dashboard....", panelPopupRef.current);
  const [selectPanelLedStatuses, setSelectPanelLedStatuses] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log("🔹 Combined Panels:", combinedPanels);

  const sidebarRef = useRef(null);
  const locationSidebarRef = useRef(null);
  const popupWrapperRef = useRef(null);
  const panelsRef = useRef([]);
  const eventGroups = {
    fire: selectedPanelEvent?.filter((ev) => ev.eventType === 2) || [],
    fault: selectedPanelEvent?.filter((ev) => ev.eventType === 3) || [],
    sysfault: selectedPanelEvent?.filter((ev) => ev.eventType === 4) || [],
    activated: selectedPanelEvent?.filter((ev) => ev.eventType === 5) || [],
  };
  console.log("Event Groups in Dashboard....", eventGroups);

  // MQTT Connection Setup - FIXED: Added proper dependency array
  useEffect(() => {
    console.log("🚀 Initializing MQTT Connection...");

    const initializeMQTT = () => {
      const clientId = `web-client-${Math.random().toString(16).substr(2, 8)}`;

      console.log("🔗 Connecting to MQTT with clientId:", clientId);

      try {
        const client = mqtt.connect("wss://api.m2rtechnomations.com/event", {
          clientId: clientId,
          clean: true,
          connectTimeout: 10000, // Increased timeout
          reconnectPeriod: 2000,
          keepalive: 60,
        });

        client.on("connect", () => {
          console.log("✅ MQTT Connected successfully!");
          setConnectionStatus("connected");
          setIsConnected(true);
          setMqttClient(client);

          // Subscribe to topics when panels are loaded
          if (combinedPanels.length > 0) {
            console.log("📡 Subscribing to existing panels...");
            subscribeToPanelTopics(client);
          }
        });

        client.on("message", (topic, message) => {
          const msg = {
            topic,
            data: message.toString().trim(), // ✔ Correct
          };

          console.log("MQTT Message:", msg);
          handleMQTTMessage(msg);
        });

        client.on("error", (error) => {
          console.error("❌ MQTT Connection Error:", error);
          setConnectionStatus("error");
          setIsConnected(false);
        });

        client.on("close", () => {
          console.log("🔴 MQTT Connection closed");
          setConnectionStatus("disconnected");
          setIsConnected(false);
        });

        client.on("reconnect", () => {
          console.log("🔄 MQTT Reconnecting...");
          setConnectionStatus("reconnecting");
        });

        client.on("offline", () => {
          console.log("📴 MQTT Client offline");
          setConnectionStatus("disconnected");
          setIsConnected(false);
        });

        setMqttClient(client);
      } catch (error) {
        console.error("❌ MQTT Initialization Error:", error);
        setConnectionStatus("error");
      }
    };

    initializeMQTT();

    return () => {
      console.log("🧹 Cleaning up MQTT connection...");
      if (mqttClient) {
        mqttClient.end();
        console.log("✅ MQTT client disconnected");
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Subscribe to topics when combinedPanels changes - FIXED: Added proper dependency handling
  useEffect(() => {
    console.log("🔹 Combined panels updated, count:", combinedPanels.length);

    if (mqttClient && isConnected && combinedPanels.length > 0) {
      console.log("📡 Subscribing to panel topics...");
      subscribeToPanelTopics(mqttClient);
    } else if (combinedPanels.length > 0 && !isConnected) {
      console.log("⚠️ Panels loaded but MQTT not connected");
    }
  }, [combinedPanels, isConnected]); // Removed mqttClient from dependencies

  const subscribeToPanelTopics = (client) => {
    if (!client || !client.connected) {
      console.error("❌ MQTT client not connected for subscription");
      return;
    }

    const topics = combinedPanels
      .map((panel) => [
        `${panel.topic}/led_status`,
        `${panel.topic}/events`,
        `${panel.topic}/command`,
      ])
      .flat();

    // Only subscribe to topics not already subscribed to (prevent duplicate subscriptions)
    const toSubscribe = topics.filter(
      (t) => !subscribedTopicsRef.current.has(t)
    );
    if (toSubscribe.length === 0) {
      console.log("🎯 No new topics to subscribe to");
      return;
    }

    console.log("🎯 Subscribing to topics:", toSubscribe);

    toSubscribe.forEach((topic) => {
      client.subscribe(topic, { qos: 0 }, (err) => {
        if (!err) {
          subscribedTopicsRef.current.add(topic);
          console.log(`✅ Successfully subscribed to: ${topic}`);
        } else {
          console.error(`❌ Subscription error for ${topic}:`, err);
        }
      });
    });
  };

  const handleMQTTMessage = (msg) => {
    console.log("🔹 kjgj....", msg.data);
    console.log("🔹 Panel LED Statuses (REF):", panelUseRef.current);

    try {
      let updated = false;

      if (msg.topic.endsWith("/led_status")) {
        const baseTopic = msg.topic.replace("/led_status", "");

        const updatedStatus = {
          ...panelLedStatusesRef.current, // ⭐ Fresh latest
          [baseTopic]: msg.data.toString(),
        };

        const allFilteredPanel = panelUseRef.current.map((value) => {
          if (value.topic === baseTopic) {
            let selectedPanel3 = value;
            selectedPanel3.led_status = msg.data.toString();
            selectedPanel3.last_update = new Date().toISOString();
            selectedPanel3.is_active = true;
            updated = true;
            return selectedPanel3;
          }
          return value;
        });
        console.log(
          "📢 All Filtered Panels after LED update:",
          allFilteredPanel
        );
        panelUseRef.current = allFilteredPanel;
        panelLedStatusesRef.current = updatedStatus; // ⭐ update ref
        const selectedPanel = allFilteredPanel.find(
          (f) => f.topic === baseTopic
        );
        if (updated) {
          setSelectedPanel(selectedPanel);
          console.log("🎯 Updated selected panel:", panelPopupRef.current);

          // 🔁 If popup is open for this panel, update popupPanel too
          // if (panelPopupRef.current && panelPopupRef.current.id === selectedPanel.id) {
          setPopupPanel(selectedPanel);
          panelPopupRef.current = selectedPanel;
          // handlePanelClick(selectedPanel);

          console.log("🧩 Popup panel updated with live data:", selectedPanel);
          // }
        }
        setPanelLedStatuses(updatedStatus); // ⭐ update React state

        updated = true;
      } else if (msg.topic.endsWith("/events")) {
        const baseTopic = msg.topic.replace("/events", "");
        // extractPanelPayloadData(response.data || []) || []
        const _selectedPanel = panelUseRef.current.find(
          (p) => p.topic === baseTopic
        );
        const payloaddata = extractMqttlPayloadData(
          _selectedPanel,
          msg.data.toString()
        );
        console.log("📋 Event Topic Matched6:", payloaddata);

        panelUseRef.events = [payloaddata, ...panelUseRef.events];
        setEvents((events) => [payloaddata, ...events]);
        // handlePanelClick(true);
      }

      if (updated) {
        console.log("🔄 LED Updated:", panelLedStatusesRef.current);
      } else {
        console.log("ℹ️ No panel matched topic:", msg.topic);
      }
    } catch (error) {
      console.error("❌ Error processing MQTT message:", error);
    }
  };

  const processLEDStatus = (panel, msg) => {
    console.log("💡 LED Status for", panel.type, "panel:", msg);

    switch (panel.type) {
      case "Conventional":
        return processConventionalLED(panel, msg);
      case "Addressable":
        return processAddressableLED(panel, msg);
      case "Echo":
        return processEchoLED(panel, msg);

      case "Regal":
        return processRegalLED(panel, msg);

        return panel;
      default:
        console.log("❌ Unknown panel type:", panel.type);
        return panel;
    }
  };

  const processConventionalLED = (panel, msg) => {
    console.log("🔹 Conventional LED Data:", msg);

    try {
      // Split the incoming data by ";"
      const parts = msg.split(";");
      console.log("🔹 Split Conventional LED parts:", parts);

      // Validate the data
      if (parts.length < 7) {
        console.log("❌ Invalid Conventional LED data length:", parts.length);
        return panel;
      }

      // Extract values
      const main = parts[0];
      const battery = parts[1];
      const fire = parts[2];
      const fault = parts[3];
      const hooter = parts[4];
      const time = parts[5]; // "13:34"
      const date = parts[6]; // "6-11-2025"

      const updatedPanel = {
        main: Number(main),
        batt: Number(battery),
        fire: Number(fire),
        fault: Number(fault),
        hooter: Number(hooter),

        time: time,
        date: date,
      };

      console.log("✅ Conventional panel updated:", updatedPanel);
      return updatedPanel;
    } catch (error) {
      console.error("❌ Error processing Conventional LED:", error);
      return panel;
    }
  };

  const processAddressableLED = (panel, msg) => {
    const data = msg;
    console.log("🔹 Addressable LED Data:", data.length);

    try {
      // Add validation for data length
      if (data.length < 32) {
        console.error("❌ Invalid Addressable LED data length:", data.length);
        return {};
      }

      const pNo = data.substr(8, 2);
      const main = data.substr(10, 2);
      const sil = data.substr(12, 2);
      const fault = data.substr(14, 2);

      const pre = data.substr(16, 2);
      const fire = data.substr(18, 2);
      const day = data.substr(20, 2);
      const month = data.substr(22, 2);
      const year = data.substr(24, 2);
      const hour = data.substr(26, 2);
      const min = data.substr(28, 2);

      const updatedPanel = {
        pNo: parseInt(pNo, 16),
        main: parseInt(main, 16),
        sil: parseInt(sil, 16),
        fault: parseInt(fault, 16),
        pre: parseInt(pre, 16),
        fire: parseInt(fire, 16),
        time: `${hour}:${min}`,
        date: `${day}/${month}/${year}`,
      };

      console.log("✅ Addressable panel updated:", updatedPanel.name);
      return updatedPanel;
    } catch (error) {
      console.error("❌ Error processing Addressable LED:", error);
      return panel;
    }
  };
  const processEchoLED = (panel, msg) => {
    const data = msg;
    console.log("🔹 Echo LED Data:", data);

    try {
      // Add validation for data length
      if (data.length < 8) {
        console.error("❌ Invalid Echo LED data length:", data.length);
        return {};
      }

      // Echo panel LED status processing
      const binaryString = hexToBinary(data.substr(8, 2), true);

      const updatedPanel = {
        SILENCE: parseInt(binaryString[0], 10),
        EVACUATE: parseInt(binaryString[1], 10),
        FIRE: parseInt(binaryString[2], 10),
        FAULT: parseInt(binaryString[3], 10),
        BATTLOW: parseInt(binaryString[4], 10),
        BATTCHARGE: parseInt(binaryString[5], 10),
        BATTMODE: parseInt(binaryString[6], 10),
        MAINSON: parseInt(binaryString[7], 10),

        time: data.split(";")[1] || "",
        date: data.split(";")[2] || "",
        status: 1,
      };

      console.log("✅ Echo panel updated:", updatedPanel.name);
      return updatedPanel;
    } catch (error) {
      console.error("❌ Error processing Echo LED:", error);
      return panel;
    }
  };

  const processRegalLED = (panel, msg) => {
    const data = msg;
    console.log("🔹 Regal LED Data:", data.length);

    try {
      // Add validation for data length
      if (data.length < 36) {
        console.error("❌ Invalid Regal LED data length:", data.length);
        return {};
      }

      // Regal panel LED status processing
      const pNo = data.substr(8, 2);
      const main = data.substr(10, 2);
      const battMode = data.substr(12, 2);
      const cFire = data.substr(14, 2);
      const cFault = data.substr(16, 2);
      const sysFault = data.substr(18, 2);
      const zoneIso = data.substr(20, 2);
      const sil = data.substr(22, 2);
      const evac = data.substr(24, 2);
      const day = data.substr(26, 2);
      const month = data.substr(28, 2);
      const year = data.substr(30, 2);
      const hour = data.substr(32, 2);
      const min = data.substr(34, 2);

      const updatedPanel = {
        MAIN: parseInt(main, 16),
        FIRE: parseInt(cFire, 16),
        FAULT: parseInt(cFault, 16),
        SYSFAULT: parseInt(sysFault, 16),
        BATTMODE: parseInt(battMode, 16),
        SILENCE: parseInt(sil, 16),
        ZONEISO: parseInt(zoneIso, 16),
        EVACUATE: parseInt(evac, 16),
        PNO: parseInt(pNo, 16),

        time: `${hour}:${min}`,
        date: `${day}/${month}/${year}`,
        status: 1,
      };

      return updatedPanel;
    } catch (error) {
      console.error("❌ Error processing Regal LED:", error);
      return panel;
    }
  };

  // Utility function for hex to binary conversion (from your React Native code)
  const hexToBinary = (hex, check) => {
    const intValue = parseInt(hex, 16);
    let binaryString = intValue.toString(2).padStart(8, "0");

    if (check) return binaryString;

    binaryString = binaryString.split("").reverse().join("");
    return binaryString;
  };

  // Main fault parsing function
  const parseFaultEvent = (hexData) => {
    if (!hexData || hexData.length < 40) {
      throw new Error("Invalid hex data");
    }

    const eventType = parseInt(hexData.substr(6, 2), 16);
    const subEventType = parseInt(hexData.substr(8, 2), 16);
    const panelNo = parseInt(hexData.substr(10, 2), 16);
    const loopNo = parseInt(hexData.substr(12, 2), 16);
    const deviceNo = parseInt(hexData.substr(14, 2), 16);
    const deviceType = parseInt(hexData.substr(16, 2), 16);
    const zoneX = parseInt(hexData.substr(18, 2), 16);
    const zoneY = parseInt(hexData.substr(20, 2), 16); // Fixed: was 22, should be 20
    const DD = parseInt(hexData.substr(26, 2), 10);
    const mm = parseInt(hexData.substr(28, 2), 10);
    const yy = parseInt(hexData.substr(30, 2), 10);
    const hour = parseInt(hexData.substr(32, 2), 10);
    const minutes = parseInt(hexData.substr(34, 2), 10);

    // Extract device text and convert from hex to ASCII
    // console.log("DDDDD: ", eventType, subEventType, hexData);
    const deviceTextHex = hexData.substr(38, 44);
    const deviceText = hexToString(deviceTextHex).replace(/\0/g, "").trim();

    // Determine fault category and description
    const faultDescription = getFaultDescription(eventType, subEventType);
    const faultCategory = "FAULT";
    console.log(
      "DDDDD: ",
      faultCategory,
      faultDescription,
      eventType,
      subEventType,
      hexData
    );

    return {
      eventType,
      subEventType,
      panelNo,
      loopNo,
      deviceNo,
      deviceType,
      deviceTypeText: DEV_TYPE[deviceType] || "UNKNOWN",
      zoneX,
      zoneY,
      date: {
        DD: DD.toString().padStart(2, "0"),
        mm: mm.toString().padStart(2, "0"),
        yy: yy.toString().padStart(2, "0"),
      },
      time: {
        hour: hour.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
      },
      deviceText,
      faultCategory,
      faultDescription,
      formattedDateTime: `${DD.toString().padStart(2, "0")}/${mm
        .toString()
        .padStart(2, "0")}/20${yy.toString().padStart(2, "0")} ${hour
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
    };
  };
  const getFaultDescription = (eventType, subEventType) => {
    const faultDescription = FAULT_EVENT[subEventType] || "Unknown Fault Event";
    // Add sub event type information if present
    return faultDescription;
  };

  // Helper function to categorize system faults
  const parseSysFaultEvent = (hexData) => {
    if (!hexData || hexData.length < 36) {
      throw new Error("Invalid hex data for system fault event");
    }

    const eventType = parseInt(hexData.substr(6, 2), 16); // "04" = 4
    const subEventType = parseInt(hexData.substr(8, 2), 16); // "06" = 6
    const panelNo = parseInt(hexData.substr(10, 2), 16); // "07" = 7
    const loopNo = parseInt(hexData.substr(12, 2), 16); // "00" = 0

    // CORRECTED: Parse date/time as hexadecimal (they're stored as hex values)
    const DD = parseInt(hexData.substr(26, 2), 10); // "03" = 3
    const mm = parseInt(hexData.substr(28, 2), 10); // "23" = 35
    const yy = parseInt(hexData.substr(30, 2), 10); // "50" = 80
    const hour = parseInt(hexData.substr(32, 2), 10); // "01" = 1
    const minutes = parseInt(hexData.substr(34, 2), 10); // "20" = 32

    console.log("Parsing System Fault Event:", {
      eventType, // 4
      subEventType, // 6
      panelNo, // 7
      loopNo, // 0
      DD, // 3
      mm, // 35
      yy, // 80
      hour, // 1
      minutes, // 32
    });

    const faultDescription =
      SYS_FAULT_EVENT[subEventType] || "Unknown System Fault";
    // const faultCategory = getSysFaultCategory(subEventType);

    return {
      eventType,
      subEventType,
      panelNo,
      loopNo,
      date: {
        DD: DD.toString().padStart(2, "0"), // "03"
        mm: mm.toString().padStart(2, "0"), // "35"
        yy: yy.toString().padStart(2, "0"), // "80"
      },
      time: {
        hour: hour.toString().padStart(2, "0"), // "01"
        minutes: minutes.toString().padStart(2, "0"), // "32"
      },
      faultDescription, // Will be SYS_FAULT_EVENT[6]
      // faultCategory,
      formattedDateTime: `${DD.toString().padStart(2, "0")}/${mm
        .toString()
        .padStart(2, "0")}/20${yy.toString().padStart(2, "0")} ${hour
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      // Result: "03/35/2080 01:32"
      displayText: `P.NO - 7 | L.NO - 0 | ${faultDescription}`,
    };
  };

  function extractMqttlPayloadData(panel, payload) {
    let data = {};
    data.topic = panel.topic;
    data.panelType = panel.type;
    data.panelId = panel.id;
    data.panelName = panel.name;
    if (payload.startsWith("55550202")) {
      data = { ...data, ...parseFireEvent(payload) };
    } else if (payload.startsWith("55550203")) {
      data = { ...data, ...parseFaultEvent(payload) };
    } else if (payload.startsWith("55550204")) {
      data = { ...data, ...parseSysFaultEvent(payload) };
    } else if (payload.startsWith("55550205")) {
      data = { ...data, ...parseActivatedEvent(payload) };
    }
    return data;
  }

  const parseFireEvent = (hexData) => {
    if (!hexData || hexData.length < 40) {
      throw new Error("Invalid hex data");
    }

    const eventType = parseInt(hexData.substr(6, 2), 16);
    const subEventType = parseInt(hexData.substr(8, 2), 16);
    const panelNo = parseInt(hexData.substr(10, 2), 16);
    const loopNo = parseInt(hexData.substr(12, 2), 16);
    const deviceNo = parseInt(hexData.substr(14, 2), 16);
    const deviceType = parseInt(hexData.substr(16, 2), 16);
    const zoneX = parseInt(hexData.substr(18, 4), 16);
    const zoneY = parseInt(hexData.substr(22, 4), 16);
    const DD = parseInt(hexData.substr(26, 2), 10);
    const mm = parseInt(hexData.substr(28, 2), 10);
    const yy = parseInt(hexData.substr(30, 2), 10);
    const hour = parseInt(hexData.substr(32, 2), 10);
    const minutes = parseInt(hexData.substr(34, 2), 10);

    // Extract device text and convert from hex to ASCII
    const deviceTextHex = hexData.substr(38, 44);
    const deviceText = hexToString(deviceTextHex).replace(/\0/g, "").trim();

    return {
      eventType,
      subEventType,
      panelNo,
      loopNo,
      deviceNo,
      deviceType,
      deviceTypeText: DEV_TYPE[deviceType] || "UNKNOWN",
      zoneX,
      zoneY,
      date: {
        DD: DD.toString().padStart(2, "0"),
        mm: mm.toString().padStart(2, "0"),
        yy: yy.toString().padStart(2, "0"),
      },
      time: {
        hour: hour.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
      },
      deviceText,
      eventDescription: FIRE_EVENT[eventType] || "Unknown Event",
      formattedDateTime: `${DD.toString().padStart(2, "0")}/${mm
        .toString()
        .padStart(2, "0")}/20${yy.toString().padStart(2, "0")} ${hour
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
    };
  };
  const parseActivatedEvent = (hexData) => {
    if (!hexData || hexData.length < 40) {
      throw new Error("Invalid hex data");
    }

    const eventType = parseInt(hexData.substr(6, 2), 16);
    const subEventType = parseInt(hexData.substr(8, 2), 16);
    const panelNo = parseInt(hexData.substr(10, 2), 16);
    const loopNo = parseInt(hexData.substr(12, 2), 16);
    const deviceNo = parseInt(hexData.substr(14, 2), 16);
    const deviceType = parseInt(hexData.substr(16, 2), 16);
    const zoneX = parseInt(hexData.substr(18, 4), 16);
    const zoneY = parseInt(hexData.substr(22, 4), 16);
    const DD = parseInt(hexData.substr(26, 2), 10);
    const mm = parseInt(hexData.substr(28, 2), 10);
    const yy = parseInt(hexData.substr(30, 2), 10);
    const hour = parseInt(hexData.substr(32, 2), 10);
    const minutes = parseInt(hexData.substr(34, 2), 10);

    // Extract device text and convert from hex to ASCII
    const deviceTextHex = hexData.substr(38, 44);
    const deviceText = hexToString(deviceTextHex).replace(/\0/g, "").trim();

    return {
      eventType,
      subEventType,
      panelNo,
      loopNo,
      deviceNo,
      deviceType,
      deviceTypeText: DEV_TYPE[deviceType] || "UNKNOWN",
      zoneX,
      zoneY,
      date: {
        DD: DD.toString().padStart(2, "0"),
        mm: mm.toString().padStart(2, "0"),
        yy: yy.toString().padStart(2, "0"),
      },
      time: {
        hour: hour.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
      },
      deviceText,
      eventDescription: ACTIVATED[eventType] || "Unknown Event",
      formattedDateTime: `${DD.toString().padStart(2, "0")}/${mm
        .toString()
        .padStart(2, "0")}/20${yy.toString().padStart(2, "0")} ${hour
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
    };
  };

  // Helper function to convert hex to string
  const hexToString = (hex) => {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const hexByte = hex.substr(i, 2);
      if (hexByte !== "00") {
        str += String.fromCharCode(parseInt(hexByte, 16));
      }
    }
    return str;
  };

  // MQTT Command Function - FIXED: Added better validation
  const sendMqttCommand = (panelTopic, command) => {
    console.log(
      "🔹 Sending MQTT Command - Topic:",
      panelTopic,
      "Command:",
      command
    );

    if (!mqttClient) {
      console.error("❌ MQTT client not initialized");
      return;
    }

    if (!isConnected) {
      console.error("❌ MQTT not connected");
      return;
    }

    if (!panelTopic || !command) {
      console.error(
        "❌ Invalid parameters - panelTopic:",
        panelTopic,
        "command:",
        command
      );
      return;
    }

    const userId = userData?.user_id || "web";
    const userName = userData?.name || "user";
    const fullCommand = `1^${command}^${userId}^${userName}`;
    const topic = `${panelTopic}/command`;

    console.log("📤 Publishing command to:", topic, "Command:", fullCommand);

    mqttClient.publish(topic, fullCommand, { qos: 0 }, (error) => {
      if (error) {
        console.error("❌ Publish error:", error);
      } else {
        console.log("✅ Command sent successfully to:", topic);
      }
    });
  };

  // Your existing API calls
  useEffect(() => {
    console.log("🔹 Fetching panels and events...");

    const fetchPanels = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return;
      }

      try {
        console.log("🔹 Making API call to fetch panels...");
        const response = await axios.get(
          "https://api.m2rtechnomations.com/v2/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Panels API Response received:", response.data);

        if (response.data) {
          setDataResponse(response.data);
          setPanels(response.data.panels);
          let _led = {};
          console.log(
            "🔹 2222 Processing panel LED statuses,",
            response.data.panels
          );
          response.data.panels.forEach((panel) => {
            if (panel.led_status != null) {
              _led[panel.panel_topic.toString()] =
                panel.led_status.toString() || null;
            }
          });
          setPanelLedStatuses(_led);
          console.log(
            "panelLedStatusesRef.current:",
            panelLedStatusesRef.current
          );
          console.log("panelUseRef.currentt:", panelUseRef.current);

          const updatedStatus = {
            ...panelLedStatusesRef.current, // ⭐ Fresh latest
            ..._led,
          };
          console.log("Updated Status:", updatedStatus);
          const updatedPaneldata = {
            ...(panelUseRef.current = response.data.panels), // ⭐ Fresh latest
          };

          panelLedStatusesRef.current = updatedStatus; // ⭐ update ref
          panelUseRef.current = updatedPaneldata; // ⭐ update ref
          setPanelLedStatuses(updatedStatus);
          console.log("🔹 Set panels data, count:", updatedPaneldata);

          if (response.data.id) {
            fetchEvents(token);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching panels:", error);
      }
    };

    const fetchEvents = async (token) => {
      try {
        console.log("🔹 Making API call to fetch events...");
        const response = await axios.get(
          `https://api.m2rtechnomations.com/v2/events/temps/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ Events API Response received:", response.data);
        setEventsResponseAPI(response.data);
        const extractedEvents =
          extractPanelPayloadData(response.data || []) || [];
        setEvents(extractedEvents);
        panelUseRef.events = extractedEvents; // Set ref once
      } catch (error) {
        console.error("❌ Error fetching events:", error);
      }
    };

    fetchPanels();
    fetchEvents();
  }, []);

  function extractPanelPayloadData(data) {
    const extracted = data.map((item) => {
      let data = {};
      data.topic = item.topic;
      data.panelType = item.panel_type;
      data.panelId = item.panel_id;
      data.panelName = item.panel_name;
      if (item.payload.startsWith("55550202")) {
        data = { ...data, ...parseFireEvent(item.payload) };
      } else if (item.payload.startsWith("55550203")) {
        data = { ...data, ...parseFaultEvent(item.payload) };
      } else if (item.payload.startsWith("55550205")) {
        data = { ...data, ...parseActivatedEvent(item.payload) };
      } else if (item.payload.startsWith("55550204")) {
        data = { ...data, ...parseSysFaultEvent(item.payload) };
      }
      return data;
    });

    console.log("Extracting payload for panels:", extracted);

    // Optional: if you want to use this data elsewhere
    return extracted;
  }

  const combinedPanelsData = React.useMemo(() => {
    console.log("🔹 Computing combined panels data...");

    if (!dataResponse?.panels) return [];
    if (events.length === 0) return [];

    const panelsData = dataResponse.panels.map((panel) => {
      const matchedEventPanel = events.panels?.find((ev) => ev.id === panel.id);

      let panelType = "";
      if (panel.panel_type === 0) panelType = "Conventional";
      else if (panel.panel_type === 1) panelType = "Addressable";
      else if (panel.panel_type === 2) panelType = "Echo";
      else panelType = "Regal";

      // const panelEvents = matchedEventPanel?.events || [];

      const fireEvents = events.filter(
        (ev) => ev.eventType === 2 && ev.panelId === panel.id
      );
      const faultEvents = events.filter(
        (ev) => ev.eventType === 3 && ev.panelId === panel.id
      );
      const sysFaultEvents = events.filter(
        (ev) => ev.eventType === 4 && ev.panelId === panel.id
      );
      const activatedEvents = events.filter(
        (ev) => ev.eventType === 5 && ev.panelId === panel.id
      );

      return {
        id: panel.id || panel.serial_number || panel.panel_topic,
        name: panel.panel_name || "N/A",
        topic: panel.panel_topic || "",
        type: panelType,

        fireCount: fireEvents.length,
        faultCount: faultEvents.length,
        sysfaultCount: sysFaultEvents.length,
        activatedCount: activatedEvents.length,
        location: panel.location || "N/A",

        led_status: panel.led_status || null,
        fires: matchedEventPanel?.fires || [],
        faults: matchedEventPanel?.faults || [],
        sysfaults: matchedEventPanel?.sysfaults || [],
        status: 0,
        time: "",
        date: "",
        event: "02",
      };
    });
    console.log("panelsData", panelsData);
    panelsRef.current = panelsData;
    return panelsData;
  }, [dataResponse, events, eventsResponseAPI]); // 🔥 यही update करना था

  useEffect(() => {
    console.log("🔹 Setting combined panels...", combinedPanelsData);
    setCombinedPanels(combinedPanelsData);
  }, [combinedPanelsData]);

  useEffect(() => {
    if (combinedPanels.length > 0 && !selectedPanel) {
      console.log("🔹 Setting default selected panel");
      setSelectedPanel(combinedPanels[0]);
    }
  }, [combinedPanels, selectedPanel]);

  // Rest of your existing handlers remain the same...

  const handleTowerPopup = (topic) => {
    const matchedPanel = combinedPanels.find((p) => p.topic === topic);
    const getAllEvents = events.filter((ev) => ev.topic === topic);
    console.log("Matched Panel for Tower Popup:", getAllEvents, matchedPanel);
    if (matchedPanel) {
      setSelectedTower(matchedPanel);
      setSelectedPanelEvent(getAllEvents);

      setShowTowerPopup(true);
    }
  };

  function handleAllPanelClick() {
    // setActiveButton(false);
    setAllPanel(true);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(false);
    setPopupType(false);
  }

  function handleActivePanelClick() {
    // setActiveButton(false);
    setAllPanel(false);
    setActivePanel(true);
    setInctivePanel(false);
    setLocation(false);
    setPopupType(false);
  }

  function handleInactivePanelClick() {
    // setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(true);
    setLocation(false);
    setPopupType(false);
  }

  function handleLocationClick() {
    // setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(true);
    setPopupType(false);
  }

  function handleDashboardClick() {
    // Show main table and select first panel
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(false);
    setPopupType(false);

    // Auto-select the first panel in the current list and open its detail popup
    const first =
      Array.isArray(panelUseRef.current) && panelUseRef.current.length > 0
        ? panelUseRef.current[0]
        : null;
    if (!first) return;

    const livePanel =
      panelUseRef.current.find((p) => p.id === first.id) || first;
    setSelectedPanel(livePanel);
    setPopupPanel(livePanel);
    const relatedEvents = (events || []).filter(
      (ev) => ev.panelId === livePanel.id || ev.topic === livePanel.topic
    );
    setSelectedPanelEvent(relatedEvents);

    const type = (livePanel.type || "").toLowerCase();
    if (type === "addressable") setPopupType("addressable");
    else if (type === "conventional") setPopupType("conventional");
    else if (type === "regal") setPopupType("regal");
    else if (type === "echo") setPopupType("echo");
  }

  const handlePanelClick = (panel) => {
    if (!panel || !panel.type) return;

    // Always get the freshest panel from combinedPanels
    const livePanel =
      panelUseRef.current.find((p) => p.id === panel.id) || panel;
    // const selecLED = panelLedStatuses ? panelLedStatuses[panel.topic] : null;
    setSelectPanelLedStatuses(livePanel.led_status || null);
    const selectedPanelEvent = panelUseRef.events.filter(
      (ev) => ev.panelId === livePanel.id
    );

    setSelectedPanelEvent(selectedPanelEvent);
    setSelectedPanel(livePanel);
    setPopupPanel(livePanel);

    // setActiveButton(false);
    setAllPanel(false);
    setActivePanel(false);
    setInctivePanel(false);
    setLocation(false);

    const type = livePanel.type.toLowerCase();
    if (type === "addressable") setPopupType("addressable");
    else if (type === "conventional") setPopupType("conventional");
    else if (type === "regal") setPopupType("regal");
    else if (type === "echo") setPopupType("echo");
  };

  // Open tower-type components (TowerPopup, EchoEvent, ConventionalEvent, RegalEvent)
  const handleEyeClick = React.useCallback(
    (panel) => {
      if (!panel) return;
      const livePanel =
        panelUseRef.current.find((p) => p.id === panel.id) || panel;
      const relatedEvents = (events || []).filter(
        (ev) => ev.panelId === livePanel.id || ev.topic === livePanel.topic
      );
      setSelectedTower(livePanel);
      setSelectedPanelEvent(relatedEvents);
      setShowTowerPopup(true);
      setLocationSidebarOpen(false);
      setProfileOpen(false);
    },
    [events]
  );

  const handleCloseTypePopup = () => {
    setPopupType("");
    setPopupPanel(null);
  };

  useEffect(() => {
    if (combinedPanels && combinedPanels.length > 0) {
      const firePanel = combinedPanels.find((p) => p?.fire > 0);
      const defaultPanel = firePanel || combinedPanels[0];
      if (defaultPanel) {
        setSelectedPanel(defaultPanel);
        handlePanelClick(defaultPanel);
      }
    }
  }, [combinedPanels]);

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
        setLocationSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers optimized with useCallback to avoid re-creating on each render
  const handleProfileOpen = React.useCallback(() => setProfileOpen(true));
  const toggleLocationSidebar = React.useCallback(() => {
    setLocationSidebarOpen((prev) => !prev);
  }, []);

  // Memoized sidebar menu items for performance
  const sidebarMenuItems = React.useMemo(
    () => [
      {
        key: "home",
        to: "/dashboard",
        icon: <HiHome className="home_icon" />,
        label: "Home",
        onClick: handleDashboardClick,
      },
      {
        key: "profile",
        to: null,
        icon: <ImProfile className="home_icon" />,
        label: "Profile",
        onClick: handleProfileOpen,
      },
      {
        key: "panels",
        to: "",
        icon: <GrCalculator className="home_icon" />,
        label: "Panels",
        onClick: toggleLocationSidebar,
      },
      {
        key: "logout",
        to: "/",
        icon: <FiLogOut className="home_icon" />,
        label: "Logout",
        onClick: null,
      },
    ],
    [handleDashboardClick, handleProfileOpen, toggleLocationSidebar]
  );

  const addressablePopupData = {
    panel: panelPopupRef.current,
    selectedPanel,
    onClose: handleCloseTypePopup,
    sendMqttCommand,
    selectPanelLedStatuses,
    processLEDStatus,
    selectedPanelEvent,
  };
  const conventionalPopupData = {
    panel: popupPanel,
    onClose: handleCloseTypePopup,
    selectedPanel,
    selectPanelLedStatuses,
    processLEDStatus,
    sendMqttCommand,
  };
  const regalPopupData = {
    panel: popupPanel,
    onClose: handleCloseTypePopup,
    selectedPanel,
    selectPanelLedStatuses,
    processLEDStatus,
    sendMqttCommand,
    selectedPanelEvent,
  };
  const echoPopupData = {
    panel: popupPanel,
    onClose: handleCloseTypePopup,
    selectedPanel,
    selectPanelLedStatuses,
    processLEDStatus,
    sendMqttCommand,
  };
const [activePanels, setActivePanels] = useState([]);
const [inactivePanels, setInactivePanels] = useState([]);
const activeCount = activePanels.length;
const inactiveCount = inactivePanels.length;

function getMinutesBetweenDates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  if (isNaN(d1) || isNaN(d2)) return null;
  return (d2 - d1) / 60000;
}

useEffect(() => {
  const intervalId = setInterval(() => {
    const now = new Date();
    let hasChange = false;

    const updatedPanels = panelUseRef.current.map(panel => {
      const minutesDiff = panel?.last_update
        ? getMinutesBetweenDates(panel.last_update, now)
        : null;

      const isActive = minutesDiff !== null && minutesDiff < 1;

      if (panel.is_active !== isActive) {
        hasChange = true; // 🔑 change detected
      }

      return {
        ...panel,
        is_active: isActive,
      };
    });

    // ✅ Update ONLY if something changed
    if (hasChange) {
      panelUseRef.current = updatedPanels;

      setActivePanels(updatedPanels.filter(p => p.is_active));
      setInactivePanels(updatedPanels.filter(p => !p.is_active));
    }

  }, 60_000); // ✅ 1 minute

  return () => clearInterval(intervalId);
}, []);


  return (
    <div className="main-container">
      {/* Profile Sidebar (rendered at top-level to avoid being nested inside sidebar) */}
      {profileOpen && (
        <div
          className="profile_sidebar_overlay"
          onClick={() => setProfileOpen(false)}
        >
          <div className="profile_sidebar" onClick={(e) => e.stopPropagation()}>
            <ProfileView dataResponse={userData} />

            <button className="close_btn" onClick={() => setProfileOpen(false)}>
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Mobile topbar: show compact menu button and dropdown on small screens */}
      <div className="mobile-topbar">
        <button
          className="mobile-drawer-btn"
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen((s) => !s);
          }}
          aria-label="Open menu"
        >
          <LuAlignJustify className="home_icon" />
        </button>

        {mobileMenuOpen && (
          <div
            className="mobile-menu-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarMenuItems.slice(1).map((item) => {
              const content = (
                <>
                  {item.icon}
                  <span className="label">{item.label}</span>
                </>
              );

              const onSelect = () => {
                // Close dropdown first to avoid z-index/content overlap
                setMobileMenuOpen(false);
                // If profile item, explicitly open profile overlay
                if (item.key === "profile") {
                  setProfileOpen(true);
                  return;
                }
                if (item.onClick) item.onClick();
              };

              return item.to ? (
                <Link
                  key={item.key}
                  className="log"
                  to={item.to}
                  onClick={() => onSelect()}
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={item.key}
                  role="button"
                  tabIndex={0}
                  className="log"
                  onClick={() => onSelect()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect();
                  }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="outer-toggle-container">
        <div
          ref={sidebarRef}
          className={`sidebar-container ${isOpen ? "open" : ""}`}
        >
          {/* Profile Sidebar moved to top-level so it isn't hidden by mobile layout */}

          {/* Sidebar menu: always rendered, CSS handles collapsed/expanded labels */}
          <div className={`sidebar-menu ${isOpen ? "expanded" : "collapsed"}`}>
            {sidebarMenuItems.map((item) => {
              const content = (
                <>
                  {item.icon}
                  <span className="label">{item.label}</span>
                </>
              );

              return item.to ? (
                <Link
                  key={item.key}
                  className="log"
                  to={item.to}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                  }}
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={item.key}
                  role="button"
                  tabIndex={0}
                  className="log"
                  onClick={() => {
                    if (item.onClick) item.onClick();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (item.onClick) item.onClick();
                    }
                  }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`sub-maincontainer1 ${isOpen ? "shrink" : ""}`}>
          <div className="tower-container" style={{ position: "relative" }}>
            <div
              className={`location-sidebar${
                locationSidebarOpen ? " open" : ""
              }`}
              ref={locationSidebarRef}
            >
              <div className="location-sidebar-header">Panels</div>
              <ul className="location-list">
                {panels?.map((v, i) => (
                  <li
                    key={i}
                    className="location-list-item"
                    onClick={() => handleTowerPopup(v.panel_topic)}
                  >
                    {v.panel_name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="tower-heading">
              {showTowerPopup && selectedTower && (
                <>
                  {selectedTower.type === "Addressable" && (
                    <TowerPopup
                      panel={selectedTower}
                      onClose={() => setShowTowerPopup(false)}
                      sendMqttCommand={sendMqttCommand}
                      selectedPanelEvent={selectedPanelEvent}
                      processLEDStatus={processLEDStatus}
                    />
                  )}
                  {selectedTower.type === "Echo" && (
                    <EchoEvent
                      panel={selectedTower}
                      onClose={() => setShowTowerPopup(false)}
                      sendMqttCommand={sendMqttCommand}
                      // updateCurrentData={updateCurrentData}
                      selectedPanelEvent={selectedPanelEvent}
                      selectedPanel={selectedPanel}
                      processLEDStatus={processLEDStatus}
                    />
                  )}
                  {selectedTower.type === "Conventional" && (
                    <ConventionalEvent
                      panel={selectedTower}
                      onClose={() => setShowTowerPopup(false)}
                      sendMqttCommand={sendMqttCommand}
                      // updateCurrentData={updateCurrentData}
                      selectedPanelEvent={selectedPanelEvent}
                      selectedPanel={selectedPanel}
                      processLEDStatus={processLEDStatus}
                    />
                  )}
                  {selectedTower.type === "Regal" && (
                    <RegalEvent
                      panel={selectedTower}
                      onClose={() => setShowTowerPopup(false)}
                      sendMqttCommand={sendMqttCommand}
                      // updateCurrentData={updateCurrentData}
                      selectedPanelEvent={selectedPanelEvent}
                      selectedPanel={selectedPanel}
                      processLEDStatus={processLEDStatus}
                    />
                  )}
                </>
              )}
            </div>

            <div className="stats-container">
              <div className="stat-card img1" onClick={handleAllPanelClick}>
                <div className="stat-info">
                  <h4>Panel</h4>
                  <p>{String(combinedPanels.length).padStart(2, "0")}</p>
                </div>
                <div className="stat-icon blue">
                  <GrCalculator />
                </div>
              </div>

              <div className="stat-card img2" onClick={handleActivePanelClick}>
                <div className="stat-info">
                  <h4>Active Panel</h4>
                  <p>{String(activeCount).padStart(2, "0")}</p>
                </div>
                <div className="stat-icon lightning">
                  <AiOutlineThunderbolt />
                </div>
              </div>

              <div
                className="stat-card img3"
                onClick={handleInactivePanelClick}
              >
                <div className="stat-info">
                  <h4>Inactive Panel</h4>
                  <p>{String(inactiveCount).padStart(2, "0")}</p>
                </div>
                <div className="stat-icon red">
                  <PiProhibitFill />
                </div>
              </div>

              <div className="stat-card img4" onClick={handleLocationClick}>
                <div className="stat-info">
                  <h4>Location</h4>
                  <p>&nbsp;</p>
                </div>
                <div className="stat-icon blue">
                  <FaLocationDot />
                </div>
              </div>
            </div>
            <div className="togleButton">
              <button onClick={() => setIsBarView(!isBarView)}>
                {isBarView ? "Table View" : "BarGraph View"}
              </button>
            </div>
            <div
              className="view-animated-container"
              key={isBarView ? "bar" : "table"}
            >
              {isBarView ? (
                <div className="graph-main-container">
                  <div className="graph-card">
                    <div className="graph-wrapper">
                      <PanelBarGraph panels={panelUseRef.current || []} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="table-main-container">
                  <div className="table-card">
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Fire</th>
                            <th>Fault</th>
                            <th>Sys Fault</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(panelUseRef.current) &&
                            panelUseRef.current.map((panel, index) => (
                              <tr
                                key={panel.id}
                                className="table-row slide-in"
                                onClick={() => handlePanelClick(panel)}
                                style={{
                                  ...(selectedPanel?.id === panel.id
                                    ? { backgroundColor: "#d7e9ff" }
                                    : {}),
                                  cursor: "pointer",
                                  animationDelay: `${index * 70}ms`,
                                }}
                              >
                                <td>
                                  <span className="badge panel">
                                    {index + 1}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge panel">
                                    {panel.name}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge type">
                                    {panel?.type}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge fire">
                                    {panel.fireCount}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge fault">
                                    {panel.faultCount}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge sysfault">
                                    {panel.sysfaultCount}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="badge eye-icon"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEyeClick(panel);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEyeClick(panel);
                                      }
                                    }}
                                  >
                                    <IoEyeOutline />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {allPanel === true && (
            <div className="event-container1">
              <Panels
                ActiveInactive={panelUseRef.current}
                dataResponse={dataResponse}
                eventsResponseAPI={eventsResponseAPI}
              />
            </div>
          )}

          {activePanel === true && (
            <div className="event-container1">
              <ActivePanel
                dataResponse={dataResponse}
                eventsResponseAPI={eventsResponseAPI}
              />
            </div>
          )}

          {inactivePanel === true && (
            <div className="event-container1">
              <InactivePanel />
            </div>
          )}

          {location === true && (
            <div className="event-container1">
              <PanelLocations dataResponse={dataResponse} />
            </div>
          )}

          {popupType === "addressable" && (
            <AddressablePopup data={addressablePopupData} />
          )}
          {popupType === "conventional" && (
            <ConventionalPopup data={conventionalPopupData} />
          )}
          {popupType === "regal" && <RegalPopup data={regalPopupData} />}
          {popupType === "echo" && <EchoPopup data={echoPopupData} />}
        </div>
      </div>
    </div>
  );
}
