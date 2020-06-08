<template>
    <div>
        <page-header :title="$lang('vlan_cfg')" type="none">
            <div slot="content">
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="openDialog('create')"
                >{{ $lang('create') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="openDialog('delete')"
                >{{ $lang('delete') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="openDialog('batch')"
                >{{ $lang('batch_cfg_vlan') }}</el-button>
            </div>
        </page-header>
        <el-form label-width="160px" label-position="left">
            <el-form-item :label="$lang('vlan_list')" class="search-title">
                <el-input
                    placeholder="VLAN ID: 1 - 4094"
                    prefix-icon="el-icon-search"
                    style="width: 200px;"
                    v-model="search"
                    clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <el-table :data="vlanTable" border>
            <el-table-column :label="$lang('vlan_id')" prop="vlan_id" width="80px"></el-table-column>
            <el-table-column :label="$lang('tagged_portlist')">
                <template slot-scope="scope">{{ getPort(scope.row.tagged_portlist) || '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('untagged_portlist')">
                <template slot-scope="scope">{{ getPort(scope.row.untagged_portlist) || '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('default_vlan_portlist')">
                <template slot-scope="scope">{{ getPort(scope.row.default_vlan_portlist) || '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="120px">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('config', scope.row)"
                    >{{ $lang('config') }}</el-button>
                    <el-button
                        type="text"
                        v-if="scope.row.vlan_id !== 1"
                        @click="deleteVlan(scope.row)"
                    >{{ $lang('delete') }}</el-button>
                </template>
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
                :total="paginationTotal"
            ></el-pagination>
        </div>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ dialogTitle }}</div>
            <vlan-form ref="vlan-form"></vlan-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('vlan-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isFunction, parseStringAsList } from "@/utils/common";
import postData from "@/mixin/postData";
import vlanForm from "./vlanForm";
export default {
    name: "vlanMgmt",
    components: { vlanForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        vlanTable() {
            let list = this.vlanList.slice(0);
            if (this.search) {
                list = list.filter(item => {
                    if (String(item.vlan_id).indexOf(this.search) > -1) {
                        return true;
                    }
                    return false;
                });
            }
            this.paginationTotal = list.length;
            const start = (this.currentPage - 1) * this.pageSize;
            return list.slice(start, start + this.pageSize);
        },
        dialogTitle() {
            const title_map = {
                create: "create",
                delete: "delete",
                batch: "config",
                config: "config"
            };
            return `${this.$lang(title_map[this.dialogType])} VLAN`;
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
            vlanList: [],
            search: "",
            currentPage: 1,
            pageSize: 10,
            paginationTotal: 0,
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {
        this.getVlan();
    },
    methods: {
        getVlan() {
            this.vlanList = [];
            this.search = "";
            this.$http
                .get("/switch_vlan")
                .then(res => {
                    if (res.data.code === 1) {
                        this.$http
                            .get("/vlantable")
                            .then(_res => {
                                if (_res.data.code === 1) {
                                    if (isArray(_res.data.data)) {
                                        this.vlanList = _res.data.data;
                                    }
                                }
                            })
                            .catch(err => {});
                    }
                })
                .catch(err => {});
        },
        getPort(str) {
            return parseStringAsList(str)
                .map(item => this.getPortName(item))
                .join(",");
        },
        openDialog(type, row) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(_ => {
                this.$refs["vlan-form"].init(type, row);
            });
        },
        deleteVlan(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.postData("/switch_vlan", {
                        method: "destroy",
                        param: {
                            vlan_id: row.vlan_id
                        }
                    })
                        .then(_ => {
                            this.getVlan();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        createVlan(form) {
            this.postData(
                "/switch_vlanlist",
                {
                    method: "create",
                    param: {
                        type: 1,
                        vlanid_s: form.vlanid_s,
                        vlanid_e: form.vlanid_e
                    }
                },
                false
            )
                .then(res => {
                    if (res.data.code === 1) {
                        const msg = this.$message.success(
                            this.$lang("create_vlan_info")
                        );
                        this.postData("/switch_vlanlist", {
                            method: "set",
                            param: {
                                vlanid_s: form.vlanid_s,
                                vlanid_e: form.vlanid_e,
                                tagged_portlist: form.tagged_portlist.join(","),
                                untagged_portlist: form.untagged_portlist.join(
                                    ","
                                )
                            }
                        })
                            .then(_ => {
                                // isFunction(msg.close) && msg.close();
                                this.getVlan();
                            })
                            .catch(_ => {});
                    }
                })
                .catch(_ => {})
                .finally(_ => {
                    this.dialogVisible = false;
                });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                const ACTIONS = {
                    create(form) {
                        this.createVlan(form);
                    },
                    delete(form) {
                        return {
                            url: "/switch_vlanlist",
                            data: {
                                method: "destroy",
                                param: {
                                    vlanid_s: form.vlanid_s,
                                    vlanid_e: form.vlanid_e
                                }
                            }
                        };
                    },
                    batch(form) {
                        return {
                            url: "/switch_vlanlist",
                            data: {
                                method: "set",
                                param: {
                                    vlanid_s: form.vlanid_s,
                                    vlanid_e: form.vlanid_e,
                                    tagged_portlist: form.tagged_portlist.join(
                                        ","
                                    ),
                                    untagged_portlist: form.untagged_portlist.join(
                                        ","
                                    )
                                }
                            }
                        };
                    },
                    config(form) {
                        return {
                            url: "/switch_vlanlist",
                            data: {
                                method: "set",
                                param: {
                                    vlanid_s: form.vlanid_s,
                                    vlanid_e: form.vlanid_s,
                                    tagged_portlist: form.tagged_portlist.join(
                                        ","
                                    ),
                                    untagged_portlist: form.untagged_portlist.join(
                                        ","
                                    )
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
                                .then(_ => {})
                                .catch(_ => {});
                        this.dialogVisible = false;
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.search-title /deep/ label {
    color: @titleColor;
    font-size: 16px;
    font-weight: 600;
}
</style>