<template>
    <div id="app">
        <router-view v-if="!!lang" />
    </div>
</template>

<script>
import { isUndef, isDef } from "@/utils/common";
import { mapMutations, mapState } from "vuex";
export default {
    name: "HSGQ",
    created() {
        this.getLang();
        this.$http
            .get("/system_custom")
            .then((res) => {
                if (res.data.code === 1) {
                    if (isDef(res.data.data)) {
                        this.updateCustom(res.data.data);
                    }
                }
            })
            .catch((err) => {});
    },
    computed: {
        ...mapState(["lang"]),
    },
    data() {
        return {
            transitionName: "",
        };
    },
    methods: {
        ...mapMutations(["updateLang", "updateCustom"]),
        getLang() {
            this.$http
                .get("/system_lang")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.updateLang(res.data.data.lang);
                            this.$i18n.locale = res.data.data.lang;
                        }
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>

<style lang="less">
body {
    margin: 0;
    min-width: 1280px;
}
</style>
