<template>
    <div>
        <page-header type="pon" hasOnu @port-change="portChange">
            <template slot="title">{{ $lang('ont', 'port_info') }}</template>
        </page-header>
        <template v-if="portList.length">
            <el-table :data="portList" border>
                <el-table-column :label="$lang('ethport_id')" prop="ethport_id"></el-table-column>
                <el-table-column :label="$lang('porttype')" prop="porttype"></el-table-column>
                <el-table-column :label="$lang('epspeed')" prop="epspeed"></el-table-column>
                <el-table-column :label="$lang('epduplex')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.epduplex ? "Half" : scope.row.epspeed ? "Full" : "-" }}</template>
                </el-table-column>
                <el-table-column :label="$lang('epstatus')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.epspeed ? scope.row.epstatus ? "Down" : "Up" : "Down" }}</template>
                </el-table-column>
                <el-table-column :label="$lang('ring')">
                    <template slot-scope="scope">{{ RING_MAP[scope.row.ring] }}</template>
                </el-table-column>
                <!-- <el-table-column :label="$lang('config')" width="80px">
                <template slot-scope="scope">
                    <el-button type="text">{{ $lang('config') }}</el-button>
                </template>
                </el-table-column>-->
            </el-table>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray } from "@/utils/common";
const RING_MAP = { 1: "On", 2: "Off" };
export default {
    name: "ontPortCfg",
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            RING_MAP,
            port_id: 0,
            ont_id: 0xffff,
            portList: []
        };
    },
    methods: {
        getData(port_id, ont_id) {
            this.portList = [];
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "ethport",
                        port_id,
                        ont_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.portList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        portChange(port_id, ont_id) {
            this.port_id = port_id;
            this.ont_id = ont_id;
            if (ont_id === 0xffff) {
                this.portList = [];
                return;
            }
            this.getData(port_id, ont_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>