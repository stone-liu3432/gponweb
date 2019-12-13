"use strict";
import login from "@/views/page/login";

const main = () =>
    import(/* webpackChunkName: "main-page" */ "@/views/page/main");

const route = [
    {
        path: "/",
        component: login,
        meta: { index: 1 }
    },
    {
        path: "/login",
        component: login,
        meta: { index: 1 }
    },
    {
        path: "/main",
        meta: {
            requireAuth: true,
            index: 2
        },
        component: main
    }
];

export default route;
