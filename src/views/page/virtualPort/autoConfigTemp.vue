<template>
    <div>
        <div style="margin: 12px">
            <el-button type="primary" size="small" @click="openDialog('add')">
                {{ $lang("add") }}
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="deleteAllTemp"
            >
                {{ $lang("delete_all") }}
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="refreshData"
            >
                {{ $lang("refresh") }}
            </el-button>
        </div>
        <el-table :data="tempTable" border>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">
                    {{ getPortName(scope.row.port_id) }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('gemport')">
                <template slot-scope="scope">
                    {{ scope.row.gemport || "-" }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('new_svlan')"
                prop="new_svlan"
            ></el-table-column>
            <el-table-column :label="$lang('tag_action')">
                <template slot-scope="scope">
                    {{ TAG_ACTIONS[scope.row.tag_action] || "-" }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('inner_vlan')" prop="inner_vlan">
                <template slot-scope="scope">
                    {{
                        scope.row.tag_action === 4 || scope.row.tag_action === 5
                            ? scope.row.inner_vlan
                            : "-"
                    }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('set', scope.row)"
                    >
                        {{ $lang("config") }}
                    </el-button>
                    <el-button type="text" @click="deleteTemp(scope.row)">
                        {{ $lang("delete") }}
                    </el-button>
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
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button type="primary" @click="submitForm('auto-temp-form')">
                    {{ $lang("apply") }}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="delVisible" width="640px">
            <template slot="title">{{ $lang("delete") }}</template>
            <del-auto-temp-form ref="del-auto-temp-form"></del-auto-temp-form>
            <template slot="footer">
                <el-button @click="delVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="submitDelete('del-auto-temp-form')"
                >
                    {{ $lang("apply") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { TAG_ACTIONS } from "@/utils/commonData";
import { isArray, isDef, isFunction, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
import autoTempForm from "./autoTempForm";
import delAutoTempForm from "./delAutoTempForm";
export default {
    name: "autoConfigTemp",
    components: { autoTempForm, delAutoTempForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
    },
    mixins: [postData],
    data() {
        return {
            TAG_ACTIONS,
            tempTable: [],
            dialogVisible: false,
            dialogType: "",
            dialogData: {},
            delVisible: false,
        };
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(() => {
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
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.tempTable = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        deleteTemp(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(() => {
                    const post_param = {
                        method: "set",
                        param: {
                            port_id: row.port_id,
                            gemport: row.gemport,
                            new_svlan: row.new_svlan,
                            tag_action: row.tag_action,
                            inner_vlan: row.inner_vlan,
                        },
                    };
                    this.postData(
                        "/switch_svp?form=svp_auto_profile_del",
                        post_param
                    )
                        .then(() => {
                            this.getData();
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        },
        openDialog(type, row) {
            this.dialogType = type;
            isDef(row) && (this.dialogData = row);
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["auto-temp-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((formData) => {
                if (formData) {
                    const data = {
                        method: "set",
                        param: {
                            port_id: formData.port_id,
                            gemport: Number(formData.gemport),
                            new_svlan: formData.new_svlan,
                            tag_action: formData.tag_action,
                            inner_vlan: Number(formData.inner_vlan),
                        },
                    };
                    const ACTIONS = {
                        add() {},
                        set() {},
                    };
                    if (isFunction(ACTIONS[this.dialogType])) {
                        const url = "/switch_svp?form=svp_auto_profile_set";
                        this.postData(url, data)
                            .then(() => {
                                this.getData();
                                this.dialogVisible = false;
                            })
                            .catch(() => {});
                    }
                }
            });
        },
        deleteAllTemp() {
            this.delVisible = true;
            this.$nextTick(() => {
                this.$refs["del-auto-temp-form"].init();
            });
        },
        submitDelete(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    const url =
                            form.type === 0
                                ? "/switch_svp?form=svp_auto_profile_del_all"
                                : "/switch_svp?form=svp_auto_profile_del",
                        post_param = {
                            method: "set",
                            param: {
                                port_id: form.port_id,
                                gemport: form.gemport,
                            },
                        };
                    this.postData(url, post_param)
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.delVisible = false;
                        });
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
</style>