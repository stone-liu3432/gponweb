<template>
    <div>
        <page-header title="ARP" type="none">
            <div slot="content">
                <el-button type="primary" size="mini" @click="deleteAll">{{ $lang('delete_all') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="refreshData"
                >{{ $lang('refresh') }}</el-button>
            </div>
        </page-header>
        <el-table :data="arpTable" border>
            <el-table-column :label="$lang('ipaddr')" prop="ipaddress"></el-table-column>
            <el-table-column :label="$lang('macaddr')" prop="macaddress"></el-table-column>
            <el-table-column :label="$lang('vlan_id')" prop="vlanid"></el-table-column>
            <el-table-column :label="$lang('port_id')" prop="protid">
                <template slot-scope="scope">{{ getPortName(scope.row.portid) }}</template>
            </el-table-column>
        </el-table>
        <div style="position: relative;">
            <el-pagination
                style="margin: 12px 0 30px 0; position: absolute; right: 0; top: 12px;"
                hide-on-single-page
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="arpList.length"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
export default {
    name: "arpTable",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        arpTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.arpList.slice(start, start + this.pageSize);
        }
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
            arpList: [],
            currentPage: 1,
            pageSize: 10
        };
    },
    created() {
        this.getArp();
    },
    methods: {
        getArp() {
            this.arpList = [];
            this.$http
                .get("/switch_route?form=arp_table")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.arpList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        deleteAll() {
            this.$confirm(this.$lang("if_sure", "delete_all") + " ARP ?")
                .then(_ => {
                    this.postData("/switch_route?form=arp_flush", {
                        method: "destroy",
                        param: {}
                    })
                        .then(_ => {
                            this.getArp();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        refreshData() {
            debounce(this.getArp, 1000, this);
        }
    }
};
</script>

<style lang="less" scoped>
</style>