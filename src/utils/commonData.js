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
};

// VLAN模式枚举
export const VLAN_MODES = {
    1: "transparent",
    2: "tag",
    3: "translation",
    4: "qinq",
};

// uni 端口类型
export const UNI_TYPES = ["eth", "iphost"];

// tag action
export const TAG_ACTIONS = {
    1: "default",
    2: "transparent",
    3: "translate",
    4: "translate-and-add",
    5: "add-double",
};

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

export const ACL_ACTION_MAP = { 1: "Deny", 2: "Permit" };

export const PROTOCOL_MAP = ["icmp", "udp", "tcp", "ip", "ipinip"];
