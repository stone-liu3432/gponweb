const mutations = {
    updateLang(state, data) {
        state.lang = data;
        sessionStorage.setItem("lang", data);
    },
    updateSystem(state, data) {
        state.system = data;
    },
    updatePon(state, data) {
        state.pon = data;
    },
    updatePort(state, data) {
        state.port = data;
    },
    updatePortNames(state, data) {
        state.portName = data;
    }
};

export default mutations;
