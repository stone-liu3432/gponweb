<template>
    <div>
        <page-header :title="$lang('vlan_cfg')" type="none">
            <div slot="content">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="openDialog('create')"
                >{{ $lang('create') }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="openDialog('delete')"
                >{{ $lang('delete') }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="openDialog('batch')"
                >{{ $lang('batch_cfg_vlan') }}</el-button>
            </div>
        </page-header>
        <el-form label-width="160px" label-position="left">
            <el-form-item :label="$lang('vlan_list')" class="search-title">
                <el-input
                    size="small"
                    placeholder="VLAN ID: 1 - 4094"
                    prefix-icon="el-icon-search"
                    style="width: 200px;"
                    v-model="search"
                    clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <el-table :data="vlanTable" border>
            <el-table-column :label="$lang('vlan_id')" prop="vlan_id" width="100px"></el-table-column>
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
                    <el-dropdown @command="commandHandler">
                        <span class="el-dropdown-link">
                            {{ $lang('config') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ action: 'config', row: scope.row }"
                            >{{ $lang('config') }}</el-dropdown-item>
                            <template v-if="scope.row.vlan_id !== 1">
                                <el-dropdown-item
                                    :command="{ action: 'delete', row: scope.row }"
                                >{{ $lang('delete') }}</el-dropdown-item>
                            </template>
                            <el-dropdown-item
                                :command="{ action: 'port_default_vlan', row: scope.row }"
                            >{{ $lang('port_default_vlan') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
            dialogType: "",
            dialogData: {}
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
            this.dialogData = row;
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
                    },
                    port_default_vlan(form) {
                        this.defVlanHandler(form);
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
                                    this.getVlan();
                                })
                                .catch(err => {
                                    if (err.type === "warning") {
                                        this.getVlan();
                                    }
                                });
                        this.dialogVisible = false;
                    }
                }
            });
        },
        defVlanHandler(form) {
            const base = parseStringAsList(
                    this.dialogData.default_vlan_portlist
                ),
                list = form.default_vlan_portlist,
                added = list.reduce((pre, item) => {
                    if (!base.includes(item)) {
                        pre.push(item);
                    }
                    return pre;
                }, []),
                deleted = base.reduce((pre, item) => {
                    if (!list.includes(item)) {
                        pre.push(item);
                    }
                    return pre;
                }, []);
            if (!added.length && !deleted.length) {
                return this.$message.error(this.$lang("modify_tips"));
            }
            const cb = () => {
                this.$message.success(this.$lang("setting_ok"));
                this.getVlan();
            };
            const deleteDefVlan = (url, deleted) => {
                this.postData(
                    url,
                    {
                        method: "set",
                        param: {
                            vlan_id: 1,
                            default_vlan_portlist: deleted.join(",")
                        }
                    },
                    false
                )
                    .then(_ => {
                        cb();
                    })
                    .catch(_ => {});
            };
            const url = "/switch_vlan_pvid";
            if (added.length) {
                this.postData(
                    url,
                    {
                        method: "set",
                        param: {
                            vlan_id: form.vlanid_s,
                            default_vlan_portlist: added.join(",")
                        }
                    },
                    false
                )
                    .then(_ => {
                        if (deleted.length) {
                            deleteDefVlan(url, deleted);
                        } else {
                            cb();
                        }
                    })
                    .catch(_ => {});
            } else {
                deleteDefVlan(url, deleted);
            }
            this.dialogVisible = false;
        },
        commandHandler({ action, row }) {
            switch (action) {
                case "config":
                    this.openDialog("config", row);
                    break;
                case "delete": {
                    this.deleteVlan(row);
                    break;
                }
                case "port_default_vlan":
                    this.openDialog("port_default_vlan", row);
                    break;
            }
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
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
.el-icon-arrow-down {
    font-size: 12px;
}
</style>