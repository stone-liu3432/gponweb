<template>
    <div>
        <div style="margin: 12px 0">
            <el-button size="small" type="primary" @click="openDialog('add')">
                {{ $lang("add") }}
            </el-button>
        </div>
        <el-table :data="data" border>
            <el-table-column
                :label="$lang('index')"
                prop="index"
            ></el-table-column>
            <el-table-column :label="$lang('ipoption')">
                <template slot-scope="scope">
                    {{
                        scope.row.ipoption === 1
                            ? $lang("static") + " IP"
                            : "DHCP"
                    }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('vlan_id')"
                prop="vlan_id"
            ></el-table-column>
            <el-table-column :label="$lang('ipaddr')">
                <template slot-scope="scope">
                    {{ scope.row.ipoption === 2 ? "-" : scope.row.ipaddr }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('ipmask')">
                <template slot-scope="scope">
                    {{ scope.row.ipoption === 2 ? "-" : scope.row.ipmask }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('gateway')">
                <template slot-scope="scope">
                    {{ scope.row.ipoption === 2 ? "-" : scope.row.gateway }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('primary')">
                <template slot-scope="scope">
                    {{ scope.row.ipoption === 2 ? "-" : scope.row.primary }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('secondary')">
                <template slot-scope="scope">
                    {{ scope.row.ipoption === 2 ? "-" : scope.row.secondary }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="150px">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('config', scope.row)"
                        >{{ $lang("config") }}</el-button
                    >
                    <el-button type="text" @click="deleteIpconfig(scope.row)">
                        {{ $lang("delete") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            width="650px"
        >
            <template slot="title">{{ $lang(dialogType) }}</template>
            <ont-ipconfig-form ref="ont-ipconfig-form"></ont-ipconfig-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="submitForm('ont-ipconfig-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import ontIpconfigForm from "./ontIpconfigForm";
import postData from "@/mixin/postData";
export default {
    name: "ontIpconfig",
    components: { ontIpconfigForm },
    computed: {
        ...mapGetters(["$lang"]),
    },
    mixins: [postData],
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        identifier: {
            type: Number,
        },
    },
    data() {
        return {
            dialogVisible: false,
            row: {},
            dialogType: "",
        };
    },
    methods: {
        deleteIpconfig(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(() => {
                    const url = "/gponont_mgmt?form=ipconfig",
                        post_params = {
                            method: "clear",
                            param: {
                                identifier: row.identifier,
                                index: row.index,
                                ipoption: row.ipoption,
                                vlan_id: row.vlan_id,
                                ipaddr: row.ipaddr,
                                ipmask: row.ipmask,
                                gateway: row.gateway,
                                primary: row.primary,
                                secondary: row.secondary,
                            },
                        };
                    this.postData(url, post_params)
                        .then(() => {
                            this.$emit("refresh-data");
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        openDialog(type, row) {
            if (type === "add" && this.data.length === 2) {
                return this.$message.info(this.$lang("ipconfig_tips"));
            }
            this.dialogType = type;
            this.row = row || {
                identifier: this.identifier,
                // 添加时，取不存在的另一个 index，取值只存在 1，0 两个值
                index: this.data[0] ? Number(!this.data[0].index) : 0,
            };
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["ont-ipconfig-form"].init(type, row);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    const url = "/gponont_mgmt?form=ipconfig",
                        post_params = {
                            method: "set",
                            param: {
                                identifier:
                                    this.row.identifier || this.identifier,
                                index: form.index,
                                ipoption: form.ipoption,
                                vlan_id: form.vlan_id,
                                ipaddr: form.ipaddr,
                                ipmask: form.ipmask,
                                gateway: form.gateway,
                                primary: form.primary,
                                secondary: form.secondary,
                            },
                        };
                    this.postData(url, post_params)
                        .then(() => {
                            this.$emit("refresh-data");
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.dialogVisible = false;
                        });
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
</style>