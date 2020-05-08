<template>
    <div>
        <page-header type="none" title="IGMP"></page-header>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="$lang('info')" name="info">
                <igmp-info v-if="activeName === 'info'"></igmp-info>
            </el-tab-pane>
            <el-tab-pane :label="$lang('multicast_table')" name="multicast_table">
                <igmp-multicast v-if="activeName === 'multicast_table'"></igmp-multicast>
            </el-tab-pane>
            <el-tab-pane :label="$lang('mvlan')" name="mvlan">
                <multicast-vlan ref="multicast-vlan" v-if="activeName === 'mvlan'"></multicast-vlan>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import igmpInfo from "./igmp/igmpInfo";
import igmpMulticast from "./igmp/multicast";
import multicastVlan from "./igmp/multicastVlan";
export default {
    name: "igmpMgmt",
    components: { igmpInfo, igmpMulticast, multicastVlan },
    computed: {
        ...mapGetters(["$lang"]),
        tabs() {
            return ["info", "multicast_table", "mvlan"];
        }
    },
    data() {
        return {
            activeName: "info"
        };
    },
    methods: {}
};
</script>

<style lang="less" scoped>
</style>