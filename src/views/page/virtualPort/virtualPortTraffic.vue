<template>
    <div>
        <div style="margin: 12px;">
            <el-button type="primary" size="small" @click="refreshData">{{ $lang('refresh') }}</el-button>
        </div>
        <el-table :data="showList" border stripe>
            <el-table-column :label="$lang('traffic_profile_id')" prop="traffic_profile_id"></el-table-column>
            <el-table-column label="cir" prop="cir"></el-table-column>
            <el-table-column label="cbs" prop="cbs"></el-table-column>
            <el-table-column label="pir" prop="pir"></el-table-column>
            <el-table-column label="pbs" prop="pbs"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteTraffic(scope.row)">{{ $lang('delete') }}</el-button>
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
            :total="trafficList.length"
        ></el-pagination>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
export default {
    name: "virtualPortTraffic",
    computed: {
        ...mapGetters(["$lang"]),
        showList() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.trafficList.slice(start, start + this.pageSize);
        }
    },
    data() {
        return {
            trafficList: [],
            pageSize: 10,
            currentPage: 1
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
            this.trafficList = [];
            this.$http
                .get("/switch_svp?form=traffic_profile_get")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.trafficList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        deleteTraffic(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.$http
                        .post("/switch_svp?form=traffic_profile_set", {
                            method: "set",
                            param: {
                                traffic_profile_id: row.traffic_profile_id,
                                action: 0, // delete
                                cir: row.cir,
                                cbs: row.cbs,
                                pir: row.pir,
                                pbs: row.pbs
                            }
                        })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("delete", "st_success")
                                );
                                this.getData();
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
        refreshData() {
            debounce(this.getData, 1000, this);
        }
    }
};
</script>

<style lang="less" scoped>
</style>