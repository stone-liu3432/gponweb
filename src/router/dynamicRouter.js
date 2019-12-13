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
        )
};

export default data;
