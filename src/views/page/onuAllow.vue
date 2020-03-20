<template>
    <div style="margin: 20px;">
        <page-header @port-change="portChange" type="none">
            <div slot="title">{{ $lang('onu_allow') }}</div>
        </page-header>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isFunction, isArray } from "@/utils/common";
export default {
    name: "onuAllow",
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            port_id: 0
        };
    },
    created() {},
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
        }
    },
    watch: {}
};
</script>

<style lang="less" scoped>
</style>