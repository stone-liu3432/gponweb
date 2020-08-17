<template>
    <div class="port-vlan-config">
        <el-row :gutter="30" class="port-vlan-config-item">
            <el-col :span="4">{{ $lang('port_type') }}</el-col>
            <el-col :span="4">{{ PORT_TYPE_MAP[baseData.port_type] }}</el-col>
            <el-col :span="4">
                <el-button
                    type="text"
                    style="padding: 2px 0;"
                    @click="openDialog('port_type')"
                >{{ $lang('config') }}</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="30" class="port-vlan-config-item">
            <el-col :span="4">{{ $lang('pvid') }}</el-col>
            <el-col :span="4">{{ baseData.pvid }}</el-col>
            <el-col :span="4">
                <el-button
                    type="text"
                    style="padding: 2px 0;"
                    @click="openDialog('pvid')"
                >{{ $lang('config') }}</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="30" class="port-vlan-config-item">
            <el-col :span="4">{{ $lang('tagged') }}</el-col>
            <el-col :span="20">{{ baseData.tagged_vlan }}</el-col>
        </el-row>
        <el-row :gutter="30" class="port-vlan-config-item">
            <el-col :span="4">{{ $lang('untagged') }}</el-col>
            <el-col :span="20">{{ baseData.untagged_vlan }}</el-col>
        </el-row>
        <el-row :gutter="30" style="padding: 10px 0;">
            <template v-if="baseData.port_type !== 1">
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 10px;"
                    @click="openDialog('add')"
                >{{ $lang('add_vlan_list') }}</el-button>
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 30px;"
                    @click="openDialog('delete')"
                >{{ $lang('del_vlan_list') }}</el-button>
            </template>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <template slot="title">{{ title }}</template>
            <vlan-config-form :type="dialogType" :data="baseData" ref="port-vlan-config-form"></vlan-config-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-vlan-config-form')"
                >{{ $lang('apply') }}</el-button>
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
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(["$lang"]),
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
        }
    },
    data() {
        return {
            PORT_TYPE_MAP,
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {},
    methods: {
        openDialog(type) {
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["port-vlan-config-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
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
                    return {
                        url: "/switch_port?form=vlan_type",
                        data: {
                            method: "set",
                            param: {
                                port_id: data.port_id,
                                port_type: data.port_type
                            }
                        }
                    };
                },
                pvid(data) {
                    return {
                        url: "/switch_port?form=defaultvlan",
                        data: {
                            method: "set",
                            param: {
                                port_id: data.port_id,
                                pvid: data.pvid
                            }
                        }
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
                                vlan_mode: data.vlan_mode
                            }
                        }
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
                                vlan_mode: data.vlan_mode
                            }
                        }
                    };
                }
            };
            if (isFunction(ACTIONS[type])) {
                const result = ACTIONS[type].call(this, data);
                if (isDef(result)) {
                    const { url, data: post_params } = result;
                    this.postData(url, post_params)
                        .then(_ => {
                            this.$emit("refresh", data.port_id);
                        })
                        .catch(_ => {});
                }
                this.closeDialog();
            }
        }
    }
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
</style>