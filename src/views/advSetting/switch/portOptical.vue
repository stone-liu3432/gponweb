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
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetail(scope.row)">{{
                        $lang("show_detail")
                    }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="900px">
            <div slot="title" class="dialog-title-font">
                <span>{{ $lang("port_id") }}:</span>
                <span>{{ getPortName(row.port_id) }}</span>
            </div>
            <port-opt-detail :data="row"></port-opt-detail>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import { STATUS } from "@/utils/commonData";
import portOptDetail from "./portOptical/detail";
export default {
    name: "portOptical",
    components: { portOptDetail },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
    },
    data() {
        return {
            STATUS,
            portOpticals: [],
            dialogVisible: false,
            row: {},
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
        showDetail(row) {
            const loading = this.$loading();
            this.$http
                .get(
                    "/switch_port?form=optical_uplinkinfo&port_id=" +
                        row.port_id
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.row = res.data.data;
                            this.dialogVisible = true;
                        }
                    }
                })
                .catch((err) => {})
                .finally(() => {
                    loading.close && loading.close();
                });
        },
    },
};
</script>

<style lang="less" scoped>
.dialog-title-font {
    color: @baseFontColor;
    span + span {
        color: @titleColor;
        margin-left: 20px;
    }
}
</style>