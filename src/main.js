import "babel-polyfill";
import Vue from "vue";
import hsgq from "./Hsgq";
import router from "./router";
import store from "./store";
import baseConfig from "@/config/baseConfig";

baseConfig(Vue);

new Vue({
    router,
    store,
    render: h => h(hsgq)
}).$mount("#app");
