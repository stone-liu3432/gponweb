<template>
    <div>{{ data }}</div>
</template>

<script>
import { mapGetters } from "vuex";
import { ENCRYPT_MAP } from "@/utils/commonData";
export default {
    name: "ontWlan",
    computed: {
        ...mapGetters(["$lang"]),
    },
    props: {
        identifier: {
            type: Number,
        },
        data: {
            type: Object,
        },
    },
    data() {
        return {
            ENCRYPT_MAP,
            WLAN_TYPE_MAP: { 1: "2.4G", 2: "5G", 3: "All" },
        };
    },
    methods: {},
};
</script>

<style lang="less" scoped>
</style>