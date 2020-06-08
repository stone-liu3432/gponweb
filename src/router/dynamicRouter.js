"use strict";
/**
 * 用于映射menu和组件，
 * 加载的路由列表由获取的menu菜单来确定
 */

const data = {
    status: () =>
        import(/* webpackChunkName: "main-page" */ "@/views/page/status"),
    onu_allow: () =>
        import(/* webpackChunkName: "main-page" */ "@/views/page/onuAllow"),
    template_mgmt: () =>
        import(/* webpackChunkName: "main-page" */ "@/views/page/tempMgmt"),
    virtual_port: () =>
        import(/* webpackChunkName: "main-page" */ "@/views/page/virtualPort"),
    advanced_setting: () =>
        import(
            /* webpackChunkName: "main-page" */ "@/views/page/advancedSetting"
        ),
    running_status: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/runningStatus"
        ),
    dev_mgmt: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/devMgmt"
        ),
    diagonose: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/diagonose"
        ),
    remote_mgmt: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/remoteMgmt"
        ),
    upgrade: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/upgrade"
        ),
    time: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/time"
        ),
    service: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/service"
        ),
    alarm: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/alarm"
        ),
    user_mgmt: () =>
        import(
            /* webpackChunkName: "system" */ "@/views/advSetting/system/userMgmt"
        ),
    port_info: () =>
        import(
            /* webpackChunkName: "switch" */ "@/views/advSetting/switch/portInfo"
        ),
    perf_info: () =>
        import(
            /* webpackChunkName: "switch" */ "@/views/advSetting/switch/perfInfo"
        ),
    port_cfg: () =>
        import(
            /* webpackChunkName: "switch" */ "@/views/advSetting/switch/portConfig"
        ),
    port_vlan: () =>
        import(
            /* webpackChunkName: "switch" */ "@/views/advSetting/switch/portVlan"
        ),
    loop_detect: () =>
        import(
            /* webpackChunkName: "switch" */ "@/views/advSetting/switch/loopDetect"
        ),
    port_isolation: () =>
        import(
            /* webpackChunkName: "switch" */ "@/views/advSetting/switch/portIsolation"
        ),
    link_aggregation: () =>
        import(
            /* webpackChunkName: "switch" */ "@/views/advSetting/linkAggregation/linkAggregation"
        ),
    pon_optical: () =>
        import(
            /* webpackChunkName: "pon" */ "@/views/advSetting/gponMgmt/optical"
        ),
    onu_basic_info: () =>
        import(
            /* webpackChunkName: "pon" */ "@/views/advSetting/gponMgmt/ontBasicInfo"
        ),
    onu_port_info: () =>
        import(
            /* webpackChunkName: "pon" */ "@/views/advSetting/gponMgmt/ontPortInfo"
        ),
    op_vlan: () =>
        import(
            /* webpackChunkName: "pon" */ "@/views/advSetting/gponMgmt/opVlan"
        ),
    onu_port_cfg: () =>
        import(
            /* webpackChunkName: "pon" */ "@/views/advSetting/gponMgmt/ontPortConfig"
        ),
    pon_setting: () =>
        import(
            /* webpackChunkName: "pon" */ "@/views/advSetting/gponMgmt/ponSetting"
        ),
    igmp: () =>
        import(
            /* webpackChunkName: "protocol" */ "@/views/advSetting/protocol/igmp"
        ),
    dhcp: () =>
        import(
            /* webpackChunkName: "protocol" */ "@/views/advSetting/protocol/dhcp"
        ),
    mstp: () =>
        import(
            /* webpackChunkName: "protocol" */ "@/views/advSetting/protocol/mstp"
        ),
    rstp: () =>
        import(
            /* webpackChunkName: "protocol" */ "@/views/advSetting/protocol/rstp"
        ),
    time_range: () =>
        import(
            /* webpackChunkName: "acl-qos" */ "@/views/advSetting/acl-qos/timerange"
        ),
    acl_mgmt: () =>
        import(
            /* webpackChunkName: "acl-qos" */ "@/views/advSetting/acl-qos/aclMgmt"
        ),
    packet_filter: () =>
        import(
            /* webpackChunkName: "acl-qos" */ "@/views/advSetting/acl-qos/packetFilter"
        ),
    QoS: () =>
        import(
            /* webpackChunkName: "acl-qos" */ "@/views/advSetting/acl-qos/qos"
        ),
    route_mgmt: () =>
        import(
            /* webpackChunkName: "route" */ "@/views/advSetting/route/staticRoute"
        ),
    ARP: () =>
        import(/* webpackChunkName: "route" */ "@/views/advSetting/route/arp"),
    mac_mgmt: () =>
        import(
            /* webpackChunkName: "layer2-mgmt" */ "@/views/advSetting/macMgmt/macMgmt"
        ),
    vlan_mgmt: () =>
        import(
            /* webpackChunkName: "layer2-mgmt" */ "@/views/advSetting/vlanMgmt/vlanMgmt"
        ),
};

export default data;
