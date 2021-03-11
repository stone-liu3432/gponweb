"use strict";
/**
 * mock.js入口文件
 * 所有的mock数据由此引入
 * 每一个page(或一个路由跳转对象)对应一个mock
 */
import Mock from "@/mock";

Mock.mock("/system_lang", "get", {
    code: 1,
    message: "success",
    data: { lang: "zh" },
});

import "@/mock/page/login";
import "@/mock/page/main";
import "@/mock/page/header";
import "@/mock/page/status";
import "@/mock/page/onuAllow";
import "@/mock/content/system/runningStatus";
import "@/mock/content/system/devMgmt";
import "@/mock/content/system/diagonose";
import "@/mock/content/system/remoteMgmt";
import "@/mock/content/system/upgrade";
import "@/mock/content/system/time";
import "@/mock/content/system/service";
import "@/mock/content/system/alarm";
import "@/mock/content/system/userMgmt";
import "@/mock/content/switch/portInfo";
import "@/mock/content/switch/perfInfo";
import "@/mock/content/switch/portConfig";
import "@/mock/content/switch/portVlan";
import "@/mock/content/switch/loopDetect";
import "@/mock/content/switch/portIsolation";
import "@/mock/content/protocol/rstp";
import "@/mock/content/protocol/igmp";
import "@/mock/content/protocol/dhcp";
import "@/mock/content/protocol/mstp";
import "@/mock/content/protocol/dhcpv6";
import "@/mock/content/tempMgmt/dbaMgmt";
import "@/mock/content/tempMgmt/lineMgmt";
import "@/mock/content/tempMgmt/srvMgmt";
import "@/mock/content/virtualPort/virtualPort";
import "@/mock/content/pon/optical";
import "@/mock/content/pon/ontBasicInfo";
import "@/mock/content/pon/ontPortInfo";
import "@/mock/content/pon/opVlan";
import "@/mock/content/pon/ponSetting";
import "@/mock/content/acl-qos/timerange";
import "@/mock/content/acl-qos/aclMgmt";
import "@/mock/content/acl-qos/packetFilter";
import "@/mock/content/acl-qos/qos";
import "@/mock/content/route/staticRoute";
import "@/mock/content/route/arp";
import "@/mock/content/macMgmt/macMgmt";
import "@/mock/content/linkAggregation/linkAggregation";
import "@/mock/content/vlanMgmt/vlanMgmt";
import "@/mock/content/system/log";
import "@/mock/content/pon/ontPerf";
import "@/mock/content/pon/ontDeny";
import "@/mock/content/system/sysAcl";
import "@/mock/content/pon/ontUpgrade";
