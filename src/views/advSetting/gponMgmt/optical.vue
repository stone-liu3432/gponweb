<template>
    <div>
        <page-header :type="headerType" @port-change="portChange">
            <div slot="title">{{ $lang("pon_optical") }}</div>
            <template slot="content">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="refreshData"
                    >{{ $lang("refresh") }}</el-button
                >
            </template>
        </page-header>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="$lang('pon_optical')" name="pon_optical">
                <el-table :data="allOptInfo" border>
                    <el-table-column :label="$lang('port_id')">
                        <template slot-scope="scope">{{
                            getPortName(scope.row.port_id)
                        }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('portstate')">
                        <template slot-scope="scope">{{
                            scope.row.portstate
                                ? $lang("online")
                                : $lang("offline")
                        }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('mstate')">
                        <template slot-scope="scope">{{
                            scope.row.mstate
                                ? $lang("detected")
                                : $lang("undetected")
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
                        :label="$lang('transmit_power')"
                        prop="transmit_power"
                    ></el-table-column>
                    <el-table-column :label="$lang('show_detail')" width="100">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                @click="showDetail(scope.row)"
                                >{{ $lang("show_detail") }}</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog
                    :visible.sync="dialogVisible"
                    append-to-body
                    width="900px"
                >
                    <div slot="title">
                        <div class="dialog-title-font">
                            <span style="margin-right: 20px;"
                                >{{ $lang("port_id") }}:</span
                            >
                            <span>{{ getPortName(optDetail.port_id) }}</span>
                        </div>
                    </div>
                    <opt-module :data="optDetail"></opt-module>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane
                :label="$lang('onu_optical_diagnose')"
                name="ont_optical"
            >
                <el-table :data="ontInfo" border>
                    <el-table-column :label="$lang('ont_id')">
                        <template slot-scope="scope">{{
                            scope.row.ont_name ||
                                `ONT${scope.row.port_id}/${scope.row.ont_id}`
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
                        :label="$lang('transmit_power')"
                        prop="transmit_power"
                    ></el-table-column>
                    <el-table-column
                        :label="$lang('receive_power')"
                        prop="receive_power"
                    ></el-table-column>
                    <el-table-column
                        :label="$lang('us_ber')"
                        prop="us_ber"
                    ></el-table-column>
                    <el-table-column
                        :label="$lang('ds_ber')"
                        prop="ds_ber"
                    ></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef, debounce } from "@/utils/common";
import optModule from "./optical/optModule";
export default {
    name: "optical",
    components: { optModule },
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            allOptInfo: [],
            ontInfo: [],
            dialogVisible: false,
            optDetail: {},
            activeName: "pon_optical",
            headerType: "none",
            port_id: 0
        };
    },
    created() {
        this.getPonOptical();
    },
    methods: {
        getPonOptical() {
            this.allOptInfo = [];
            this.$http
                .get("/gponmgmt?form=optical_poninfo")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.allOptInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getOntOptical(port_id) {
            this.ontInfo = [];
            const loading = this.$loading();
            this.$http
                .get(`/gponmgmt?form=optical_onu&port_id=${port_id}`)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.ontInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {})
                .finally(_ => {
                    loading.close();
                });
        },
        portChange(port_id) {
            this.port_id = port_id;
            if (this.activeName === "ont_optical") {
                this.getOntOptical(port_id);
            }
        },
        showDetail(row) {
            this.openDialog(row.port_id);
        },
        openDialog(port_id) {
            if (port_id === this.optDetail.port_id) {
                this.dialogVisible = true;
                return;
            }
            const loading = this.$loading();
            this.$http
                .get("/gponmgmt?form=optical_poninfo&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.optDetail = res.data.data;
                            this.dialogVisible = true;
                        }
                    }
                    loading.close();
                })
                .catch(err => {
                    loading.close();
                });
        },
        refreshData() {
            if (this.activeName === "pon_optical") {
                debounce(this.getPonOptical, 1000, this);
            } else if (this.activeName === "ont_optical") {
                this.getOntOptical(this.port_id);
            }
        }
    },
    watch: {
        activeName() {
            if (this.activeName === "pon_optical") {
                this.headerType = "none";
            } else if (this.activeName === "ont_optical") {
                this.headerType = "pon";
                this.getOntOptical(this.port_id);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.dialog-title-font {
    color: @baseFontColor;
    span + span {
        color: @titleColor;
    }
}
</style>