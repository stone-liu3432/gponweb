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
