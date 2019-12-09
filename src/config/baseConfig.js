import ElementUI from "@/config/element";
import VueI18n from "vue-i18n";
import locale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import axios from "@/config/axios";

const __DEV__ = process.env.NODE_ENV === "development";

if (__DEV__) {
    require("./mock.js");
}

function baseConfig(Vue) {
    // to do
    Vue.config.productionTip = false;

    Vue.use(VueI18n);
    const i18n = new VueI18n({
        locale: sessionStorage.getItem("lang") || "en",
        messages: {
            en: enLocale,
            zh: zhLocale
        }
    });
    locale.i18n((key, value) => i18n.t(key, value));
    Vue.use(ElementUI, { size: "small", zIndex: 1000, locale });

    Vue.prototype.$http = axios;
    Vue.prototype.$is_dev = _ => __DEV__;
}

export default baseConfig;
