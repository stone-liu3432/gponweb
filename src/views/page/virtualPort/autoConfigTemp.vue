<template>
    <div>
        <div style="margin: 12px;">
            <el-button type="primary" size="small" @click="openDialog('add')">{{
                $lang("add")
            }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="deleteAllTemp"
                >{{ $lang("delete_all") }}</el-button
            >
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="refreshData"
                >{{ $lang("refresh") }}</el-button
            >
        </div>
        <el-table :data="tempTable" border>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('new_svlan')"
                prop="new_svlan"
            ></el-table-column>
            <el-table-column :label="$lang('tag_action')">
                <template slot-scope="scope">{{
                    TAG_ACTIONS[scope.row.tag_action] || "-"
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('inner_vlan')" prop="inner_vlan">
                <template slot-scope="scope">{{
                    scope.row.tag_action === 4 || scope.row.tag_action === 5
                        ? scope.row.inner_vlan
                        : "-"
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('set', scope.row)"
                        >{{ $lang("config") }}</el-button
                    >
                    <el-button type="text" @click="deleteTemp(scope.row)">{{
                        $lang("delete")
                    }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" width="640px">
            <span slot="title"></span>
            <auto-temp-form
                :type="dialogType"
                :tempList="tempTable"
                :data="dialogData"
                ref="auto-temp-form"
            ></auto-temp-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('auto-temp-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { TAG_ACTIONS } from "@/utils/commonData";
import { isArray, isDef, isFunction, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
import autoTempForm from "./autoTempForm";
export default {
    name: "autoConfigTemp",
    components: { autoTempForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    mixins: [postData],
    data() {
        return {
            TAG_ACTIONS,
            tempTable: [],
            dialogVisible: false,
            dialogType: "",
            dialogData: {}
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
            this.tempTable = [];
            this.$http
                .get("/switch_svp?form=svp_auto_profile")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.tempTable = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        deleteTemp(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    const post_param = {
                        method: "set",
                        param: {
                            port_id: row.port_id,
                            new_svlan: row.new_svlan,
                            tag_action: row.tag_action,
                            inner_vlan: row.inner_vlan
                        }
                    };
                    this.postData(
                        "/switch_svp?form=svp_auto_profile_del",
                        post_param
                    )
                        .then(_ => {
                            this.getData();
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        openDialog(type, row) {
            this.dialogType = type;
            isDef(row) && (this.dialogData = row);
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["auto-temp-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const data = {
                        method: "set",
                        param: {
                            port_id: formData.port_id,
                            new_svlan: formData.new_svlan,
                            tag_action: formData.tag_action,
                            inner_vlan: Number(formData.inner_vlan)
                        }
                    };
                    const ACTIONS = {
                        add() {},
                        set() {}
                    };
                    if (isFunction(ACTIONS[this.dialogType])) {
                        const url = "/switch_svp?form=svp_auto_profile_set";
                        this.postData(url, data)
                            .then(_ => {
                                this.getData();
                                this.dialogVisible = false;
                            })
                            .catch(_ => {});
                    }
                }
            });
        },
        deleteAllTemp() {
            this.$confirm(
                this.$lang("if_sure", "delete_all", "auto_config_temp") + " ?"
            )
                .then(_ => {
                    this.postData("/switch_svp?form=svp_auto_profile_del", {
                        method: "set",
                        param: {
                            port_id: 0,
                            new_svlan: 0,
                            tag_action: 0,
                            inner_vlan: 0
                        }
                    })
                        .then(_ => {
                            this.getData();
                        })
                        .catch(_ => {});
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