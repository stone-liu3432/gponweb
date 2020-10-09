<template>
    <div>
        <page-header :title="$lang('perf_info')" type="none">
            <template slot="content">
                <el-button type="primary" size="small" @click="refreshData">{{
                    $lang("refresh")
                }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="clearPerf(0)"
                    >{{ $lang("clear_perf_all") }}</el-button
                >
            </template>
        </page-header>
        <el-table
            border
            :data="perf"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
        >
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('rx_octets')"
                prop="rx_octets"
            ></el-table-column>
            <el-table-column
                :label="$lang('rx_frame')"
                prop="rx_frame"
            ></el-table-column>
            <el-table-column
                :label="$lang('rx_discard_frame')"
                prop="rx_discard_frame"
            ></el-table-column>
            <el-table-column
                :label="$lang('rx_error_frame')"
                prop="rx_error_frame"
            ></el-table-column>
            <el-table-column
                :label="$lang('tx_octets')"
                prop="tx_octets"
            ></el-table-column>
            <el-table-column
                :label="$lang('tx_frame')"
                prop="tx_frame"
            ></el-table-column>
            <el-table-column
                :label="$lang('tx_discard_frame')"
                prop="tx_discard_frame"
            ></el-table-column>
            <el-table-column
                :label="$lang('tx_error_frame')"
                prop="tx_error_frame"
            ></el-table-column>
            <el-table-column :label="$lang('config')" width="120px">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="showDetail(scope.row.port_id)"
                        style="padding: 3px 0;"
                        >{{ $lang("detail") }}</el-button
                    >
                    <el-button
                        type="text"
                        @click="clearPerf(scope.row.port_id)"
                        style="padding: 3px 0;"
                        >{{ $lang("clear") }}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="640px">
            <template slot="title"
                >{{ $lang("port_id") }}: {{ detail.port_id || "" }}</template
            >
            <perf-detail :data="detail"></perf-detail>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isArray, debounce } from "@/utils/common";
import perfDetail from "./perf/detail";
export default {
    name: "perfInfo",
    components: { perfDetail },
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    data() {
        return {
            perf: [],
            detail: {},
            dialogVisible: false
        };
    },
    created() {
        this.getPerf();
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    methods: {
        getPerf() {
            this.perf = [];
            this.$http
                .get("/switch_port?form=statistictab")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.perf = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        showDetail(port_id) {
            const loading = this.$loading();
            this.detail = {};
            this.$http
                .get("/switch_port?form=statistic&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.detail = res.data.data;
                            this.dialogVisible = true;
                        }
                        loading.close();
                    } else {
                        loading.close();
                        this.$message.error(
                            `(${res.data.code}) ${res.data.message}`
                        );
                    }
                })
                .catch(err => {});
        },
        clearPerf(port_id) {
            this.$confirm(this.$lang("if_sure", "clear_perf") + "?")
                .then(_ => {
                    this.$http
                        .get("/switch_port?form=nostatistic&port_id=" + port_id)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("clear", "st_success")
                                );
                                this.getPerf();
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        refreshData() {
            debounce(this.getPerf, 1000, this);
        }
    }
};
</script>

<style lang="less" scoped>
</style>