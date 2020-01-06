import axios from "@/config/axios";
import { isArray, isDef, parseStringAsList } from "@/utils/common";

const actions = {
    getSystemInfo({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/board?info=system")
                .then(res => {
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
                .catch(err => {
                    reject(err);
                });
        });
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
    getPort({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/switch_port?form=portlist_info")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            commit("updatePort", res.data.data);
                            resolve(res.data.data);
                        }
                    } else {
                        commit("updatePort", []);
                        reject(res.data);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getOnuResource({ commit }, port_id) {
        commit("updateOnuResource", []);
        axios
            .get("/onu_allow_list", { params: { form: "resource", port_id } })
            .then(res => {
                if (res.data.code === 1) {
                    if (isDef(res.data.data)) {
                        commit(
                            "updateOnuResource",
                            parseStringAsList(res.data.data.resource)
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
                    if (isDef(res.data.data)) {
                        commit("updateTime", res.data.data);
                    }
                }
            })
            .catch(err => {});
    },
    getInterfaces({ commit }) {
        commit("updateInterfaces", []);
        let interfaces = [];
        axios
            .get("/system?form=outbound")
            .then(res => {
                if (res.data.code === 1) {
                    if (isDef(res.data.data)) {
                        interfaces.push(res.data.data);
                    }
                    axios
                        .get("/system?form=inbound")
                        .then(res => {
                            if (res.data.code === 1) {
                                if (isArray(res.data.data)) {
                                    interfaces = interfaces.concat(
                                        res.data.data
                                    );
                                }
                            }
                            commit("updateInterfaces", interfaces);
                        })
                        .catch(err => {});
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export default actions;
