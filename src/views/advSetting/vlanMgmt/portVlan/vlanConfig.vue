<template>
    <div class="port-vlan-config">
        <el-table :data="baseData" border>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('port_type')">
                <template slot-scope="scope">{{
                    PORT_TYPE_MAP[scope.row.port_type]
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('pvid')"
                prop="pvid"
            ></el-table-column>
            <el-table-column
                :label="$lang('tagged')"
                prop="tagged_vlan"
            ></el-table-column>
            <el-table-column
                :label="$lang('untagged')"
                prop="untagged_vlan"
            ></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-dropdown @command="dropdownClick">
                        <span class="el-dropdown-link">
                            {{ $lang("config")
                            }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{
                                    action: 'port_type',
                                    row: scope.row,
                                }"
                                >{{ $lang("port_type") }}
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'pvid', row: scope.row }"
                                >{{ $lang("pvid") }}
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{
                                    action: 'add_vlan',
                                    row: scope.row,
                                }"
                                >{{ $lang("add_vlan_list") }}
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{
                                    action: 'del_vlan',
                                    row: scope.row,
                                }"
                                >{{ $lang("del_vlan_list") }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <template slot="title">{{ title }}</template>
            <vlan-config-form
                :type="dialogType"
                :data="row"
                ref="port-vlan-config-form"
            ></vlan-config-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-vlan-config-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import vlanConfigForm from "./vlanConfigForm";
import { isFunction, isDef } from "@/utils/common";
import { PORT_TYPE_MAP } from "@/utils/commonData";
import postData from "@/mixin/postData";
export default {
    name: "vlanConfig",
    components: { vlanConfigForm },
    mixins: [postData],
    props: {
        baseData: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        title() {
            if (this.dialogVisible) {
                if (this.dialogType === "add") {
                    return this.$lang("add_vlan_list");
                }
                if (this.dialogType === "delete") {
                    return this.$lang("del_vlan_list");
                }
                return this.$lang("set");
            }
            return "";
        },
    },
    data() {
        return {
            PORT_TYPE_MAP,
            dialogVisible: false,
            dialogType: "",
            row: {},
        };
    },
    methods: {
        openDialog(type, row) {
            this.row = row;
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["port-vlan-config-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((data) => {
                if (data) {
                    this.submitAction(data, this.dialogType);
                }
            });
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        submitAction(data, type) {
            const ACTIONS = {
                port_type(data) {
                    if (data.port_type === this.baseData.port_type) {
                        this.$message.info(this.$lang("modify_tips"));
                        return;
                    }
                    return {
                        url: "/switch_port?form=vlan_type",
                        data: {
                            method: "set",
                            param: {
                                port_id: data.port_id,
                                port_type: data.port_type,
                            },
                        },
                    };
                },
                pvid(data) {
                    if (data.pvid === this.baseData.pvid) {
                        this.$message.info(this.$lang("modify_tips"));
                        return;
                    }
                    return {
                        url: "/switch_port?form=defaultvlan",
                        data: {
                            method: "set",
                            param: {
                                port_id: data.port_id,
                                pvid: data.pvid,
                            },
                        },
                    };
                },
                add(data) {
                    return {
                        url: "/switch_port?form=vlan",
                        data: {
                            method: "set",
                            param: {
                                port_id: data.port_id,
                                port_type: data.port_type,
                                vlan_list: data.vlanlist,
                                vlan_mode: data.vlan_mode,
                            },
                        },
                    };
                },
                delete(data) {
                    return {
                        url: "/switch_port?form=vlan",
                        data: {
                            method: "delete",
                            param: {
                                port_id: data.port_id,
                                port_type: data.port_type,
                                vlan_list: data.vlanlist,
                                vlan_mode: data.vlan_mode,
                            },
                        },
                    };
                },
            };
            if (isFunction(ACTIONS[type])) {
                const result = ACTIONS[type].call(this, data);
                if (isDef(result)) {
                    const { url, data: post_params } = result;
                    this.postData(url, post_params)
                        .then(() => {
                            this.$emit("refresh");
                        })
                        .catch(() => {});
                }
                this.closeDialog();
            }
        },
        dropdownClick({ action, row }) {
            const ACTIONS = {
                port_type(row) {
                    this.openDialog("port_type", row);
                },
                pvid(row) {
                    this.openDialog("pvid", row);
                },
                add_vlan(row) {
                    this.openDialog("add", row);
                },
                del_vlan(row) {
                    this.openDialog("delete", row);
                },
            };
            if (isFunction(ACTIONS[action])) {
                ACTIONS[action].call(this, row);
            }
        },
    },
};
</script>

<style lang="less" scoped>
.port-vlan-config {
    padding: 0 10px;
    .base-font-style;
    .port-vlan-config-item {
        padding: 10px 0;
        border-bottom: @border-style;
        &:first-child {
            border-top: @border-style;
        }
    }
}
.el-dropdown-link {
    color: @titleColor;
}
</style>