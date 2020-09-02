import filter from "./filter";

export default {
    install(Vue) {
        Vue.component("nmsFilter", filter);
    },
};
