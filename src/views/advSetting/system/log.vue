<template>
    <div>
        <page-header type="none" :title="$lang('log')"></page-header>
        <div style="margin: 10px 0 20px 10px;">
            <el-button
                type="primary"
                size="small"
                @click="downloadLog"
            >{{ $lang('download', 'log') }}</el-button>
        </div>
        <el-table :data="logInfo" border stripe>
            <el-table-column :label="$lang('module_name')" prop="module_name"></el-table-column>
            <el-table-column :label="$lang('level')">
                <template slot-scope="scope">{{ LOG_LEVEL[scope.row.level] || '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="150px">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row)">{{ $lang('config') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="550px">
            <div slot="title">{{ $lang('config') }}</div>
            <log-form ref="log-form"></log-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('log-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isArray } from "@/utils/common";
import { LOG_LEVEL } from "@/utils/commonData";
import logForm from "./log/logForm";
import postData from "@/mixin/postData";
export default {
    name: "log",
    computed: {
        ...mapGetters(["$lang"])
    },
    components: { logForm },
    mixins: [postData],
    data() {
        return {
            LOG_LEVEL,
            logInfo: [],
            logServer: "",
            dialogVisible: false
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.logInfo = [];
            this.logServer = "";
            this.$http
                .get("/system?form=logger")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            if (isArray(res.data.data.info)) {
                                this.logInfo = res.data.data.info;
                            }
                            this.logServer = res.data.data.syslog_server || "";
                        }
                    }
                })
                .catch(err => {});
        },
        downloadLog() {
            this.$confirm(this.$lang("if_sure", "download") + " ?")
                .then(_ => {
                    this.$http
                        .get("/system?form=logger_dw")
                        .then(res => {
                            if (res.data.code === 1) {
                                const anchor = document.createElement("a");
                                anchor.href = res.data.data.filename;
                                anchor.setAttribute(
                                    "download",
                                    res.data.data.filename
                                );
                                anchor.style.display = "none";
                                document.body.appendChild(anchor);
                                anchor.click();
                                document.body.removeChild(anchor);
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {
                            if (err && err.message) {
                                this.$message.error(err.message);
                            }
                        });
                })
                .catch(_ => {});
        },
        openDialog(row) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["log-form"].init(row);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const same = this.logInfo.some(
                        item =>
                            item.module_name === formData.module_name &&
                            item.level === formData.level
                    );
                    if (same) {
                        this.dialogVisible = false;
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/system?form=logger", {
                        method: "set",
                        param: {
                            module_name: formData.module_name,
                            level: formData.level,
                            syslog_server: ""
                        }
                    })
                        .then(_ => {
                            this.getData();
                        })
                        .catch(_ => {});
                    this.dialogVisible = false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>