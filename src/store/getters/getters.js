import en from "@/locale/en";
import zh from "@/locale/zh";

const langMap = { zh, en };

const getters = {
    $lang: state => (...keys) => {
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
    getPortName: state => port_id =>
        state.portName[port_id] ? state.portName[port_id].name : port_id
};

export default getters;
