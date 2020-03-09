<template>
    <div>
        <el-table :data="lineTable" border stripe>
            <el-table-column prop="profname" :label="$lang('profname')"></el-table-column>
            <el-table-column prop="profid" :label="$lang('profid')"></el-table-column>
            <el-table-column prop="bindtimes" :label="$lang('bindtimes')"></el-table-column>
            <el-table-column width="200px">
                <template slot="header">
                    <span>{{ $lang('config') }}</span>
                    <el-button
                        type="primary"
                        size="mini"
                        style="margin-left: 30px;"
                        @click="openDialog('add')"
                    >{{ $lang('add') }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetail(scope.row)">{{ $lang('show_detail') }}</el-button>
                    <el-button
                        type="text"
                        style="margin-left: 20px;"
                        @click="deleteProf(scope.row)"
                    >{{ $lang('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 详情 -->
        <el-dialog :visible.sync="detailVisible" width="850px">
            <line-detail :data="rowData" @set-profile="setProfile"></line-detail>
        </el-dialog>
        <!-- 添加和设置 -->
        <el-dialog
            :visible.sync="setVisible"
            :title="$lang(dialogType)"
            append-to-body
            width="640px"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :before-close="closeDialog"
        >
            <line-form
                :lineData="dialogData"
                :dbaData="dbaProfiles"
                :lineTable="lineTable"
                :type="dialogType"
                ref="line-form"
            ></line-form>
            <template slot="footer">
                <el-button @click="closeDialog">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('line-form')">{{ $lang('apply') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef, isFunction } from "@/utils/common";
import lineDetail from "./lineTemplate/lineDetail";
import lineForm from "./lineTemplate/lineForm";
import postData from "@/mixin/postData";
export default {
    name: "lineTemplate",
    components: { lineDetail, lineForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    mixins: [postData],
    props: {
        dbaProfiles: {
            type: Array
        }
    },
    data() {
        return {
            lineTable: [],
            expandRows: [],
            rowData: {},
            // 查看详情模态框
            detailVisible: false,
            // 添加和设置模态框
            setVisible: false,
            dialogType: "",
            dialogData: {}
        };
    },
    created() {
        this.getLineProf();
    },
    methods: {
        getLineProf() {
            this.lineTable = [];
            this.$http
                .get("/lineprofile?form=table")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.lineTable = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getItem(row) {
            let loading = this.$loading();
            this.rowData = {};
            const url = `/lineprofile?form=self&profid=${row.profid}&profname=${row.profname}`;
            this.$http
                .get(url)
                .then(res => {
                    loading.close();
                    loading = null;
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.rowData = res.data.data;
                            this.$nextTick(_ => {
                                this.detailVisible = true;
                            });
                        }
                    } else {
                        this.$message.error(
                            `(${res.data.code}) ${res.data.message}`
                        );
                    }
                })
                .catch(err => {});
        },
        showDetail(row) {
            this.getItem(row);
        },
        openDialog(type, data) {
            this.dialogType = type;
            this.setVisible = true;
            isDef(data) && (this.dialogData = data);
            this.$nextTick(_ => {
                this.$refs["line-form"].init();
            });
        },
        setProfile(data) {
            this.openDialog("set", data);
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const post_params = {
                        method: "add",
                        param: {
                            profname: formData.profname,
                            profid: formData.profid,
                            type: formData.type,
                            mappingmode: formData.mappingmode,
                            tcont: formData.tcont,
                            gem: formData.gem
                        }
                    };
                    this.postData("/lineprofile", post_params)
                        .then(_ => {
                            this.getLineProf();
                            this.closeDialog();
                        })
                        .catch(_ => {});
                }
            });
        },
        closeDialog(done) {
            this.$refs["line-form"].destroy();
            if (isFunction(done)) {
                done();
            } else {
                this.setVisible = false;
            }
        },
        deleteProf(data) {
            this.$confirm(
                `${this.$lang("if_sure", "delete")} ${data.profname} ?`
            )
                .then(_ => {
                    const url = "/lineprofile",
                        post_data = {
                            method: "delete",
                            param: {
                                profname: data.profname,
                                profid: data.profid
                            }
                        };
                    this.postData(url, post_data).then(_ => {
                        this.getLineProf();
                    });
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>