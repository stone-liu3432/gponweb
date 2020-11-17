<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("port_optical") }}</template>
            <template slot="content">
                <el-button type="primary" size="small" @click="refreshData">{{
                    $lang("refresh")
                }}</el-button>
            </template>
        </page-header>
        <el-table :data="portOpticals" border>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('portstate')">
                <template slot-scope="scope">{{
                    $lang(STATUS[scope.row.portstate])
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('mstate')">
                <template slot-scope="scope">{{
                    scope.row.mstate ? $lang("detected") : $lang("undetected")
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('work_temprature')"
                prop="work_temprature"
            ></el-table-column>
            <el-table-column
                :label="$lang('work_voltage')"
                prop="work_voltage"
            ></el-table-column>
            <el-table-column
                :label="$lang('transmit_bias')"
                prop="transmit_bias"
            ></el-table-column>
            <el-table-column
                :label="$lang('receive_power')"
                prop="receive_power"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import { STATUS } from "@/utils/commonData";
export default {
    name: "portOptical",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
    },
    data() {
        return {
            STATUS,
            portOpticals: [],
        };
    },
    created() {
        this.getData();
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick((_) => {
            this.updateAdvMainScrollbar();
        });
    },
    methods: {
        getData() {
            this.portOpticals = [];
            this.$http
                .get("/switch_port?form=optical_uplinkinfo")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.portOpticals = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
    },
};
</script>

<style lang="less" scoped>
</style>