<template>
    <div>
        <div style="margin: 10px 0 10px 10px;">
            <el-button type="primary" size="small" @click="refreshData">{{ $lang('refresh') }}</el-button>
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
                                :command="{ action: 'delete', row: scope.row }"
                            >{{ $lang('delete') }}</el-dropdown-item>
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
            :total="ontList.length"
            hide-on-single-page
        ></el-pagination>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isFunction, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
import {
    ONT_STATES,
    ONT_RSTATES,
    ONT_MSTATES,
    ONT_CSTATES
} from "@/utils/commonData";
export default {
    name: "onuAuthList",
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        showTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.ontList.slice(start, start + this.pageSize);
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
            currentPage: 1,
            pageSize: 10,
            ONT_STATES,
            ONT_CSTATES,
            ONT_MSTATES,
            ONT_RSTATES
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
                            this.ontList = res.data.data;
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
        refreshData() {
            debounce(this.getData, 1000, this, this.port_id);
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
</style>