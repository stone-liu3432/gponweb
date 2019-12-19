<template>
    <div>
        <page-header @port-change="portChange" type="pon">
            <div slot="title">{{ $lang('onu_allow') }}</div>
        </page-header>
        <div style="padding: 0 10px;">
            <el-table
                :data="onu_list"
                border
                stripe
                :header-cell-style="{'text-align': 'center'}"
                :cell-style="{'text-align': 'center'}"
                @selection-change="selectionChange"
            >
                <template v-if="isBatch">
                    <el-table-column type="selection" width="55"></el-table-column>
                </template>
                <el-table-column :label="$lang('onu_id')" width="100px">
                    <template slot-scope="scope">{{ `ONU${scope.row.port_id}/${scope.row.onu_id}` }}</template>
                </el-table-column>
                <el-table-column :label="$lang('onu_name')" prop="onu_name"></el-table-column>
                <el-table-column :label="$lang('macaddr')" prop="macaddr"></el-table-column>
                <el-table-column :label="$lang('status')" prop="status" width="100px">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status.toLowerCase() === 'online'">
                            <el-tag type="success">{{ scope.row.status }}</el-tag>
                        </template>
                        <template v-else>
                            <el-tag type="danger">{{ scope.row.status }}</el-tag>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column :label="$lang('auth_state')" width="100px">
                    <template slot-scope="scope">{{ scope.row.auth_state ? 'True' : 'False' }}</template>
                </el-table-column>
                <el-table-column>
                    <template slot="header" slot-scope="scope">
                        <div style="text-align: left;">
                            <el-button
                                plain
                                type="primary"
                                @click="refreshData"
                            >{{ $lang('refresh') }}</el-button>
                            <template v-if="!isBatch">
                                <span style="margin: 0 20px;">{{ $lang('find') }} ONU</span>
                                <el-input
                                    size="mini"
                                    v-model="findStr"
                                    style="width: 200px;"
                                    :placeholder="`${$lang('macaddr')} / ${$lang('onu_name')}`"
                                ></el-input>
                            </template>
                            <template v-else>
                                <el-button
                                    type="text"
                                    style="margin-left: 24px;"
                                    @click="delete_onu()"
                                >{{ $lang('delete') }}</el-button>
                                <el-button
                                    type="text"
                                    @click="add_to_deny()"
                                    style="margin-left: 24px;"
                                >{{ $lang('add_to_deny') }}</el-button>
                            </template>
                            <el-dropdown
                                style="margin-right: 30px; float: right; line-height: 30px;"
                                @command="moreFeature"
                            >
                                <span style="color: #909399;">
                                    {{ $lang('more_features') }}
                                    <i
                                        class="el-icon-arrow-down el-icon--right"
                                    ></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'add' }"
                                    >{{ $lang('add') }} ONU</el-dropdown-item>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'sla_cfg' }"
                                    >{{ $lang('sla_cfg') }}</el-dropdown-item>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'onu_deny' }"
                                    >{{ $lang('onu_deny') }}</el-dropdown-item>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'batch_mgmt_onu' }"
                                        v-if="!isBatch"
                                    >{{ $lang('batch_mgmt_onu') }}</el-dropdown-item>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'exit_batch_onu' }"
                                        v-else
                                    >{{ $lang('exit_batch_onu') }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                    <el-table-column :label="$lang('register_time')" prop="register_time"></el-table-column>
                    <el-table-column :label="$lang('last_down_time')" prop="last_down_time"></el-table-column>
                    <el-table-column :label="$lang('last_down_reason')" prop="last_down_reason"></el-table-column>
                    <el-table-column :label="$lang('config')">
                        <template slot-scope="scope">
                            <el-dropdown @command="onuConfig">
                                <span>
                                    {{ $lang('config') }}
                                    <i
                                        class="el-icon-arrow-down el-icon--right"
                                    ></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'detail' }"
                                    >{{ $lang('detail') }}</el-dropdown-item>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'onu_port_cfg' }"
                                    >{{ $lang('onu_port_cfg') }}</el-dropdown-item>
                                    <template v-if="scope.row.auth_state">
                                        <el-dropdown-item
                                            :command="{ data: scope.row, action: 'unAuth' }"
                                        >{{ $lang('unAuth') }}</el-dropdown-item>
                                    </template>
                                    <template v-else>
                                        <el-dropdown-item
                                            :command="{ data: scope.row, action: 'auth' }"
                                        >{{ $lang('auth') }}</el-dropdown-item>
                                    </template>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'del_onu' }"
                                    >{{ $lang('del_onu') }}</el-dropdown-item>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'add_to_deny' }"
                                    >{{ $lang('add_to_deny') }}</el-dropdown-item>
                                    <el-dropdown-item
                                        :command="{ data: scope.row, action: 'reboot_onu' }"
                                    >{{ $lang('reboot_onu') }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :title="`${$lang('add')} ONU`"
            :visible.sync="dialogVisible"
            :before-close="beforeClose"
        >
            <add-onu-form ref="add-onu-form"></add-onu-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('add-onu-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { isFunction, debounce } from "@/utils/common";
import rebootOnu from "@/mixin/onu/rebootOnu";
import addToDeny from "@/mixin/onu/addToDeny";
import deleteOnu from "@/mixin/onu/deleteOnu";
import addOnuForm from "./addOnuForm";
export default {
    name: "onuAllow",
    components: { addOnuForm },
    computed: {
        ...mapState(["system", "pon", "onulist", "port"]),
        ...mapGetters(["getPortName", "$lang", "validateMsg"]),
        onu_list() {
            if (this.findStr) {
                return this.onulist.filter(
                    item =>
                        item.macaddr.indexOf(this.findStr) > -1 ||
                        item.onu_name.indexOf(this.findStr) > -1
                );
            }
            return this.onulist;
        }
    },
    mixins: [addToDeny, deleteOnu, rebootOnu],
    data() {
        return {
            isBatch: false,
            findStr: "",
            port_id: 0,
            selectedOnulist: [],
            dialogVisible: false
        };
    },
    created() {},
    methods: {
        ...mapActions(["getSystemInfo", "getPon", "getOnuList"]),
        portChange(port_id) {
            this.getOnuList(port_id);
            this.port_id = port_id;
        },
        onuConfig(command) {
            const { data, action } = command;
            const ACTIONS = {
                detail(data) {},
                onu_port_cfg(data) {},
                del_onu(data) {
                    this.delete_onu(data);
                },
                add_to_deny(data) {
                    this.add_to_deny(data);
                },
                reboot_onu(data) {
                    this.rebootOnu(data)
                        .then(_ => {
                            this.getOnuList(data.port_id);
                        })
                        .catch(_ => {});
                },
                auth(data) {
                    const post_params = {
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: data.onu_id,
                            macaddr: data.macaddr,
                            auth_state: 1,
                            onu_type: "",
                            onu_desc: ""
                        }
                    };
                    const tips_authstate = this.$lang("tips_auth_state");
                    this.changeAuthState(post_params, tips_authstate);
                },
                unAuth(data) {
                    const post_params = {
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: data.onu_id,
                            macaddr: data.macaddr,
                            auth_state: 0,
                            onu_type: "",
                            onu_desc: ""
                        }
                    };
                    const tips_authstate = this.$lang("tips_unauth_state");
                    this.changeAuthState(post_params, tips_authstate);
                }
            };
            if (isFunction(ACTIONS[action])) {
                ACTIONS[action].call(this, data);
            }
        },
        moreFeature(command) {
            const { data, action } = command;
            const ACTIONS = {
                add() {
                    this.dialogVisible = true;
                },
                slc_cfg(data) {},
                onu_deny(data) {},
                batch_mgmt_onu() {
                    this.isBatch = true;
                    this.selectedOnulist = [];
                },
                exit_batch_onu() {
                    this.isBatch = false;
                    this.selectedOnulist = [];
                }
            };
            if (isFunction(ACTIONS[action])) {
                ACTIONS[action].call(this, data);
            }
        },
        selectionChange(val) {
            this.selectedOnulist = val;
        },
        add_to_deny(data) {
            let url = "/onu_allow_list";
            let olist = data ? data.onu_id : "";
            if (!data && this.isBatch) {
                if (!this.selectedOnulist.length) {
                    return this.$message.info(this.$lang("no_select_onu"));
                }
                url = "/onu_allow_list?form=batch";
                olist = this.selectedOnulist
                    .map(item => item.onu_id)
                    .sort((a, b) => a - b);
            }
            const post_params = {
                method: "reject",
                param: {
                    port_id: this.port_id,
                    onu_id: olist,
                    macaddr: data ? data.macaddr : ""
                }
            };
            this.addToDeny(url, post_params)
                .then(_ => {
                    this.getOnuList(this.port_id);
                })
                .catch(_ => {});
        },
        delete_onu(data) {
            let url = "/onu_allow_list";
            let olist = data ? data.onu_id : "";
            if (!data && this.isBatch) {
                if (!this.selectedOnulist.length) {
                    return this.$message.info(this.$lang("no_select_onu"));
                }
                url = "/onu_allow_list?form=batch";
                olist = this.selectedOnulist
                    .map(item => item.onu_id)
                    .sort((a, b) => a - b);
            }
            const post_params = {
                method: "delete",
                param: {
                    port_id: this.port_id,
                    onu_id: olist,
                    macaddr: data ? data.macaddr : ""
                }
            };
            this.deleteOnu(url, olist)
                .then(_ => {
                    this.getOnuList(this.port_id);
                })
                .catch(_ => {});
        },
        changeAuthState(data, tips) {
            this.$confirm(tips)
                .then(_ => {
                    this.$http
                        .post("/onu_allow_list", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(this.$lang("setting_ok"));
                                this.getOnuList(this.port_id);
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName]
                .validate()
                .then(data => {
                    const post_params = {
                        method: "add",
                        param: {
                            port_id: this.port_id,
                            onu_id: data.onu_id >>> 0,
                            macaddr: data.macaddr,
                            auth_state: data.auth_state,
                            onu_type: "",
                            onu_desc: data.desc
                        }
                    };
                    this.$http
                        .post("/onu_allow_list", post_params)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(this.$lang("setting_ok"));
                                this.getOnuList();
                                this.dialogVisible = false;
                            } else if (res.data.code > 1) {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        beforeClose(done) {
            this.$refs["add-onu-form"].resetForm();
            done();
        },
        closeDialog() {
            this.$refs["add-onu-form"].resetForm();
            this.dialogVisible = false;
        },
        refreshData() {
            debounce(this.getOnuList, 1000, this, this.port_id);
        }
    },
    watch: {}
};
</script>

<style lang="less" scoped>
</style>