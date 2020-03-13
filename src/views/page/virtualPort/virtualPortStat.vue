<template>
    <div>
        <div style="margin: 12px;">
            <el-button type="primary" @click="chagneAllState(false)">{{ $lang('disable_all') }}</el-button>
            <el-button
                type="primary"
                @click="chagneAllState(true)"
                style="margin-left: 30px;"
            >{{ $lang('enable_all') }}</el-button>
            <el-button
                type="primary"
                @click="clearStat()"
                style="margin-left: 30px;"
            >{{ $lang('flush_all') }}</el-button>
        </div>
        <el-table :data="showList" border stripe>
            <el-table-column :label="$lang('svp_id')" prop="svp_id"></el-table-column>
            <el-table-column :label="$lang('admin')" prop="admin">
                <template
                    slot-scope="scope"
                >{{ scope.row.admin ? $lang('enable') : $lang('disable') }}</template>
            </el-table-column>
            <el-table-column :label="$lang('ig_packets')" prop="ig_packets"></el-table-column>
            <el-table-column :label="$lang('ig_bytes')" prop="ig_bytes"></el-table-column>
            <el-table-column :label="$lang('eg_packets')" prop="eg_packets"></el-table-column>
            <el-table-column :label="$lang('eg_bytes')" prop="eg_bytes"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="chagneState(scope.row)"
                    >{{ $lang(scope.row.admin ? 'disable' : 'enable', 'statistical') }}</el-button>
                    <el-button type="text" @click="clearStat(scope.row)">{{ $lang('clear') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin: 12px; float: right"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            hide-on-single-page
            layout="total, sizes, prev, pager, next, jumper"
            :total="statList.length"
        ></el-pagination>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef } from "@/utils/common";
import postData from "@/mixin/postData";
export default {
    name: "virtualProtStat",
    computed: {
        ...mapGetters(["$lang"]),
        showList() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.statList.slice(start, start + this.pageSize);
        }
    },
    mixins: [postData],
    data() {
        return {
            statList: [],
            currentPage: 1,
            pageSize: 10
        };
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.statList = [];
            this.$http
                .get("/switch_svp?form=svp_stat_get")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.statList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        clearStat(row) {
            this.$confirm(this.$lang("if_sure", "clear", "statistical") + " ?")
                .then(_ => {
                    const url = "/switch_svp?form=svp_stat_clear";
                    let svp_id;
                    if (isDef(row)) {
                        svp_id = row.svp_id;
                    } else {
                        svp_id = 0xff;
                    }
                    const data = {
                        method: "set",
                        param: {
                            svp_id
                        }
                    };
                    this.postData(url, data)
                        .then(_ => {
                            this.getData();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        chagneState(row) {
            const status = !!row.admin;
            this.$confirm(
                this.$lang(
                    "if_sure",
                    status ? "disable" : "enable",
                    "statistical"
                ) + " ?"
            )
                .then(_ => {
                    const data = {
                        method: "set",
                        param: {
                            svp_id: row.svp_id
                        }
                    };
                    let url;
                    if (status) {
                        url = "/switch_svp?form=svp_stat_disable";
                    } else {
                        url = "/switch_svp?form=svp_stat_enable";
                    }
                    this.postData(url, data)
                        .then(_ => {
                            this.getData();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        chagneAllState(status) {
            this.$confirm(
                this.$lang(
                    "if_sure",
                    status ? "enable" : "disable",
                    "all",
                    "statistical"
                ) + " ?"
            )
                .then(_ => {
                    const data = {
                        method: "set",
                        param: {
                            svp_id: 0xffff
                        }
                    };
                    let url = "/switch_svp?form=svp_stat_disable";
                    if (status) {
                        url = "/switch_svp?form=svp_stat_enable";
                    }
                    this.postData(url, data)
                        .then(_ => {
                            this.getData();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>