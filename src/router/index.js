"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./route";
import store from "@/store";
import { ADVANCED_MENU } from "@/utils/commonData";

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

router.afterEach((to, from) => {
    const path = to.path.slice(1),
        isNav = store.state.navMenu.some(item => item.name === path),
        isAdv = store.state.advMenu.some(item => item.name === path);
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
