import ElementUI from "@/config/element";
import VueI18n from "vue-i18n";
import locale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import axios from "@/config/axios";
import { isFunction, isPlainObject } from "@/utils/common";
import store from "../store";

const __DEV__ = process.env.NODE_ENV === "development";

if (__DEV__) {
    require("./mock.js");
}

const overrideMethods = Vue => {
    const cfm = Vue.prototype.$confirm;
    const msg = Vue.prototype.$message;
    // 替换默认的 确认/取消 按钮的文本
    Vue.prototype.$confirm = (content, title, options) => {
        if (isPlainObject(title)) {
            options = title;
            title = "";
        }
        const {
            getters: { $lang }
        } = store;
        if (isFunction($lang)) {
            return cfm(
                content,
                title,
                Object.assign(
                    {
                        cancelButtonText: $lang("cancel"),
                        confirmButtonText: $lang("apply")
                    },
                    options
                )
            );
        }
        return cfm(content, title, options);
    };
};

const baseConfig = Vue => {
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
    Vue.use(ElementUI, { size: "small", zIndex: 1000 });

    Vue.prototype.$http = axios;
    Vue.prototype.$is_dev = _ => __DEV__;

    overrideMethods(Vue);
    return { i18n };
};

export default baseConfig;
