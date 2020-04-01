<template>
    <div>
        <page-header type="none">
            <div slot="title">{{ $lang('pon_optical') }}</div>
        </page-header>
        <el-table :data="allOptInfo" border stripe>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('portstate')">
                <template
                    slot-scope="scope"
                >{{ scope.row.portstate ? $lang('online') : $lang('offline') }}</template>
            </el-table-column>
            <el-table-column :label="$lang('mstate')">
                <template
                    slot-scope="scope"
                >{{ scope.row.mstate ? $lang('detected') : $lang('undetected') }}</template>
            </el-table-column>
            <el-table-column :label="$lang('work_temprature')" prop="work_temprature"></el-table-column>
            <el-table-column :label="$lang('work_voltage')" prop="work_voltage"></el-table-column>
            <el-table-column :label="$lang('transmit_bias')" prop="transmit_bias"></el-table-column>
            <el-table-column :label="$lang('transmit_power')" prop="transmit_power"></el-table-column>
            <!-- <el-table-column :label="$lang('receive_power')" prop="receive_power"></el-table-column> -->
            <el-table-column :label="$lang('show_detail')" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetail(scope.row)">{{ $lang('show_detail') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="900px">
            <div slot="title">
                <div class="dialog-title-font">
                    <span style="margin-right: 20px;">{{ $lang('port_id') }}:</span>
                    <span>{{ getPortName(optDetail.port_id) }}</span>
                </div>
            </div>
            <opt-module :data="optDetail"></opt-module>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef } from "@/utils/common";
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
            dialogVisible: false,
            optDetail: {}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
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