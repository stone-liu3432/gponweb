<template>
    <div>
        <div class="ont-auth-list-title">
            <nms-filter inline :data="ontList" :primary="filterable" @change="dataChange"></nms-filter>
            <span>{{ $lang('registered_onu') }}:</span>
            <span>{{ online + offline }}</span>
            <span style="margin-left: 30px;">{{ $lang('online') }}:</span>
            <span>{{ online }}</span>
            <span style="margin-left: 30px;color: #F56C6C;">{{ $lang('offline') }}:</span>
            <span style="color: #F56C6C;">{{ offline }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="refreshData"
            >{{ $lang('refresh') }}</el-button>
        </div>
        <el-table :data="showTable" border stripe ref="ont-info-table">
            <el-table-column :label="$lang('ont_id')">
                <template
                    slot-scope="scope"
                >{{ `${getPortName((scope.row.identifier >> 8) & 0xff)}/${(scope.row.identifier) & 0xff}` }}</template>
            </el-table-column>
            <el-table-column :label="$lang('ont_name')" prop="ont_name"></el-table-column>
            <el-table-column :label="$lang('ont_sn')" prop="ont_sn"></el-table-column>
            <el-table-column :label="$lang('state')" prop="state">
                <template slot-scope="scope">{{ ONT_STATES[scope.row.state] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('rstate')" prop="rstate">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.rstate === 1 ? 'success' : 'danger'"
                    >{{ ONT_RSTATES[scope.row.rstate] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$lang('cstate')" prop="cstate">
                <template slot-scope="scope">{{ ONT_CSTATES[scope.row.cstate] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('mstate')" prop="mstate">
                <template slot-scope="scope">{{ ONT_MSTATES[scope.row.mstate] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('last_u_time')" prop="last_u_time"></el-table-column>
            <el-table-column :label="$lang('last_d_time')" prop="last_d_time"></el-table-column>
            <el-table-column :label="$lang('last_d_cause')" prop="last_d_cause"></el-table-column>
            <el-table-column :label="$lang('config')" width="100" prop="config">
                <template slot-scope="scope">
                    <el-dropdown @command="dropdownClick">
                        <span class="dropdown-link">
                            {{ $lang('config') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ action: 'detail', row: scope.row }"
                            >{{ $lang('show_detail') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'changeState', row: scope.row }"
                            >{{ $lang('switch', 'ont','state') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'configDesc', row: scope.row }"
                            >{{ $lang('config', 'desc') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'reboot', row: scope.row }"
                            >{{ $lang('reboot', 'ont') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'delete', row: scope.row }"
                            >{{ $lang('delete', 'ont') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right; margin: 12px 0;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filterableList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang('config') }}</div>
            <ont-basic-form ref="ont-basic-form"></ont-basic-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('ont-basic-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isFunction, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
import rebootOnt from "@/mixin/onu/rebootOnt";
import ontBasicForm from "@/views/advSetting/gponMgmt/ontBasicInfo/ontBasicForm";
import {
    ONT_STATES,
    ONT_RSTATES,
    ONT_MSTATES,
    ONT_CSTATES
} from "@/utils/commonData";
export default {
    name: "onuAuthList",
    mixins: [postData, rebootOnt],
    components: { ontBasicForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        showTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filterableList.slice(start, start + this.pageSize);
        },
        online() {
            return this.ontList.filter(item => item.rstate === 1).length;
        },
        offline() {
            return this.ontList.filter(item => item.rstate !== 1).length;
        },
        filterable() {
            return [
                {
                    prop: "rstate",
                    label: this.$lang("rstate"),
                    value: 0,
                    type: "select",
                    secondaryData: this.ONT_RSTATES.map((item, index) => ({
                        value: index,
                        label: item
                    }))
                },
                {
                    prop: "ont_name",
                    label: this.$lang("ont_name"),
                    value: 1
                },
                {
                    prop: "ont_id",
                    label: this.$lang("ont_id"),
                    value: 2
                },
                {
                    prop: "ont_sn",
                    label: this.$lang("ont_sn"),
                    value: 3
                }
            ];
        }
    },
    props: {
        port_id: {
            type: Number,
            required: true
        }
    },
    created() {
        this.getData(this.port_id);
    },
    data() {
        return {
            ontList: [],
            filterableList: [],
            currentPage: 1,
            pageSize: 10,
            ONT_STATES,
            ONT_CSTATES,
            ONT_MSTATES,
            ONT_RSTATES,
            dialogVisible: false
        };
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    methods: {
        getData(port_id) {
            this.ontList = [];
            this.currentPage = 1;
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "auth",
                        port_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            const data = res.data.data.map(item => {
                                item.ont_id = item.identifier & 0xff;
                                return item;
                            });
                            this.ontList = data;
                        }
                    }
                })
                .catch(err => {});
        },
        dropdownClick(command) {
            const { action, row } = command;
            const ACTIONS = {
                delete(data) {
                    this.deleteOnt(data);
                },
                detail(data) {
                    this.showOntDetail(data);
                },
                changeState(data) {
                    this.changeOntState(data);
                },
                reboot(data) {
                    this.rebootOnt(data.identifier)
                        .then(_ => {
                            this.getData(this.port_id);
                        })
                        .catch(_ => {});
                },
                configDesc(data) {
                    this.setOntDesc(data);
                }
            };
            if (isFunction(ACTIONS[action])) {
                ACTIONS[action].call(this, row);
            }
        },
        deleteOnt(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.postData("/gponont_mgmt?form=auth", {
                        method: "delete",
                        param: {
                            identifier: [row.identifier]
                        }
                    })
                        .then(_ => {
                            this.getData(this.port_id);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        showOntDetail(row) {
            const port_id = (row.identifier >> 8) & 0xff,
                ont_id = row.identifier & 0xff;
            this.$router.push({
                path: "/onu_basic_info",
                query: { port_id, ont_id }
            });
        },
        refreshData() {
            debounce(this.getData, 1000, this, this.port_id);
        },
        dataChange(data) {
            this.filterableList = data;
        },
        changeOntState(data) {
            const flag = data.state;
            this.$confirm(
                flag
                    ? this.$lang("tips_deactive_state")
                    : this.$lang("tips_active_state")
            )
                .then(_ => {
                    const flags = flag ? 0x2 : 0x1;
                    const post_params = {
                        method: "set",
                        param: {
                            identifier: data.identifier,
                            flags,
                            ont_name: "",
                            ont_description: ""
                        }
                    };
                    this.postData("/gponont_mgmt?form=info", post_params)
                        .then(_ => {
                            this.getData(this.port_id);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        setOntDesc(data) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["ont-basic-form"].init(data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(form => {
                if (form) {
                    this.postData("/gponont_mgmt?form=info", {
                        method: "set",
                        param: form
                    })
                        .then(_ => {
                            this.getData(this.port_id);
                        })
                        .catch(_ => {})
                        .finally(_ => {
                            this.dialogVisible = false;
                        });
                }
            });
        }
    },
    watch: {
        port_id() {
            this.getData(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
.dropdown-link {
    color: @titleColor;
    cursor: pointer;
    font-size: 12px;
}
.ont-auth-list-title {
    margin: 20px 0 20px 0;
    span {
        display: inline-block;
        vertical-align: middle;
        .base-font-style;
        color: @titleColor;
    }
}
</style>