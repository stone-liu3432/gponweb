const mutations = {
    updateLang(state, data) {
        state.lang = data;
        sessionStorage.setItem("lang", data);
    },
    updateSystem(state, data) {
        state.system = data;
    },
    updateAdvMenu(state, data) {
        state.advMenu = data;
    },
    updatePon(state, data) {
        state.pon = data;
    },
    updatePort(state, data) {
        state.port = data;
    },
    updatePortNames(state, data) {
        state.portName = data;
    },
    updateOnuResource(state, data) {
        state.onuResource = data;
    },
    updateOnulist(state, data) {
        state.onulist = data;
    },
    updateTime(state, data) {
        state.time = data;
    }
};

export default mutations;
