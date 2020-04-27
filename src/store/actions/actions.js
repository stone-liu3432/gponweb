import axios from "@/config/axios";
import {
    isEmptyObject,
    isArray,
    isDef,
    isUndef,
    parseStringAsList,
} from "@/utils/common";

// portName生成，根据端口号和端口数量生成显示在界面上的 name
const createPortName = (state) => {
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
    getSystemInfo({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/board?info=system")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            commit("updateSystem", res.data.data);
                            resolve(res.data.data);
                        }
                    } else {
                        commit("updateSystem", {});
                        reject(res.data);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    getPon({ commit }) {
        axios
            .get("/board?info=pon")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updatePon", res.data.data);
                    }
                } else {
                    commit("updatePon", []);
                }
            })
            .catch((err) => {});
    },
    getPort({ commit, state }) {
        axios
            .get("/switch_port?form=portlist_info")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updatePort", res.data.data);
                        // portname更新时，更新portname
                        // portname并非不可变，在配置了端口汇聚时，随时可变
                        const _portNames = createPortName(state);
                        if (isDef(_portNames)) {
                            commit("updatePortNames", _portNames);
                        }
                    }
                } else {
                    commit("updatePort", []);
                }
            })
            .catch((err) => {});
    },
    getOnuResource({ commit }, port_id) {
        commit("updateOnuResource", []);
        axios
            .get("/onu_allow_list", { params: { form: "resource", port_id } })
            .then((res) => {
                if (res.data.code === 1) {
                    if (isDef(res.data.data)) {
                        commit(
                            "updateOnuResource",
                            parseStringAsList(res.data.data.resource)
                        );
                    }
                }
            })
            .catch((err) => {});
    },
    getOnuList({ commit }, port_id) {
        commit("updateOnulist", []);
        axios
            .get("/onu_allow_list", { params: { port_id } })
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updateOnulist", res.data.data);
                    }
                }
            })
            .catch((err) => {});
    },
    getTime({ commit }) {
        commit("updateTime", {});
        axios
            .get("/time?form=info")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isDef(res.data.data)) {
                        commit("updateTime", res.data.data);
                    }
                }
            })
            .catch((err) => {});
    },
    getInterfaces({ commit }) {
        commit("updateInterfaces", []);
        let interfaces = [];
        axios
            .get("/system?form=outbound")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isDef(res.data.data)) {
                        interfaces.push(res.data.data);
                    }
                    axios
                        .get("/system?form=inbound")
                        .then((res) => {
                            if (res.data.code === 1) {
                                if (isArray(res.data.data)) {
                                    interfaces = interfaces.concat(
                                        res.data.data
                                    );
                                }
                            }
                            commit("updateInterfaces", interfaces);
                        })
                        .catch((err) => {});
                }
            })
            .catch((err) => {});
    },
    getLineProfs({ commit }) {
        commit("updateLineProfs", []);
        axios
            .get("/lineprofile?form=table")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updateLineProfs", res.data.data);
                    }
                }
            })
            .catch((err) => {});
    },
    getSrvProfs({ commit }) {
        commit("updateSrvProfs", []);
        axios
            .get("/srvprofile?form=table")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updateSrvProfs", res.data.data);
                    }
                }
            })
            .catch((err) => {});
    },
};

export default actions;
