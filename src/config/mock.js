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
    data: { lang: "zh" }
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
import "@/mock/content/switch/perfInfo";
import "@/mock/content/switch/portConfig";
