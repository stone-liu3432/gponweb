"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./route";
import store from "@/store";
// 高级菜单的路径key
const ADVANCED_MENU = "advanced_setting";

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
        nav = store.state.navMenu,
        isNav = nav.some(item => item.name === path);
    if (isNav && path !== ADVANCED_MENU) {
        sessionStorage.removeItem("advMenu");
    }
});

export default router;
