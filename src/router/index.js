"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./route";

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

router.afterEach((to, from) => {});

export default router;
