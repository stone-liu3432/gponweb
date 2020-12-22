<template>
    <div>
        <h3>
            <span>{{ $lang("multicast") }}</span>
            <el-button
                type="primary"
                style="margin-left: 30px"
                size="small"
                @click="openDialog"
                >{{ $lang("add", "static_table") }}</el-button
            >
            <el-button
                type="primary"
                style="margin-left: 30px"
                size="small"
                @click="deleteAll('static')"
                >{{ $lang("delete_all", "static_table") }}</el-button
            >
            <el-button
                type="primary"
                style="margin-left: 30px"
                size="small"
                @click="deleteAll('dynamic')"
                >{{ $lang("delete_all", "dynamic_table") }}</el-button
            >
            <el-button
                type="primary"
                style="margin-left: 30px"
                size="small"
                @click="refreshData"
                >{{ $lang("refresh") }}</el-button
            >
        </h3>
        <el-table :data="multiTable" border>
            <el-table-column
                :label="$lang('multi_ip')"
                prop="multi_ip"
            ></el-table-column>
            <el-table-column :label="$lang('vid')" prop="vid"></el-table-column>
            <el-table-column :label="$lang('action')" prop="action">
                <template slot-scope="scope">{{
                    MULTICAST_ACTIONS[scope.row.action]
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('host_portlist')"
                prop="host_portlist"
            >
                <template slot-scope="scope">{{
                    parsePortList(scope.row.host_portlist)
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('router_portlist')"
                prop="router_portlist"
            >
                <template slot-scope="scope">{{
                    parsePortList(scope.row.router_portlist)
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="100px">
                <template slot-scope="scope">
                    <el-button type="text" @click="delStatic(scope.row)">{{
                        $lang("delete")
                    }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right; margin: 12px 0"
            hide-on-single-page
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="multiData.length"
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang("add", "static_table") }}</div>
            <multicast-form ref="multicast-form"></multicast-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('multicast-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, parseStringAsList, debounce } from "@/utils/common";
import { MULTICAST_ACTIONS } from "@/utils/commonData";
import postData from "@/mixin/postData";
import multicastForm from "./multicastForm";
export default {
    name: "igmpMulticast",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        multiTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.multiData.slice(start, start + this.pageSize);
        },
    },
    components: { multicastForm },
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick((_) => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            multiData: [],
            currentPage: 1,
            pageSize: 10,
            MULTICAST_ACTIONS,
            dialogVisible: false,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.multiData = [];
            this.$http
                .get("/switch_igmp?form=entry")
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$http
                            .get("/igmp_snooping_table")
                            .then((_res) => {
                                if (_res.data.code === 1) {
                                    if (isArray(_res.data.data)) {
                                        this.multiData = _res.data.data;
                                    }
                                }
                            })
                            .catch((_err) => {});
                    }
                })
                .catch((err) => {});
        },
        parsePortList(str) {
            return parseStringAsList(str)
                .map((item) => this.getPortName(item))
                .join(",");
        },
        delStatic(data) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then((_) => {
                    const url = data.action
                            ? "/switch_igmp?form=static_entry"
                            : "/switch_igmp?form=dynamic_entry",
                        post_param = {
                            method: "delete",
                            param: {
                                multi_ip: data.multi_ip,
                                vid: data.vid,
                            },
                        };
                    this.postData(url, post_param)
                        .then((_) => {
                            this.getData();
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
        deleteAll(type) {
            this.$confirm(
                this.$lang(
                    "if_sure",
                    "delete_all",
                    type === "static" ? "static_table" : "dynamic_table"
                ) + " ?"
            )
                .then((_) => {
                    const url =
                            type === "static"
                                ? "/switch_igmp?form=static_entry_all"
                                : "/switch_igmp?form=dynamic_entry_all",
                        post_param = {
                            method: "delete",
                        };
                    this.postData(url, post_param)
                        .then((_) => {
                            this.getData();
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
        openDialog() {
            this.dialogVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate((data) => {
                if (data) {
                    const url = "/switch_igmp?form=static_entry",
                        post_params = {
                            method: "add",
                            param: {
                                multi_ip: data.multi_ip,
                                vid: data.vid,
                                port_id: data.port_id,
                            },
                        };
                    this.postData(url, post_params)
                        .then((_) => {
                            this.getData();
                        })
                        .catch((_) => {});
                    this.dialogVisible = false;
                }
            });
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
    },
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
</style>