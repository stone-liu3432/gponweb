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
        return axios
            .get("/board?info=system")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isDef(res.data.data)) {
                        commit("updateSystem", res.data.data);
                        return Promise.resolve(res.data.data);
                    }
                } else {
                    commit("updateSystem", {});
                    return Promise.reject(res.data);
                }
            })
            .catch((err) => {});
    },
    getPon({ commit }) {
        commit("updatePon", []);
        return axios
            .get("/board?info=pon")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updatePon", res.data.data);
                        return Promise.resolve(res.data.data);
                    }
                }
                return Promise.reject(res);
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
            .get("/gponont_mgmt", { params: { form: "resource", port_id } })
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
    getOntList({ commit }, port_id) {
        commit("updateOnulist", []);
        return axios
            .get("/gponont_mgmt?form=auth", { params: { port_id } })
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updateOnulist", res.data.data);
                        return Promise.resolve(res.data.data);
                    }
                }
                return Promise.reject(res);
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
                    axios
                        .get("/ont_line_prof_table")
                        .then((_res) => {
                            if (_res.data.code === 1) {
                                if (isArray(_res.data.data)) {
                                    commit("updateLineProfs", _res.data.data);
                                }
                            }
                        })
                        .catch((_err) => {});
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
                    axios
                        .get("/ont_srv_prof_table")
                        .then((_res) => {
                            if (_res.data.code === 1) {
                                if (isArray(_res.data.data)) {
                                    commit("updateSrvProfs", _res.data.data);
                                }
                            }
                        })
                        .catch((_err) => {});
                }
            })
            .catch((err) => {});
    },
    getTimerange({ commit }) {
        commit("updateTimerange", []);
        axios
            .get("/switch_acl?form=time_range&name=all")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isArray(res.data.data)) {
                        commit("updateTimerange", res.data.data);
                    }
                }
            })
            .catch((err) => {});
    },
    getVirtualPort({ commit }) {
        commit("updateVirtualPort", []);
        axios
            .get("/switch_svp?form=svp_table")
            .then((res) => {
                if (res.data.code === 1) {
                    axios
                        .get("/serviceport")
                        .then((res) => {
                            if (res.data.code === 1) {
                                if (isArray(res.data.data)) {
                                    commit("updateVirtualPort", res.data.data);
                                }
                            }
                        })
                        .catch((err) => {});
                }
            })
            .catch((err) => {});
    },
    setLanguage({ commit }, lang) {
        axios
            .post("/system_lang", {
                method: "set",
                param: {
                    lang,
                },
            })
            .then((res) => {})
            .catch((err) => {});
    },
};

export default actions;
