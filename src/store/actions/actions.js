import axios from "@/config/axios";
import { isPlainObject, isArray } from "@/utils/common";

const actions = {
    getLang({ commit }) {
        axios
            .get("/system_lang")
            .then(res => {
                if (res.data.code === 1) {
                    if (isPlainObject(res.data.data)) {
                        commit("updateLang", res.data.data.lang || "en");
                        sessionStorage.setItem(
                            "lang",
                            res.data.data.lang || "en"
                        );
                    }
                }
            })
            .catch(err => {});
    }
};

export default actions;
