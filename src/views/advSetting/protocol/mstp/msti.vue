<template>
    <div>
        <h4>
            <span>{{ $lang('msti', 'info') }}</span>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="openDialog('create')"
            >{{ $lang('add') }}</el-button>
        </h4>
        <el-table :data="mstiTable" border>
            <el-table-column :label="`${$lang('instance')} ID`" prop="mstid"></el-table-column>
            <el-table-column :label="$lang('msti_vlanlist')" prop="msti_vlanlist"></el-table-column>
            <el-table-column :label="$lang('bridge_addr')" prop="bridge_addr"></el-table-column>
            <el-table-column :label="$lang('bridge_prio')" prop="bridge_prio"></el-table-column>
            <el-table-column :label="$lang('designate_addr')" prop="designate_addr"></el-table-column>
            <el-table-column :label="$lang('designate_prio')" prop="designate_prio"></el-table-column>
            <el-table-column :label="$lang('root_port_name')" prop="root_port_name">
                <template
                    slot-scope="scope"
                >{{ scope.row.root_port_name ? getPortName(scope.row.root_port_name) : 'None' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('internal_path_cost')" prop="internal_path_cost"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-dropdown @command="command">
                        <span class="el-dropdown-link">
                            {{ $lang('config') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ action: 'detail', row: scope.row }"
                            >{{ $lang('show_detail') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'add', row: scope.row }"
                            >{{ $lang('add', 'vlan_list') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'delete', row: scope.row }"
                            >{{ $lang('delete', 'vlan_list') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'prio', row: scope.row }"
                            >{{ $lang('config', 'bridge_prio') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="detailVisible" append-to-body width="800px">
            <msti-detail :row="row" @trigger-event="triggerEvent"></msti-detail>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title"></div>
            <msti-form ref="msti-form"></msti-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('msti-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isFunction } from "@/utils/common";
import postData from "@/mixin/postData";
import mstiDetail from "./mstiDetail";
import mstiForm from "./mstiForm";
export default {
    name: "mstpMsti",
    components: { mstiDetail, mstiForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            mstiTable: [],
            detailVisible: false,
            dialogVisible: false,
            row: {}
        };
    },
    created() {
        this.getMstiTable();
    },
    methods: {
        getMstiTable() {
            this.mstiTable = [];
            this.$http
                .get("/switch_mstp?form=msti_status_get")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.mstiTable = res.data.data;
                            if (this.detailVisible) {
                                const target = res.data.data.filter(
                                    item => item.mstid === this.row.mstid
                                )[0];
                                if (target) {
                                    this.row = target;
                                } else {
                                    this.row = {};
                                    this.detailVisible = false;
                                }
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        command({ action, row }) {
            this.row = row;
            if (action === "detail") {
                this.detailVisible = true;
                return;
            }
            this.openDialog(action, row);
        },
        triggerEvent(type, row, data) {
            this.openDialog(type, row, data);
        },
        openDialog(type, row, data) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["msti-form"].init(type, row, data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        create(form) {
                            return {
                                url: "/switch_mstp?form=mstp_vlan_map",
                                data: {
                                    method: "set",
                                    param: {
                                        mstid: form.mstid,
                                        map_action: 0,
                                        vlan_list: form.vlan_list
                                    }
                                }
                            };
                        },
                        add(form) {
                            return {
                                url: "/switch_mstp?form=mstp_vlan_map",
                                data: {
                                    method: "set",
                                    param: {
                                        mstid: form.mstid,
                                        map_action: 0,
                                        vlan_list: form.vlan_list
                                    }
                                }
                            };
                        },
                        delete(form) {
                            return {
                                url: "/switch_mstp?form=mstp_vlan_map",
                                data: {
                                    method: "set",
                                    param: {
                                        mstid: 1,
                                        map_action: 1,
                                        vlan_list: form.vlan_list
                                    }
                                }
                            };
                        },
                        prio(form) {
                            if (
                                this.row.bridge_prio / 4096 ===
                                form.bridge_prio
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_mstp?form=msti_priority_set",
                                data: {
                                    method: "set",
                                    param: {
                                        mstid: form.mstid,
                                        bridge_prio: form.bridge_prio
                                    }
                                }
                            };
                        },
                        port(form) {
                            return {
                                url: "/switch_mstp?form=msti_port_set",
                                data: {
                                    method: "set",
                                    param: {
                                        port_id: form.port_id,
                                        mstid: form.mstid,
                                        admin_internal_cost:
                                            form.admin_internal_cost,
                                        set_admin_internal_cost:
                                            form.set_admin_internal_cost,
                                        port_priority: form.port_priority,
                                        set_port_priority:
                                            form.set_port_priority
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
                                    .then(_ => {
                                        this.getMstiTable();
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
h4 {
    color: @titleColor;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
</style>