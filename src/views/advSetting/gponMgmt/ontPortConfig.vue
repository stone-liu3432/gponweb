<template>
    <div>
        <page-header type="pon" hasOnu @port-change="portChange">
            <template slot="title">{{ $lang('onu_port_cfg') }}</template>
        </page-header>
        <template v-if="ont_id !== 0xffff">
            <el-table :data="portList" border>
                <el-table-column :label="$lang('uniport')" prop="uniport"></el-table-column>
                <el-table-column :label="$lang('unitype')" prop="unitype">
                    <template slot-scope="scope">{{ UNI_TYPES[scope.row.unitype] }}</template>
                </el-table-column>
                <el-table-column :label="$lang('epspeed')">
                    <template
                        slot-scope="scope"
                    >{{ (scope.row.epspeed === 0xffff || scope.row.epspeed === 0) ? 'Auto' : scope.row.epspeed }}</template>
                </el-table-column>
                <el-table-column :label="$lang('epduplex')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.epduplex ? $lang('half') : $lang('full') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('adminstate')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.adminstate ? $lang('disable') : $lang('enable') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('epautoneg')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.epautoneg ? $lang('disable') : $lang('enable') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('flow_ctrl')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.flow_ctrl ? $lang('disable') : $lang('enable') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('ring')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.ring === 1 ? $lang('on') : $lang('off') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('na_vlan_id')" prop="na_vlan_id">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.na_vlan_id === 0x1000 ? '-' : scope.row.na_vlan_id }}</template>
                </el-table-column>
                <el-table-column :label="$lang('na_vlan_pri')" prop="na_vlan_pri">
                    <template
                        slot-scope="scope"
                    >{{ (scope.row.na_vlan_id === 0x1000 || scope.row.na_vlan_pri > 7) ? '-' : scope.row.na_vlan_pri }}</template>
                </el-table-column>
                <el-table-column :label="$lang('config')">
                    <template slot-scope="scope">
                        <el-dropdown @command="command">
                            <span class="el-dropdown-link">
                                <span>{{ $lang('config') }}</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    :command="{ action: 'port', data: scope.row }"
                                >{{ $lang('config', 'port') }}</el-dropdown-item>
                                <el-dropdown-item
                                    :command="{ action: 'vlan', data: scope.row }"
                                >{{$lang('config', 'na_vlan_id')}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- <el-button type="text" @click="openDialog(scope.row)">{{ $lang('config') }}</el-button>
                        <el-button
                            type="text"
                            @click="openDialog(scope.row)"
                        >{{ $lang('na_vlan_id') }}</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ $lang('config') }}</div>
            <ont-port-config-form ref="ont-port-config-form"></ont-port-config-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('ont-port-config-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef, isFunction } from "@/utils/common";
import { UNI_TYPES } from "@/utils/commonData";
import ontPortConfigForm from "./ontPortConfig/ontPortConfigForm";
import postData from "@/mixin/postData";
export default {
    name: "ontPortConfig",
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    components: { ontPortConfigForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            UNI_TYPES,
            port_id: 0,
            ont_id: 0xffff,
            portList: [],
            dialogVisible: false
        };
    },
    methods: {
        getData(port_id, ont_id) {
            this.portList = [];
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "port_attr",
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
        },
        openDialog(type, data) {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["ont-port-config-form"].init(type, data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        port(form) {
                            if (form.flags === 0) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/gponont_mgmt?form=port_attr",
                                data: {
                                    method: "set",
                                    param: {
                                        identifier: form.identifier,
                                        uniport: form.uniport,
                                        unitype: form.unitype,
                                        flags: form.flags,
                                        epspeed: form.epspeed,
                                        epduplex: form.epduplex,
                                        epautoneg: form.epautoneg,
                                        adminstate: form.adminstate,
                                        flow_ctrl: form.flow_ctrl,
                                        ring: form.ring
                                    }
                                }
                            };
                        },
                        vlan(form) {
                            if (!form.flags) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/gponont_mgmt?form=natvie_vlan",
                                data: {
                                    method: "set",
                                    param: {
                                        identifier: form.identifier,
                                        uniport: form.uniport,
                                        unitype: form.unitype,
                                        na_vlan_id: form.na_vlan_id,
                                        na_vlan_pri: form.na_vlan_pri
                                    }
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, formData);
                        if (res) {
                            const { url, data } = res;
                            url &&
                                data &&
                                this.postData(url, data)
                                    .then(() => {
                                        this.getData(this.port_id, this.ont_id);
                                    })
                                    .catch(() => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        },
        command({ action, data }) {
            this.openDialog(action, data);
        }
    }
};
</script>

<style lang="less" scoped>
.el-dropdown-link {
    cursor: pointer;
    color: @titleColor;
}
.el-icon-arrow-down {
    font-size: 12px;
}
</style>