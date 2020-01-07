"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./route";
import store from "@/store";
import { ADVANCED_MENU } from "@/utils/commonData";
import { isArray } from "@/utils/common";

Vue.use(VueRouter);

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (process.env.NODE_ENV === "development") {
            next();
        } else {
            if (sessionStorage.getItem("x-token")) {
                next();
            } else {
                sessionStorage.removeItem("user");
                next({ path: "/login" });
            }
        }
    } else {
        if (!sessionStorage.getItem("x-token")) {
            next();
        } else {
            next("/main");
        }
    }
});

// 路由跳转完成后缓存当前页的path，用于刷新页面后恢复
router.afterEach((to, from) => {
    const path = to.path.slice(1),
        isNav = store.state.navMenu.some(item => item.name === path),
        adv = store.state.advMenu;
    let isAdv = false;
    if (!isNav && path !== "main" && path !== "login") {
        adv.forEach(item => {
            // 带折叠菜单(children)的一级菜单不会产生路由跳转
            // 要判断的是不带子菜单的一级菜单和所有二级菜单
            if (isArray(item.children)) {
                item.children.forEach(_item => {
                    if (_item.name === path) {
                        isAdv = true;
                    }
                });
            } else if (item.name === path) {
                isAdv = true;
            }
        });
    }
    if (isNav && path !== ADVANCED_MENU) {
        sessionStorage.removeItem("advMenu");
    }
    if (isAdv) {
        sessionStorage.setItem("advMenu", path);
    }
    if (path === "login") {
        const lang = sessionStorage.getItem("lang");
        sessionStorage.clear();
        sessionStorage.setItem("lang", lang);
    }
});

export default router;
