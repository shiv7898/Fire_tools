export const DEV_TYPE = {
    0: "NOT_REGISTERED",
    1: "SMOKE",
    2: "HEAT",
    3: "MCP",
    4: "MONITOR_MODULE",
    5: "INPUT_MODULE",
    6: "CONTROL_MODULE",
    7: "MULTI_OR",
    8: "MULTI_AND",
    9: "INPUT_MODULE_2_WAY",
    10: "MONITOR_MODULE_2_WAY",
    11: "CONTROL_MODULE_2_WAY",
    12: "COMMON",
    13: "L96_INPUT",
    14: "L96_OUTPUT",
    15: "CAMERA"
};

export const FIRE_EVENT = {
    1: "Fire Event",
    2: "Fire Event",
    3: "Fire Event",
    17: "Fire Event",
    18: "Fire Event",
    22: "Fire in Zone Event",
    24: "Zone Pre-Alarm Event",
    25: "Camera On Fire"
};

export const FAULT_EVENT = {
    1: "Missing Event",
    5: "Device Type Mismatch Event",
    6: "Device Config Mismatch Event",
    9: "Device Dirty Event",
    11: "Fault Event",
    12: "Fault Event Module 1",
    13: "Fault Event Module 2",
    15: "Motherboard Supply Relay Event",
    16: "Motherboard Supply Input Event",
    17: "Fault in Zone Event",
    19: "Device Configuration Error",
    21: "Device Duplicate",
    24: "MM Zone Fault Module",
    25: "MM Zone Fault Module 1",
    26: "MM Zone Fault Module 2",
};

export const REGAL_FAULT_EVENT = {
    4: "Open Event",
    5: "Short Event",
    6: "Iso Event",
};

export const SYS_FAULT_EVENT = {
    1: "MAINS FAILURE",
    2: "MAINS VOLTAGE LOW",
    3: "FUSE BLOWN",
    5: "BATT DEEP DISCHARGE",
    6: "BATT LOW",
    7: "BATT DISCONNECTED",
    8: "BATT REVERSE",
    9: "BATT TEMP OVER",
    10: "BATT SHORT",
    12: "EARTH FAULT",
    13: "SHORT CKT OVER LOAD",
    16: "NETWORK COMM FAULT",
    17: "NETWORK PANEL MISSING",
    18: "NETWORK CAN BUS ERROR",
    19: "DUPLICATE PANEL FOUND",
    20: "NEW PANEL FOUND",
    22: "PRINTER NOT AVAILABLE",
    23: "NO PRINTER PAPER",
    24: "PRINTER TEMP OVER",
    26: "MODBUS COMM FAULT",
    28: "LOOP SHORT",
    29: "LOOP POSITIVE BREAK",
    30: "LOOP NEGATIVE BREAK",
    31: "LOOP IN SHORT",
    32: "LOOP OUT SHORT",
    35: "MB SUP RELAY",
    36: "MB SUP INPUT",
    37: "L96 COMM FAULT",
    39: "DISPLAY COMM SYS FLT",
    40: "TFT LCD DISPLAY SYS FLT",
    41: "RTC SYS FAULT",
    42: "EPROM 1 MEMORY SYS FLT",
    43: "EPROM 2 MEMORY SYS FLT",
    44: "MB EXP 1 SYS FLT",
    45: "MB EXP 2 SYS FLT",
    46: "DIS LEFT EXP SYS FLT",
    47: "DIS RIGHT EXP SYS FLT",
    51: "LOOP CARD COMM. FAULT",
    52: "LOOP CARD MISSING",
    53: "LC CAN BUS ERROR",
    54: "DUPLICATE LC FOUND",
    55: "NEW LOOP CARD FOUND",
    57: "LOOP CARD MEMORY FAULT",
    58: "LC EXPENDER",
    61: "LC DATA MISMATCH",
    62: "LC SERIAL NO MISMATCH",
    65: "PWR SPLY COMM FAULT",

};

export const ACTIVATED = {
    0: "No Event",
    5: "Input Event",
    6: "Input Event Module 1",
    7: "Input Event Module 2",
    9: "Activated Event",
    10: "Activated Event Module 1",
    11: "Activated Event Module 2",
    13: "Deactivated Event",
    14: "Deactivated Event Module 1",
    15: "Deactivated Event Module 2",
    20: "MB Input Event",
    21: "MB Relay Event",
    26: "Timer Activated Event",
  };




  // constants.jsx
export const ACTIVITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const ACTIVITY_TIMEOUT = 1 * 60 * 1000; // 15 minutes in milliseconds