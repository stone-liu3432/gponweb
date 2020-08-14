<template>
    <div>
        <el-table :data="portlist" border>
            <el-table-column :label="$lang('port_id')" prop="port_id">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('bpdu_guard_port')" prop="bpdu_guard_port">
                <template
                    slot-scope="scope"
                >{{ scope.row.bpdu_guard_port ? $lang('enable') : $lang('disable') }}</template>
            </el-table-column>
            <el-table-column :label="$lang('loop_detect_guard')" prop="loop_detect_guard">
                <template
                    slot-scope="scope"
                >{{ scope.row.loop_detect_guard ? $lang('enable') : $lang('disable') }}</template>
            </el-table-column>
            <el-table-column :label="$lang('edge_port')" prop="edge_port">
                <template
                    slot-scope="scope"
                >{{ scope.row.auto_edge_port === 1 ? 'Auto' : scope.row.admin_edge_port ? 'True' : 'False' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('admin_p2p')" prop="admin_p2p">
                <template slot-scope="scope">{{ $lang(ADMIN_P2P_MAP[scope.row.admin_p2p]) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('oper_p2p')" prop="oper_p2p">
                <template slot-scope="scope">{{ scope.row.oper_p2p ? 'True' : 'False' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-dropdown @command="command">
                        <span class="el-dropdown-link">
                            {{ $lang('config') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ action: 'bpdu_guard_port', row: scope.row }"
                            >{{ $lang('bpdu_guard_port') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'loop_detect_guard', row: scope.row }"
                            >{{ $lang('loop_detect_guard') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'admin_edge_port', row: scope.row }"
                            >{{ $lang('admin_edge_port') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'admin_p2p', row: scope.row }"
                            >{{ $lang('admin_p2p') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'mcheck', row: scope.row }"
                            >{{ $lang('mcheck') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ $lang('config') }}</div>
            <mstp-port-form ref="mstp-port-form"></mstp-port-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('mstp-port-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import postData from "@/mixin/postData";
import { isArray, isFunction } from "@/utils/common";
import { ADMIN_P2P_MAP } from "@/utils/commonData";
import mstpPortForm from "./portForm";
export default {
    name: "mstpPort",
    components: { mstpPortForm },
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
            portlist: [],
            ADMIN_P2P_MAP,
            dialogVisible: false
        };
    },
    created() {
        this.getPorts();
    },
    methods: {
        getPorts() {
            this.portlist = [];
            this.$http
                .get("/switch_mstp?form=port_status_get")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.portlist = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        command({ action, row }) {
            if (action === "mcheck") {
                this.triggerMcheck(row);
            } else {
                this.openDialog(action, row);
            }
        },
        openDialog(type, row) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["mstp-port-form"].init(type, row);
            });
        },
        triggerMcheck(row) {
            this.$confirm(this.$lang("if_sure") + " ?")
                .then(_ => {
                    this.postData("/switch_mstp?form=mcheck_trigger", {
                        method: "set",
                        param: {
                            port_id: row.port_id,
                            mcheck: 0
                        }
                    })
                        .then(_ => {
                            this.getPorts();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                const ACTIONS = {
                    bpdu_guard_port(form) {
                        return {
                            url: "/switch_mstp?form=cist_port_set",
                            data: {
                                method: "set",
                                param: {
                                    port_id: form.port_id,
                                    bpdu_guard_port: form.bpdu_guard_port,
                                    set_bpdu_guard_port: 1,
                                    admin_p2p: 0,
                                    set_admin_p2p: 0,
                                    admin_external_cost: 200000,
                                    set_admin_external_cost: 0
                                }
                            }
                        };
                    },
                    loop_detect_guard(form) {
                        return {
                            url: "/switch_mstp?form=loop_detect_guard",
                            data: {
                                method: "set",
                                param: {
                                    port_id: form.port_id,
                                    loop_detect_guard: form.loop_detect_guard
                                }
                            }
                        };
                    },
                    admin_edge_port(form) {
                        return {
                            url: "/switch_mstp?form=cist_edge_port_set",
                            data: {
                                method: "set",
                                param: {
                                    port_id: form.port_id,
                                    admin_edge_port: form.admin_edge_port
                                }
                            }
                        };
                    },
                    admin_p2p(form) {
                        return {
                            url: "/switch_mstp?form=cist_port_set",
                            data: {
                                method: "set",
                                param: {
                                    port_id: form.port_id,
                                    bpdu_guard_port: 0,
                                    set_bpdu_guard_port: 0,
                                    admin_p2p: form.admin_p2p,
                                    set_admin_p2p: 1,
                                    admin_external_cost: 0,
                                    set_admin_external_cost: 0
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
                                    this.getPorts();
                                })
                                .catch(_ => {});
                        this.dialogVisible = false;
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
</style>