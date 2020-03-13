<template>
    <div>
        <el-table :data="showList" border stripe>
            <el-table-column :label="$lang('traffic_profile_id')" prop="traffic_profile_id"></el-table-column>
            <el-table-column :label="$lang('cir')" prop="cir"></el-table-column>
            <el-table-column :label="$lang('cbs')" prop="cbs"></el-table-column>
            <el-table-column :label="$lang('pir')" prop="pir"></el-table-column>
            <el-table-column :label="$lang('pbs')" prop="pbs"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button type="text">{{ $lang('delete') }}</el-button>
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
import { isArray } from "@/utils/common";
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
        }
    }
};
</script>

<style lang="less" scoped>
</style>