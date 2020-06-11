<template>
    <div>
        <el-table :data="dbaTable" border stripe>
            <el-table-column prop="profname" :label="$lang('profname')"></el-table-column>
            <el-table-column prop="profid" :label="$lang('profid')"></el-table-column>
            <el-table-column prop="type" :label="$lang('type')">
                <template slot-scope="scope">{{ types[scope.row.type] }}</template>
            </el-table-column>
            <el-table-column prop="fix" :label="$lang('fix')">
                <template slot-scope="scope">{{ showValue(scope.row, 'fix') }}</template>
            </el-table-column>
            <el-table-column prop="assure" :label="$lang('assure')">
                <template slot-scope="scope">{{ showValue(scope.row, 'assure') }}</template>
            </el-table-column>
            <el-table-column prop="max" :label="$lang('max')">
                <template slot-scope="scope">{{ showValue(scope.row, 'max') }}</template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <span>{{ $lang('config') }}</span>
                    <el-button
                        type="primary"
                        size="mini"
                        style="margin-left: 20px;"
                        @click="openDialog('add')"
                    >{{ $lang('add') }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('set', scope.row)"
                    >{{ $lang('config') }}</el-button>
                    <el-button
                        type="text"
                        style="margin-left: 20px;"
                        @click="delTemplate(scope.row)"
                    >{{ $lang('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin: 12px 0; float: right;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dbaProfiles.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" width="500px">
            <div slot="title">{{ $lang(dialogType) }}</div>
            <dba-form :data="dbaData" :type="dialogType" ref="dba-form"></dba-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('dba-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isFunction, isDef } from "@/utils/common";
import dbaForm from "./dbaForm";
import { DBA_PROFILE_TYPES } from "@/utils/commonData";
import postData from "@/mixin/postData";
export default {
    name: "dbaTemplate",
    components: { dbaForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang"]),
        dbaTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.dbaProfiles.slice(start, start + this.pageSize);
        }
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    props: {
        dbaProfiles: {
            type: Array
        }
    },
    data() {
        return {
            types: {
                1: "type1",
                2: "type2",
                3: "type3",
                4: "type4",
                5: "type5"
            },
            dialogVisible: false,
            dialogType: "",
            dbaData: {},
            currentPage: 1,
            pageSize: 10
        };
    },
    created() {
        this.$emit("refreshData");
    },
    methods: {
        showValue(row, key) {
            const { type } = row;
            return DBA_PROFILE_TYPES[type].includes(key) ? row[key] : "-";
        },
        delTemplate(row) {
            this.$confirm(this.$lang("if_sure", "delete", "dba_profile"))
                .then(_ => {
                    const post_data = {
                        method: "delete",
                        param: {
                            profid: row.profid,
                            profname: row.profname
                        }
                    };
                    this.$http
                        .post("/dbaprofile", post_data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("delete", "st_success")
                                );
                                this.$emit("refreshData");
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
        openDialog(type, data) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.dbaData = data || {};
            this.$nextTick(_ => {
                this.$refs["dba-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const ACTIONS = {
                        add(data) {
                            return {
                                method: "add",
                                param: {
                                    profname: data.profname,
                                    profid: data.profid,
                                    type: data.type,
                                    fix: data.fix,
                                    assure: data.assure,
                                    max: data.max
                                }
                            };
                        },
                        set(data) {
                            //  未更改时，直接提示并返回
                            let flag = true;
                            Object.keys(data).forEach(key => {
                                if (data[key] !== this.dbaData[key]) {
                                    flag = false;
                                }
                            });
                            if (flag) {
                                this.$message.info(this.$lang("modify_tips"));
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                method: "set",
                                param: {
                                    profname: data.profname,
                                    profid: data.profid,
                                    type: data.type,
                                    fix: data.fix,
                                    assure: data.assure,
                                    max: data.max
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[this.dialogType])) {
                        const data = ACTIONS[this.dialogType].call(this, valid);
                        if (isDef(data)) {
                            this.postData("/dbaprofile", data)
                                .then(res => {
                                    if (res.code === 1) {
                                        this.$emit("refreshData");
                                    }
                                })
                                .catch(err => {});
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
</style>