import "@/config/element";
import VueI18n from "vue-i18n";
import locale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import axios from "@/config/axios";
import { isFunction, isPlainObject, isUndef } from "@/utils/common";
import store from "../store";
import pageHeader from "@/views/common/pageHeader";
import nmsPanel from "@/views/common/panel";
import nmsPortCheckbox from "@/views/common/portCheckbox";

process.env.NODE_ENV === "development" && require("./mock.js");

// 覆盖element的部分方法，添加一些默认配置
const overrideMethods = (Vue) => {
    const cfm = Vue.prototype.$confirm;
    const msg = Vue.prototype.$message;
    // 替换默认的 确认/取消 按钮的文本
    Vue.prototype.$confirm = (content, title, options) => {
        if (isPlainObject(title)) {
            options = title;
            title = "";
        }
        const {
            getters: { $lang },
        } = store;
        if (isFunction($lang)) {
            return cfm(
                isUndef(content) ? $lang("if_sure") : content,
                title,
                Object.assign(
                    {
                        cancelButtonText: $lang("cancel"),
                        confirmButtonText: $lang("apply"),
                    },
                    options
                )
            );
        }
        return cfm(content, title, options);
    };
    // message 默认显示close按钮
    ["success", "error", "warning", "info"].forEach((key) => {
        msg[key] = (message, options) => {
            return msg({ message, ...options, showClose: true, type: key });
        };
    });
};

const baseConfig = (Vue) => {
    Vue.config.productionTip = true;

    Vue.use(VueI18n);
    Vue.use(pageHeader);
    Vue.use(nmsPanel);
    Vue.use(nmsPortCheckbox);
    const lang = sessionStorage.getItem("lang");
    const i18n = new VueI18n({
        locale: ["zh", "en"].includes(lang) ? lang : "en",
        messages: {
            en: enLocale,
            zh: zhLocale,
        },
    });
    locale.i18n((key, value) => i18n.t(key, value));
    // Vue.use(ElementUI, { size: "small", zIndex: 1000 });

    Vue.prototype.$http = axios;

    overrideMethods(Vue);
    return { i18n };
};

export default baseConfig;
