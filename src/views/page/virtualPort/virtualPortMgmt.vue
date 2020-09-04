<template>
    <div>
        <el-form inline class="vp-title" size="small">
            <el-form-item :label="$lang('display_type') + ':'">
                <el-select v-model.number="filterable.type">
                    <el-option :value="0" :label="$lang('all')"></el-option>
                    <el-option :value="1" :label="$lang('svp_id')"></el-option>
                    <el-option :value="2" :label="$lang('port_id')"></el-option>
                    <el-option :value="3" :label="$lang('svp_type')"></el-option>
                    <el-option :value="4" :label="$lang('vlan_id')"></el-option>
                    <el-option :value="5" :label="$lang('gemport')"></el-option>
                    <el-option :value="6" :label="$lang('state')"></el-option>
                    <el-option :value="7" :label="$lang('admin_status')"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="filterable.type === 1">
                <el-form-item>
                    <el-input v-model="filterable.svp_id"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterable.type === 2">
                <el-form-item :label="$lang('port_id')">
                    <el-input style="width: 120px;" v-model="filterable.port_id"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('ont_id')">
                    <el-input style="width: 120px;" v-model="filterable.ont_id"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterable.type === 3">
                <el-form-item>
                    <el-select v-model.number="filterable.svp_type">
                        <template v-for="(item, index) in SVP_TYPE_MAP">
                            <el-option :value="Number(index)" :label="$lang(item)"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="filterable.type === 4">
                <el-form-item :label="$lang('new_svlan')">
                    <el-input style="width: 120px;" v-model="filterable.new_svlan"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('user_vlan')">
                    <el-input style="width: 120px;" v-model="filterable.user_vlan"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterable.type === 5">
                <el-form-item>
                    <el-input v-model="filterable.gemport"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterable.type === 6">
                <el-form-item>
                    <el-select v-model="filterable.state">
                        <el-option :value="0" :label="$lang('link_down')"></el-option>
                        <el-option :value="1" :label="$lang('link_up')"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="filterable.type === 7">
                <el-form-item>
                    <el-select v-model="filterable.admin_status">
                        <el-option :value="0" :label="$lang('disable')"></el-option>
                        <el-option :value="1" :label="$lang('enable')"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-button
                style="margin-left: 30px;"
                type="primary"
                size="small"
                @click="openDialog('add')"
            >{{ $lang('add') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="deleteVp()"
            >{{ $lang('delete_all') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="refreshData"
            >{{ $lang('refresh') }}</el-button>
        </el-form>
        <el-table :data="vpTable" border stripe>
            <el-table-column :label="$lang('svp_id')" prop="svp_id"></el-table-column>
            <el-table-column :label="$lang('new_svlan')" prop="new_svlan"></el-table-column>
            <el-table-column :label="$lang('port_id')" prop="port_id">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('ont_id')" prop="ont_id"></el-table-column>
            <el-table-column :label="$lang('gemport')" prop="gemport"></el-table-column>
            <el-table-column :label="$lang('svp_type')" prop="svp_type">
                <template slot-scope="scope">{{ $lang(SVP_TYPE_MAP[scope.row.svp_type]) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('user_vlan')" prop="user_vlan">
                <template slot-scope="scope">{{ scope.row.user_vlan ? scope.row.user_vlan : '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('tag_action')" prop="tag_action" width="130px">
                <template slot-scope="scope">{{ TAG_ACTIONS[scope.row.tag_action] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('inner_vlan')" prop="inner_vlan">
                <template
                    slot-scope="scope"
                >{{ (scope.row.tag_action === 4 || scope.row.tag_action === 5) ? scope.row.inner_vlan : '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('state')" prop="state">
                <template
                    slot-scope="scope"
                >{{ scope.row.state ? $lang('link_up') : $lang('link_down') }}</template>
            </el-table-column>
            <el-table-column :label="$lang('admin_status')" prop="admin_status">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.admin_status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeAdminState(scope.row)"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column :label="$lang('install_mode')" prop="install_mode">
                <template slot-scope="scope">{{ $lang(INSTALL_MODE_MAP[scope.row.install_mode]) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('desc')" prop="desc"></el-table-column>
            <el-table-column :label="$lang('config')" width="100px">
                <template slot-scope="scope">
                    <el-dropdown @command="dropdownClick">
                        <span class="el-dropdown-link">
                            {{ $lang('config') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ action: 'set', data: scope.row }"
                            >{{ $lang('modify') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'desc', data: scope.row }"
                            >{{ $lang('set', 'desc') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'delete', data: scope.row }"
                            >{{ $lang('delete') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin: 12px 0; float: right;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filterList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" width="600px">
            <template slot="title">{{ $lang(dialogType === 'set' ? 'modify' : dialogType) }}</template>
            <virtual-port-form ref="virtual-port-form" :type="dialogType" :data="dialogData"></virtual-port-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('virtual-port-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { isArray, isDef, isFunction, debounce } from "@/utils/common";
import {
    TAG_ACTIONS,
    SVP_TYPE_MAP,
    INSTALL_MODE_MAP
} from "@/utils/commonData";
import postData from "@/mixin/postData";
import virtualPortForm from "./virtualPortForm";
export default {
    name: "virtualPortMgmt",
    components: { virtualPortForm },
    computed: {
        ...mapState(["virtualPorts"]),
        ...mapGetters(["$lang", "getPortName"]),
        vpTable() {
            const list = this.virtualPorts.filter(item => {
                switch (this.filterable.type) {
                    case 0:
                        return true;
                    case 1:
                        return this.filterable.svp_id
                            ? String(item.svp_id).indexOf(
                                  this.filterable.svp_id
                              ) > -1
                            : true;
                    case 2: {
                        const pid = this.filterable.port_id,
                            oid = this.filterable.ont_id;
                        return pid
                            ? oid
                                ? String(item.port_id).indexOf(pid) > -1 &&
                                  String(item.ont_id).indexOf(oid) > -1
                                : String(item.port_id).indexOf(pid) > -1
                            : true;
                    }
                    case 3:
                        return item.svp_type === this.filterable.svp_type;
                    case 4: {
                        const sv = this.filterable.new_svlan,
                            cv = this.filterable.user_vlan;
                        return sv
                            ? cv
                                ? String(item.new_svlan).indexOf(sv) > -1 &&
                                  String(item.user_vlan).indexOf(cv) > -1
                                : String(item.new_svlan).indexOf(sv) > -1
                            : cv
                            ? String(item.user_vlan).indexOf(cv) > -1
                            : true;
                    }
                    case 5:
                        return (
                            String(item.gemport).indexOf(
                                this.filterable.gemport
                            ) > -1
                        );
                    case 6:
                        return item.state === this.filterable.state;
                    case 7:
                        return (
                            item.admin_status === this.filterable.admin_status
                        );
                    default:
                        return true;
                }
            });
            this.filterList = list;
            const start = this.pageSize * (this.currentPage - 1);
            return list.slice(start, start + this.pageSize);
        }
    },
    mixins: [postData],
    data() {
        return {
            TAG_ACTIONS,
            SVP_TYPE_MAP,
            INSTALL_MODE_MAP,
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false,
            dialogType: "",
            dialogData: {},
            filterList: [],
            filterable: {
                type: 0,
                svp_id: "",
                port_id: "",
                ont_id: "",
                svp_type: 1,
                new_svlan: "",
                user_vlan: "",
                gemport: "",
                state: 0,
                admin_status: 0
            }
        };
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    created() {
        this.getVirtualPort();
    },
    methods: {
        ...mapActions(["getVirtualPort"]),
        deleteVp(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    let url, post_param, loading;
                    if (isDef(row)) {
                        url = "/switch_svp?form=svp_delete";
                        post_param = {
                            method: "delete",
                            param: {
                                svp_id: row.svp_id,
                                new_svlan: row.new_svlan,
                                port_id: row.port_id,
                                ont_id: row.ont_id,
                                gemport: row.gemport,
                                svp_type: row.svp_type,
                                user_vlan: row.user_vlan,
                                tag_action: row.tag_action,
                                inner_vlan: row.inner_vlan
                            }
                        };
                    } else {
                        url = "/switch_svp?form=svp_delete_all";
                        post_param = { method: "delete", param: {} };
                        loading = this.$loading();
                    }
                    this.postData(url, post_param)
                        .then(_ => {
                            if (loading && isFunction(loading.close)) {
                                this.$nextTick(_ => {
                                    loading.close();
                                });
                            }
                            this.getVirtualPort();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        openDialog(type, data) {
            this.dialogType = type;
            isDef(data) && (this.dialogData = data);
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["virtual-port-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const ACTIONS = {
                        add(formData) {
                            return {
                                url: "/switch_svp?form=svp_create",
                                data: {
                                    method: "add",
                                    param: {
                                        svp_id: formData.svp_id,
                                        new_svlan: formData.new_svlan,
                                        port_id: formData.port_id,
                                        ont_id: formData.ont_id,
                                        gemport: formData.gemport,
                                        svp_type: formData.svp_type,
                                        user_vlan: formData.user_vlan,
                                        tag_action: formData.tag_action,
                                        inner_vlan: formData.inner_vlan
                                    }
                                }
                            };
                        },
                        set(formData) {
                            return {
                                url: "/switch_svp?form=svp_modify",
                                data: {
                                    method: "modify",
                                    param: {
                                        svp_id: formData.svp_id,
                                        new_svlan: formData.new_svlan,
                                        tag_action: formData.tag_action,
                                        inner_vlan: formData.inner_vlan
                                    }
                                }
                            };
                        },
                        desc(formData) {
                            return {
                                url: "/switch_svp?form=svp_desc",
                                data: {
                                    method: "set",
                                    param: {
                                        svp_id: formData.svp_id,
                                        desc: formData.desc
                                    }
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[this.dialogType])) {
                        const { url, data } = ACTIONS[this.dialogType].call(
                            this,
                            formData
                        );
                        url &&
                            data &&
                            this.postData(url, data)
                                .then(_ => {
                                    this.getVirtualPort();
                                })
                                .catch(_ => {});
                        this.dialogVisible = false;
                    }
                }
            });
        },
        dropdownClick(command) {
            const { action, data } = command;
            const ACTIONS = {
                set(row) {
                    this.openDialog("set", row);
                },
                delete(row) {
                    this.deleteVp(row);
                },
                desc(row) {
                    this.openDialog("desc", row);
                }
            };
            if (isFunction(ACTIONS[action])) {
                ACTIONS[action].call(this, data);
            }
        },
        changeAdminState(row) {
            row.admin_status ? (row.admin_status = 0) : (row.admin_status = 1);
            this.$confirm(
                this.$lang(
                    "if_sure",
                    row.admin_status ? "disable" : "enable",
                    "admin_status"
                ) + " ?"
            )
                .then(_ => {
                    const url = "/switch_svp?form=svp_admin_status",
                        data = {
                            method: "set",
                            param: {
                                svp_id: row.svp_id,
                                admin_status: !row.admin_status
                            }
                        };
                    this.postData(url, data)
                        .then(_ => {
                            this.getVirtualPort();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        refreshData() {
            debounce(this.getVirtualPort, 1000, this);
        },
        resetFilterable() {
            this.filterable = {
                type: 0,
                svp_id: "",
                port_id: "",
                ont_id: "",
                svp_type: 1,
                new_svlan: "",
                user_vlan: "",
                gemport: "",
                state: 0,
                admin_status: 0
            };
        }
    },
    watch: {
        virtualPorts() {
            this.resetFilterable();
        }
    }
};
</script>

<style lang="less" scoped>
.vp-title {
    margin: 12px 0 12px 10px;
    height: 32px;
    vertical-align: middle;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
.el-icon-arrow-down {
    font-size: 12px;
}
</style>