import axios from "@/config/axios";
import {
    isEmptyObject,
    isPlainObject,
    isArray,
    isDef,
    isUndef,
    parsePort
} from "@/utils/common";

// portName生成，根据端口号和端口数量生成显示在界面上的 name
const createPortName = state => {
    if (
        !isEmptyObject(state.system) &&
        isArray(state.port) &&
        state.port.length
    ) {
        const { ponports, geports, xgeports } = state.system;
        return state.port.reduce((prev, item) => {
            const id = item.port_id;
            if (isUndef(prev[id])) {
                prev[id] = {};
            }
            const o = prev[id];
            let name =
                id <= ponports
                    ? `PON${id < 10 ? "0" + id : id}`
                    : id <= ponports + geports
                    ? `GE${
                          id - ponports < 10
                              ? "0" + (id - ponports)
                              : id - ponports
                      }`
                    : xgeports
                    ? `XGE${
                          id - ponports - geports < 10
                              ? "0" + (id - ponports - geports)
                              : id - ponports - geports
                      }`
                    : "";
            if (item.link_aggregation) {
                name += `(LAG${item.link_aggregation})`;
            }
            o.port_id = id;
            o.name = name;
            return prev;
        }, {});
    }
};

const actions = {
    getSystemInfo({ commit, state }) {
        axios
            .get("/board?info=system")
            .then(res => {
                if (res.data.code === 1) {
                    if (isPlainObject(res.data.data)) {
                        commit("updateSystem", res.data.data);
                        const _portnames = createPortName(state);
                        if (isDef(_portnames)) {
                            commit("updatePortNames", _portnames);
                        }
                    }
                } else {
                    commit("updateSystem", {});
                }
            })
            .catch(err => {});
    },
    getPon({ commit }) {
        axios
            .get("/board?info=pon")
            .then(res => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updatePon", res.data.data);
                    }
                } else {
                    commit("updatePon", []);
                }
            })
            .catch(err => {});
    },
    getPort({ commit, state }) {
        axios
            .get("/switch_port?form=portlist_info")
            .then(res => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updatePort", res.data.data);
                        const _portnames = createPortName(state);
                        if (isDef(_portnames)) {
                            commit("updatePortNames", _portnames);
                        }
                    }
                } else {
                    commit("updatePort", []);
                }
            })
            .catch(err => {});
    },
    getOnuResource({ commit }, port_id) {
        commit("updateOnuResource", []);
        axios
            .get("/onu_allow_list", { params: { form: "resource", port_id } })
            .then(res => {
                if (res.data.code === 1) {
                    if (isPlainObject(res.data.data)) {
                        commit(
                            "updateOnuResource",
                            parsePort(res.data.data.resource)
                        );
                    }
                }
            })
            .catch(err => {});
    },
    getOnuList({ commit }, port_id) {
        commit("updateOnulist", []);
        axios
            .get("/onu_allow_list", { params: { port_id } })
            .then(res => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updateOnulist", res.data.data);
                    }
                }
            })
            .catch(err => {});
    },
    getTime({ commit }) {
        commit("updateTime", {});
        axios
            .get("/time?form=info")
            .then(res => {
                if (res.data.code === 1) {
                    if (isPlainObject(res.data.data)) {
                        commit("updateTime", res.data.data);
                    }
                }
            })
            .catch(err => {});
    }
};

export default actions;
