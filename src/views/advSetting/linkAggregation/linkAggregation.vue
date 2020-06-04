<template>
    <div>
        <page-header :title="$lang('link_aggregation')" type="none">
            <div slot="content">
                <el-button
                    type="primary"
                    size="mini"
                    @click="openDialog('create')"
                >{{ $lang('create') }}</el-button>
            </div>
        </page-header>
        <el-table :data="linkList" border>
            <el-table-column :label="$lang('trunk_id')" prop="trunk_id" width="80px"></el-table-column>
            <el-table-column :label="$lang('psc')" prop="psc" width="160px">
                <template slot-scope="scope">{{ PSC_MAP[scope.row.psc] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('member_portlist')" prop="member_portlist">
                <template slot-scope="scope">{{ parsePort(scope.row.member_portlist) || '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="150px">
                <template slot-scope="scope">
                    <el-dropdown @command="command">
                        <span class="el-dropdown-link">
                            {{ $lang('config') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ action: 'psc', row: scope.row }"
                            >{{ $lang('config', 'psc') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'add', row: scope.row }"
                                :disabled="disabledDropdown('add', scope.row)"
                            >{{ $lang('add', 'member_portlist') }}</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ action: 'delete', row: scope.row }"
                                :disabled="disabledDropdown('delete', scope.row)"
                            >{{ $lang('delete', 'member_portlist') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title"></div>
            <lag-form ref="lag-form"></lag-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('lag-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isArray, parseStringAsList, isDef, isFunction } from "@/utils/common";
import { PSC_MAP } from "@/utils/commonData";
import lagForm from "./lagForm";
import postData from "@/mixin/postData";
export default {
    name: "linkAggregation",
    computed: {
        ...mapState(["system"]),
        ...mapGetters(["$lang", "getPortName"]),
        uplinkports() {
            return this.system.geports + this.system.xgeports;
        }
    },
    mixins: [postData],
    components: { lagForm },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            PSC_MAP,
            linkList: [],
            dialogVisible: false
        };
    },
    created() {
        this.getLinkAggregation();
    },
    methods: {
        getLinkAggregation() {
            this.linkList = [];
            this.$http
                .get("/switch_trunk?form=link_aggregation")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.linkList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        parsePort(str) {
            return parseStringAsList(str)
                .map(id => this.getPortName(id))
                .join(",");
        },
        command({ action, row }) {
            this.openDialog(action, row);
        },
        openDialog(type, data) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["lag-form"].init(type, data);
            });
        },
        disabledDropdown(type, row) {
            const portlist = parseStringAsList(row.member_portlist);
            if (type === "add") {
                return portlist.length === this.uplinkports;
            }
            if (type === "delete") {
                return !portlist.length;
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        create(form) {
                            return {
                                url:
                                    "/switch_trunk?form=link_aggregation_member",
                                data: {
                                    method: "set",
                                    param: {
                                        trunk_id: form.trunk_id,
                                        member_portlist: form.member_portlist.join(
                                            ","
                                        )
                                    }
                                }
                            };
                        },
                        add(form) {
                            return {
                                url:
                                    "/switch_trunk?form=link_aggregation_member",
                                data: {
                                    method: "set",
                                    param: {
                                        trunk_id: form.trunk_id,
                                        member_portlist: form.member_portlist.join(
                                            ","
                                        )
                                    }
                                }
                            };
                        },
                        delete(form) {
                            return {
                                url:
                                    "/switch_trunk?form=link_aggregation_member",
                                data: {
                                    method: "delete",
                                    param: {
                                        trunk_id: form.trunk_id,
                                        member_portlist: form.member_portlist.join(
                                            ","
                                        )
                                    }
                                }
                            };
                        },
                        psc(form) {
                            return {
                                url: "/switch_trunk?form=link_aggregation_psc",
                                data: {
                                    method: "set",
                                    param: {
                                        trunk_id: form.trunk_id,
                                        psc: form.psc
                                    }
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, formData);
                        if (isDef(res)) {
                            const { url, data } = res;
                            url &&
                                data &&
                                this.postData(url, data)
                                    .then(_ => {
                                        this.getLinkAggregation();
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
.el-icon-arrow-down {
    font-size: 12px;
}
</style>