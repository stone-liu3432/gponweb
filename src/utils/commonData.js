// 通用数据
"use strict";

export const SWITCH = ["disable", "enable"];
export const LINK_STATUS = ["link_down", "link_up"];
export const STATUS = ["offline", "online"];
// 对应状态的开关按钮文字， 0关闭状态时，文字应显示为开启(on)，反之则为关闭(off)
export const BUTTON_TEXT = ["on", "off"];

export const ADVANCED_MENU = "advanced_setting";

// DBA模板带宽类型
export const DBA_PROFILE_TYPES = {
    1: ["fix"],
    2: ["assure"],
    3: ["assure", "max"],
    4: ["max"],
    5: ["fix", "assure", "max"],
};

// 线路模板，映射模式枚举
export const MAPPING_MODES = {
    1: "VLAN",
    2: "Priority",
    3: "TCI",
    4: "Port",
};

// VLAN模式枚举
export const VLAN_MODES = {
    1: "transparent",
    2: "natvie-vlan",
    3: "translation",
    4: "qinq",
};

// uni 端口类型
export const UNI_TYPES = ["eth", "iphost"];

// tag action
export const TAG_ACTIONS = {
    1: "Default",
    2: "Transparent",
    3: "Translate",
    4: "Translate-and-add",
    5: "Add-double",
    6: "Untag",
};

// virtual port
export const SVP_TYPE_MAP = { 1: "untag", 2: "user_vlan" };

export const INSTALL_MODE_MAP = { 1: "auto", 2: "manual" };

// ONT
export const ONT_AUTH_MODES = ["SN AUTH", "LOID AUTH", "LOID+PASS AUTH"];
export const ONT_STATES = ["inactive", "active"];
export const ONT_RSTATES = ["initial", "online", "offline"];
export const ONT_CSTATES = ["initial", "normal", "fail"];
export const ONT_MSTATES = ["initial", "match", "mismatch"];

// IGMP
export const IGMP_MODES = ["disable", "snooping", "proxy"];
export const IGMP_PROTOCOL_POLICIES = ["pass", "discard"];
export const MULTICAST_ACTIONS = ["dynamic", "static"];
export const MULTICAST_UNKNOWN_POLICYS = ["transparent", "discard"];

// DHCP
export const RELAY_POLICY = ["standard", "option60"];
export const OPTION82_POLICY = ["reserve", "drop", "replace"];
export const OPTION82_CIRCUIT = ["", "VLAN+PORT"];
export const OPTION82_REMOTE = ["", "OLT MAC"];
export const ENTRY_STATUS = ["invalid", "valid"];

// mstp
export const PORT_STATE_MAP = [
    "Discarding",
    "Discarding",
    "Learning",
    "Forwarding",
    "Discarding",
];

export const PORT_ROLE_MAP = [
    "Disable",
    "Root",
    "Designated",
    "Alternate",
    "Backup",
    "Master",
];

export const ADMIN_P2P_MAP = ["auto", "true", "false"];

// acl-qos
export const DAY_MAP = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Daily",
    "Weekend",
    "Working-day",
];

export const ACL_TYPE_MAP = ["basic", "advanced", "link"];

export const ACL_ACTION_MAP = { 1: "Deny", 2: "Permit" };

export const PROTOCOL_MAP = ["icmp", "udp", "tcp", "ip", "ipinip"];

// static route
export const STATIC_ROUTE_PROTOCOL_MAP = ["Static", "Direct"];
export const STATIC_ROUTE_STATUS_MAP = { 1: "Reachable", 2: "Unreachable" };

// mac flags
export const MAC_FLAGS_MAP = {
    1: "mac_type",
    2: "port_id",
    4: "vlan_id",
    8: "macaddr",
};

//  mac type
export const MAC_TYPE_MAP = ["dynamic", "static", "blackhole", "all"];

// link aggregation
export const PSC_MAP = {
    1: "src-mac",
    2: "dest-mac",
    3: "src-dest-mac",
    4: "src-ip",
    5: "dest-ip",
    6: "src-dest-ip",
};

// alarm 相关
export const LEVEL = ["error", "warning", "warning", "info"];
export const ALARM_TYPE_MAP = { 1: "alarm", 2: "message" };
export const MESSAGE_ACTION_MAP = {
    1: "register",
    2: "timeout",
    3: "heartbeats",
};

// log level
export const LOG_LEVEL = [
    "emergency",
    "alert",
    "critical",
    "error",
    "warning",
    "information",
    "notice",
    "debug",
];

// user management
export const USER_LEVEL = [
    "manu",
    "diag",
    "super",
    "admin",
    "operator",
    "common",
];

// port vlan
export const PORT_TYPE_MAP = { 1: "Access", 2: "Trunk", 3: "Hybrid" };

// port isolation
export const PORT_GROUP_MODE_MAP = { 1: "isolation", 2: "inter_working" };

// pon 模块类型
export const TRX_TYPE_MAP = [
    "SourcePhotonics-0",
    "Superxon B+",
    "LIGENT LTE3680M",
    "Source Photonics",
    "LIGENT LTE3680P C+",
    "Any",
    "Any reset guard",
    "Any reset preamble",
    "WTD RTXM167 526 C+",
    "WTD RTXM167 522 B+",
    "LIGENT HiSense LTE3680P-BC",
    "Superxon C+",
    "WTD RTXM167 521",
    "LTE3678",
    "Superxon SOGP4321-PSGA",
    "gpon general 1",
];
