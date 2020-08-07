<template>
    <div>
        <page-header type="pon" has-onu @port-change="portChange">
            <template slot="title">{{ $lang('onu_perf_info') }}</template>
            <template slot="content">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="refreshData"
                >{{ $lang('refresh') }}</el-button>
            </template>
        </page-header>
        <el-tabs v-model="activeName" type="card" @tab-click="getPerfs(port_id, ont_id)">
            <el-tab-pane
                :label="$lang('olt_gem_statistics')"
                name="olt_gem_perf"
                @refresh-data="getPerfs(port_id, ont_id)"
            >
                <olt-gem-perf :perfs="perfs"></olt-gem-perf>
            </el-tab-pane>
            <el-tab-pane
                :label="$lang('ont_gem_statistics')"
                name="ont_gem_perf"
                @refresh-data="getPerfs(port_id, ont_id)"
            >
                <ont-gem-perf :perfs="perfs"></ont-gem-perf>
            </el-tab-pane>
            <el-tab-pane
                :label="$lang('ont_eth_statistics')"
                name="ont_eth_perf"
                @refresh-data="getPerfs(port_id, ont_id)"
            >
                <ont-eth-perf :perfs="perfs"></ont-eth-perf>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import oltGemPerf from "./ontPerf/oltGem";
import ontGemPerf from "./ontPerf/ontGem";
import ontEthPerf from "./ontPerf/ontEth";
export default {
    name: "ontPerf",
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    components: { oltGemPerf, ontGemPerf, ontEthPerf },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            activeName: "olt_gem_perf",
            perfs: [],
            port_id: 1,
            ont_id: 0
        };
    },
    methods: {
        portChange(port_id, ont_id) {
            if (ont_id === 0xffff) {
                this.perfs = [];
                return;
            }
            this.port_id = port_id;
            this.ont_id = ont_id;
            this.getPerfs(port_id, ont_id);
        },
        getPerfs(port_id, ont_id) {
            this.perfs = [];
            switch (this.activeName) {
                case "olt_gem_perf":
                    this.getOltGemPerf(port_id, ont_id);
                    break;
                case "ont_gem_perf":
                    this.getOntGemPerf(port_id, ont_id);
                    break;
                case "ont_eth_perf":
                    this.getOntEthPerf(port_id, ont_id);
                    break;
            }
        },
        getOltGemPerf(port_id, ont_id) {
            this.$http
                .get(
                    `/gponont_mgmt?form=olt_gemport&port_id=${port_id}&ont_id=${ont_id}&gemport_id=0`
                )
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.perfs = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getOntGemPerf(port_id, ont_id) {
            this.$http
                .get(
                    `/gponont_mgmt?form=ont_gemport&port_id=${port_id}&ont_id=${ont_id}&gemport_id=0`
                )
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.perfs = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getOntEthPerf(port_id, ont_id) {
            this.$http
                .get(
                    `/gponont_mgmt?form=ont_ethport&port_id=${port_id}&ont_id=${ont_id}&uniport_id=0`
                )
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.perfs = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        refreshData() {
            debounce(this.getPerfs, 1000, this, this.port_id, this.ont_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>