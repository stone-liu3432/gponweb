<template>
    <div style="margin: 20px;">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="$lang('virtual_port', 'list')" name="virtualPort">
                <virtual-port-mgmt v-if="activeName === 'virtualPort'"></virtual-port-mgmt>
            </el-tab-pane>
            <el-tab-pane :label="$lang('auto_config_temp')" name="autoTemp">
                <auto-config-temp v-if="activeName === 'autoTemp'"></auto-config-temp>
            </el-tab-pane>
            <el-tab-pane :label="$lang('auto_discover_list')" name="autoFindList">
                <auto-find-list v-if="activeName === 'autoFindList'"></auto-find-list>
            </el-tab-pane>
            <el-tab-pane :label="$lang('virtual_port','statistical')" name="stat">
                <virtual-port-stat v-if="activeName === 'stat'"></virtual-port-stat>
            </el-tab-pane>
            <!-- to do -->
            <!-- <el-tab-pane label="流量模板" name="traffic">
                <virtual-port-traffic v-if="activeName === 'traffic'"></virtual-port-traffic>
            </el-tab-pane>-->
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import virtualPortMgmt from "./virtualPort/virtualPortMgmt";
import autoConfigTemp from "./virtualPort/autoConfigTemp";
import autoFindList from "./virtualPort/autoFindList";
import virtualPortStat from "./virtualPort/virtualPortStat";
import virtualPortTraffic from "./virtualPort/virtualPortTraffic";
export default {
    name: "virtualPort",
    components: {
        virtualPortMgmt,
        autoConfigTemp,
        autoFindList,
        virtualPortStat,
        virtualPortTraffic
    },
    computed: {
        ...mapGetters(["$lang"])
    },
    created() {},
    data() {
        return {
            activeName: "virtualPort"
        };
    },
    methods: {}
};
</script>

<style lang="less" scoped>
</style>