import "babel-polyfill";
import Vue from "vue";
import hsgq from "./Hsgq";
import router from "./router";
import store from "./store";
import baseConfig from "@/config/baseConfig";

const { i18n } = baseConfig(Vue);

new Vue({
    router,
    i18n,
    store,
    render: (h) => h(hsgq),
}).$mount("#app");
