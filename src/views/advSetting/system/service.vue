<template>
    <div>
        <page-header type="none" :title="$lang('service')"></page-header>
        <el-tabs v-model="activeName" type="card" @tab-click="getData">
            <el-tab-pane :label="$lang('sys_port')" name="sys_port">
                <sys-port
                    :base-data="sysPortInfo"
                    :sys-log-ip="sysLogIp"
                    @refresh="getData"
                ></sys-port>
            </el-tab-pane>
            <!-- to do: custom -->
            <template v-if="custom.frpc">
                <el-tab-pane label="FRPC" name="frpc">
                    <service-frpc
                        :base-data="frpcData"
                        @refresh="getData"
                    ></service-frpc>
                </el-tab-pane>
            </template>
            <el-tab-pane label="SNMP" name="snmp">
                <service-snmp
                    :trap="snmpTrap"
                    :community="snmpCommunity"
                    @refresh="getData"
                ></service-snmp>
            </el-tab-pane>
            <el-tab-pane label="SSH-Key" name="ssh">
                <service-ssh
                    :base-data="sshData"
                    @refresh="getData"
                ></service-ssh>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import serviceFrpc from "./service/frpc";
import serviceSnmp from "./service/snmp";
import serviceSsh from "./service/ssh";
import sysPort from "./service/sysPort";
import { isDef, isArray, isFunction } from "@/utils/common";
export default {
    name: "sysService",
    components: { serviceFrpc, serviceSnmp, serviceSsh, sysPort },
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["custom"]),
    },
    data() {
        return {
            activeName: "sys_port",
            frpcData: {},
            snmpTrap: {},
            snmpCommunity: {},
            sshData: [],
            sysPortInfo: {},
            sysLogIp: "",
        };
    },
    created() {
        this.getData();
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateAdvMainScrollbar();
        });
    },
    methods: {
        getData() {
            const ACTIONS = {
                sys_port: this.getSysPort,
                frpc: this.getFrpc,
                snmp() {
                    this.getSnmpTrap();
                    this.getSnmpCommunity();
                },
                ssh: this.getSsh,
            };
            if (isFunction(ACTIONS[this.activeName])) {
                ACTIONS[this.activeName].call(this);
            }
        },
        getFrpc() {
            this.frpcData = {};
            this.$http
                .get("/system_service?form=frpc")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.frpcData = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getSnmpTrap() {
            this.snmpTrap = {};
            this.$http
                .get("/snmp_cfg?form=trap")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.snmpTrap = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getSnmpCommunity() {
            this.snmpCommunity = {};
            this.$http
                .get("/snmp_cfg?form=community")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.snmpCommunity = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getSsh() {
            this.sshData = [];
            this.$http
                .get("/system_service?form=sshd")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.sshData = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getSysPort() {
            this.sysPortInfo = {};
            this.$http
                .get("/system_service?form=port")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.sysPortInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
            this.getSysLogIp();
        },
        getSysLogIp() {
            this.sysLogIp = "";
            this.$http
                .get("/system_service?form=syslog")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.sysLogIp = res.data.data.ipaddr || "-";
                        }
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>

<style lang="less" scoped>
</style>