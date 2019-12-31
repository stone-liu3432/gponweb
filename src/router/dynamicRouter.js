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
        )
};

export default data;
