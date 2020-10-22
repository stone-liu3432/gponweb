<template>
    <div>
        <page-header title="RSTP" type="none"></page-header>
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
            <el-tab-pane :label="$lang('rstp_b_info')" name="bridge">
                <rstp-bridge
                    :bridge-data="rstp_bridge_info"
                    @refresh="getData"
                ></rstp-bridge>
            </el-tab-pane>
            <el-tab-pane :label="$lang('rstp_p_info')" name="port">
                <rstp-port
                    :port-data="rstp_port_info"
                    :bridge-data="rstp_bridge_info"
                    @refresh="getData"
                ></rstp-port>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isArray } from "@/utils/common";
import rstpBridge from "./rstp/bridge";
import rstpPort from "./rstp/port";
export default {
    name: "rstp",
    components: { rstpBridge, rstpPort },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            activeName: "bridge",
            rstp_bridge_info: {},
            rstp_port_info: [],
            modes: { 0: "stp", 2: "rstp", 3: "mstp" }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.activeName === "bridge" && this.getRstpBridgeInfo();
            this.activeName === "port" && this.getRstpPortInfo();
        },
        getRstpBridgeInfo() {
            this.rstp_bridge_info = {};
            this.$http
                .get("/switch_rstp?form=bridge")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.rstp_bridge_info = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getRstpPortInfo() {
            this.rstp_port_info = [];
            this.$http
                .get("/switch_rstp?form=port")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.rstp_port_info = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        tabClick(tab, e) {
            this.getData();
        }
    }
};
</script>

<style lang="less" scoped>
</style>