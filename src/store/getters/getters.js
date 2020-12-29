import en from "@/locale/en";
import zh from "@/locale/zh";
import msg_en from "@/locale/validateMsg/en";
import msg_zh from "@/locale/validateMsg/zh";
import { isFunction } from "@/utils/common";

const langMap = { zh, en };
const msgMap = { en: msg_en, zh: msg_zh };

const getters = {
    $lang: (state) => (...keys) => {
        // 防止用户手动修改sessionStroage中的内容并刷新页面
        const maps = langMap[state.lang];
        if (keys.length === 0) {
            return "";
        } else if (keys.length === 1) {
            return maps[keys[0]] || "";
        } else {
            return keys.reduce((prev, item) => {
                if (state.lang === "zh") {
                    return `${prev}${maps[item] || ""}`;
                }
                return `${prev} ${maps[item] || ""}`;
            }, "");
        }
    },
    getPortName: (state) => (port_id) =>
        state.portName[port_id] ? state.portName[port_id].name : port_id,
    validateMsg: (state) => (msg, ...args) =>
        isFunction(msgMap[state.lang][msg])
            ? msgMap[state.lang][msg].apply(null, args)
            : "",
};

export default getters;
