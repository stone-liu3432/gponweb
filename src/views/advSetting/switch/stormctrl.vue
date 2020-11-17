<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("stormctrl") }}</template>
            <template slot="content">
                <el-button type="primary" size="mini" @click="refreshData">{{
                    $lang("refresh")
                }}</el-button>
            </template>
        </page-header>
        <el-table :data="stormctrls" border>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('broadcast')"
                prop="broadcast"
            ></el-table-column>
            <el-table-column
                :label="$lang('multicast')"
                prop="multicast"
            ></el-table-column>
            <el-table-column
                :label="$lang('unicast')"
                prop="unicast"
            ></el-table-column>
            <el-table-column :label="$lang('config')" width="100px">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row)">{{
                        $lang("config")
                    }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            width="650px"
            append-to-body
            destroy-on-close
        >
            <template slot="title">{{ $lang("config") }}</template>
            <port-config-form
                type="stormctrl"
                :port_id="row.port_id"
                :data="row"
                ref="port-config-form"
            ></port-config-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-config-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import portConfigForm from "./portConfig/form";
import postData from "@/mixin/postData";
export default {
    name: "stormCtrl",
    components: { portConfigForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
    },
    mixins: [postData],
    data() {
        return {
            stormctrls: [],
            row: {},
            dialogVisible: false,
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick((_) => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.stormctrls = [];
            this.$http
                .get("/switch_port?form=stormctrl_all")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.stormctrls = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
        openDialog(row) {
            this.row = row;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["port-config-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    const flags = {
                        broadcast: 0x04,
                        multicast: 0x02,
                        unicast: 0x01,
                    };
                    const flag = this.computedFlag(flags, form, this.row);
                    if (flag === 0) {
                        this.$message.error(this.$lang("modify_tips"));
                        return;
                    }

                    const url = "/switch_port?form=stormctrl",
                        data = {
                            method: "set",
                            param: {
                                port_id: this.row.port_id,
                                flags: flag,
                                broadcast: form.broadcast,
                                multicast: form.multicast,
                                unicast: form.unicast,
                            },
                        };
                    this.postData(url, data)
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.dialogVisible = false;
                        });
                }
            });
        },
        computedFlag(flags, data, baseData) {
            let flag = 0;
            Object.keys(flags).forEach((key) => {
                if (data[key] !== baseData[key]) {
                    flag |= flags[key];
                }
            });
            return flag;
        },
    },
};
</script>

<style lang="less" scoped>
</style>