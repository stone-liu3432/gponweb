<template>
    <div>
        <page-header :title="$lang('port_vlan')" type="port" @port-change="portChange"></page-header>
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
            <el-tab-pane :label="$lang('vlan_cfg')" name="vlan_cfg">
                <vlan-config :base-data="base" @refresh="getData"></vlan-config>
            </el-tab-pane>
            <el-tab-pane label="VLAN Translate" name="vlan_translate">
                <vlan-translate :base-data="translate" :port_id="port_id" @refresh="getData"></vlan-translate>
            </el-tab-pane>
            <el-tab-pane label="VLAN QinQ" name="vlan_qinq">
                <vlan-qinq :base-data="qinq" :port_id="port_id" @refresh="getData"></vlan-qinq>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import vlanConfig from "./portVlan/vlanConfig";
import vlanTranslate from "./portVlan/vlanTranslate";
import vlanQinq from "./portVlan/vlanQinq";
import { isPlainObject, isArray, isFunction } from "@/utils/common";
export default {
    name: "portVlan",
    computed: {
        ...mapGetters(["$lang"])
    },
    components: { vlanConfig, vlanTranslate, vlanQinq },
    data() {
        return {
            activeName: "vlan_cfg",
            port_id: 0,
            base: {},
            translate: [],
            qinq: []
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
            this.getData(port_id);
        },
        getData(port_id) {
            const REQUESTS = {
                vlan_cfg(port_id) {
                    this.getVlanConfig(port_id);
                },
                vlan_translate(port_id) {
                    this.getVlanTranslate(port_id);
                },
                vlan_qinq(port_id) {
                    this.getVlanQinq(port_id);
                }
            };
            if (isFunction(REQUESTS[this.activeName])) {
                REQUESTS[this.activeName].call(this, port_id);
            }
        },
        getVlanConfig(port_id) {
            this.base = {};
            this.$http
                .get("/switch_port?form=vlan&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isPlainObject(res.data.data)) {
                            this.base = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getVlanTranslate(port_id) {
            this.translate = [];
            this.$http
                .get("/vlan_action?form=translate&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.translate = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getVlanQinq(port_id) {
            this.qinq = [];
            this.$http
                .get("/vlan_action?form=qinq&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.qinq = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        tabClick(tab, e) {
            this.getData(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>