<template>
    <div>
        status
        <br />
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "status",
    data() {
        return {};
    },
    computed: {
        ...mapState(["system", "pon", "port"]),
        ...mapGetters(["getPortName"])
    },
    created() {
        this.getSystemInfo();
        this.getPort();
        this.getPon();
    },
    methods: {
        ...mapActions(["getSystemInfo", "getPon", "getPort"])
    }
};
</script>

<style>
</style>