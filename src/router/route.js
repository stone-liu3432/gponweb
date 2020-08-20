"use strict";
import login from "@/views/page/login";

const main = () =>
    import(/* webpackChunkName: "main-page" */ "@/views/page/main");

const status = () =>
    import(/* webpackChunkName: "main-page" */ "@/views/page/status");

const sysSetting = () =>
    import(/* webpackChunkName: "system" */ "@/views/page/sysSetting");

const route = [
    {
        path: "/",
        component: login,
        meta: { index: 1 },
    },
    {
        path: "/login",
        component: login,
        meta: { index: 1 },
    },
    {
        path: "/main",
        meta: {
            requireAuth: true,
            index: 2,
        },
        component: main,
        children: [
            {
                path: "",
                meta: {
                    requireAuth: true,
                },
                component: status,
            },
        ],
    },
    {
        path: "/sys-setting",
        meta: {
            requireAuth: true,
        },
        component: sysSetting,
    },
];

export default route;
