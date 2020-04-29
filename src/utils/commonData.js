// 通用数据
"use strict";

export const SWITCH = ["disable", "enable"];
export const LINK_STATUS = ["link_down", "link_up"];
export const STATUS = ["offline", "online"];

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
