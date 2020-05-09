<template>
    <div>
        <h3>
            <span>{{ $lang('mvlan') }}</span>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="openDialog('add')"
            >{{ $lang('add') }}</el-button>
        </h3>
        <el-table :data="mvTable" border>
            <el-table-column :label="$lang('mvlan')" prop="mvlan"></el-table-column>
            <el-table-column :label="$lang('router_portlist')" prop="router_portlist">
                <template slot-scope="scope">{{ parsePortList(scope.row.router_portlist) || '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('mvlan_desc')" prop="mvlan_desc"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetail(scope.row)">{{ $lang('show_detail') }}</el-button>
                    <el-button type="text" @click="deleteMvlan(scope.row)">{{ $lang('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right; margin: 12px 0;"
            hide-on-single-page
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mvList.length"
        ></el-pagination>
        <el-dialog :visible.sync="detailVisible" append-to-body width="800px">
            <mv-detail
                ref="mv-detail"
                :row="mvItem"
                :mcUnknown="mcUnknowns"
                :programs="programs"
                @config-mvlan="configMvlan"
            ></mv-detail>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="640px">
            <div slot="title"></div>
            <mv-form ref="mv-form"></mv-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('mv-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef, parseStringAsList, isFunction } from "@/utils/common";
import postData from "@/mixin/postData";
import mvDetail from "./mvDetail";
import mvForm from "./mvForm";
export default {
    name: "multicastVlan",
    components: { mvDetail, mvForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        mvTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.mvList.slice(start, start + this.pageSize);
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
            mvList: [],
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false,
            detailVisible: false,
            dialogType: "",
            dialogRow: {},
            dialogItem: {},
            mvItem: {},
            mcUnknowns: {},
            programs: []
        };
    },
    created() {
        this.getMvList();
    },
    methods: {
        getMvList() {
            this.mvList = [];
            return this.$http
                .get("/switch_igmp?form=multicast_vlan")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.mvList = res.data.data;
                            return Promise.resolve(res.data.data);
                        }
                        return Promise.reject(res.data);
                    }
                })
                .catch(err => {});
        },
        openDialog(type, row, item) {
            this.dialogType = type;
            this.dialogVisible = true;
            this.dialogRow = row;
            this.dialogItem = item;
            this.$nextTick(_ => {
                this.$refs["mv-form"].init(type, row, item);
            });
        },
        showDetail(data) {
            const loading = this.$loading();
            const { mvlan } = data;
            Promise.all([this.getMcUnknown(mvlan), this.getProgram(mvlan)])
                .then(res => {
                    const [mcUnknowns, programs] = res;
                    this.detailVisible = true;
                    this.mvItem = data;
                    this.mcUnknowns = mcUnknowns;
                    this.programs = programs;
                })
                .catch(err => {
                    this.$message.error(this.$lang("get_data_fail"));
                })
                .finally(_ => {
                    isFunction(loading.close) && loading.close();
                });
        },
        parsePortList(str) {
            return parseStringAsList(str)
                .map(item => this.getPortName(item))
                .join(",");
        },
        deleteMvlan(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    const url = "/switch_igmp?form=multicast_vlan",
                        post_params = {
                            method: "destroy",
                            param: {
                                mvlan: row.mvlan,
                                mvlan_desc: row.mvlan_desc
                            }
                        };
                    this.postData(url, post_params)
                        .then(_ => {
                            this.getMvList();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        getMcUnknown(mvlan) {
            return this.$http
                .get(`/switch_igmp?form=mc_unknown&mvlan=${mvlan}`)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            return Promise.resolve(res.data.data);
                        }
                        return Promise.reject(res);
                    }
                })
                .catch(err => {});
        },
        getProgram(mvlan) {
            return this.$http
                .get(`/switch_igmp?form=program&mvlan=${mvlan}`)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            return Promise.resolve(res.data.data);
                        }
                        return Promise.reject(res);
                    }
                })
                .catch(err => {});
        },
        configMvlan(type, row, item) {
            this.openDialog(type, row, item);
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        add(data) {
                            return {
                                url: "/switch_igmp?form=multicast_vlan",
                                data: {
                                    method: "create",
                                    param: {
                                        mvlan: data.mvlan,
                                        mvlan_desc: data.mvlan_desc
                                    }
                                }
                            };
                        },
                        desc(data) {
                            return {
                                url: "/switch_igmp?form=multicast_vlan_desc",
                                data: {
                                    method: "set",
                                    param: {
                                        mvlan: data.mvlan,
                                        mvlan_desc: data.mvlan_desc
                                    }
                                }
                            };
                        },
                        add_router(data) {
                            return {
                                url: "/switch_igmp?form=router_port",
                                data: {
                                    method: "add",
                                    param: {
                                        mvlan: data.mvlan,
                                        router_portlist: data.router_portlist
                                    }
                                }
                            };
                        },
                        del_router(data) {
                            return {
                                url: "/switch_igmp?form=router_port",
                                data: {
                                    method: "delete",
                                    param: {
                                        mvlan: data.mvlan,
                                        router_portlist: data.router_portlist
                                    }
                                }
                            };
                        },
                        policy(data) {
                            return {
                                url: "/switch_igmp?form=mc_unknown",
                                data: {
                                    method: "set",
                                    param: {
                                        mvlan: data.mvlan,
                                        mc_unknown_policy:
                                            data.mc_unknown_policy
                                    }
                                }
                            };
                        },
                        program(data) {
                            return {
                                url: "/switch_igmp?form=program",
                                data: {
                                    method: "add",
                                    param: {
                                        mvlan: data.mvlan,
                                        program_s: data.program_s,
                                        program_e: data.program_e,
                                        program_desc: data.program_desc
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
                                        this.updateData(type, formData.mvlan);
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        },
        updateData(type, mvlan) {
            if (
                type === "desc" ||
                type === "add" ||
                type === "add_router" ||
                type === "del_router"
            ) {
                this.getMvList()
                    .then(data => {
                        if (!this.detailVisible) {
                            return;
                        }
                        if (isArray(data)) {
                            const res = data.filter(
                                item => item.mvlan === mvlan
                            )[0];
                            if (res) {
                                this.mvItem = res;
                            }
                        }
                    })
                    .catch(err => {});
            }
            if (type === "policy") {
                this.getMcUnknown(mvlan)
                    .then(data => {
                        this.mcUnknowns = data;
                    })
                    .catch(err => {});
            }
            if (type === "program") {
                this.getProgram(mvlan)
                    .then(arr => {
                        this.programs = arr;
                    })
                    .catch(err => {});
            }
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
</style>