<template>
    <div>
        <page-header type="none">
            <template slot="title">
                <span>
                    <span>{{ $lang('dev_mgmt') }}</span>
                </span>
            </template>
        </page-header>
        <el-row :gutter="30" style="margin: 30px 0;">
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang('restore_config') }}</span>
                        </span>
                    </template>
                    <p>{{ $lang('res_cfg_info') }}</p>
                    <el-upload
                        :auto-upload="false"
                        action="www.hsgq.com"
                        :limit="1"
                        :multiple="false"
                        :on-change="fileChange"
                        :before-remove="removeFile"
                        :file-list="fileList"
                    >
                        <el-button
                            slot="trigger"
                            size="small"
                            type="primary"
                        >{{ $lang('file_click') }}</el-button>
                        <el-button
                            style="margin-left: 10px;"
                            size="small"
                            type="success"
                            @click="uploadConfigFile"
                        >{{ $lang('restore_config') }}</el-button>
                    </el-upload>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang('reboot') }}</span>
                        </span>
                    </template>
                    <p>{{ $lang('reboot_olt') }}</p>
                    <el-button type="primary" @click="rebootOlt">{{ $lang('reboot') }}</el-button>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="30" style="margin: 30px 0;">
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang('backup_config') }}</span>
                        </span>
                    </template>
                    <p>{{ $lang('bkup_cfg_info') }}</p>
                    <el-button type="primary" @click="backupConfig">{{ $lang('backup_config') }}</el-button>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang('default_config') }}</span>
                        </span>
                    </template>
                    <p>{{ $lang('def_cfg_info') }}</p>
                    <el-button type="primary" @click="defaultConfig">{{ $lang('default_config') }}</el-button>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="30" style="margin: 30px 0;">
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang('save_config') }}</span>
                        </span>
                    </template>
                    <p>{{ $lang('save_cfg_info') }}</p>
                    <el-button type="primary" @click="saveConfig">{{ $lang('save_config') }}</el-button>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang('view_cfg') }}</span>
                        </span>
                    </template>
                    <p>{{ $lang('view_cfg_tips') }}</p>
                    <el-button type="primary" @click="viewCurrentConfig">{{ $lang('view_cfg') }}</el-button>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isPlainObject, isDef } from "@/utils/common";
import uploadFile from "@/mixin/uploadFile";
import rebootOlt from "@/mixin/rebootOlt";
import saveConfig from "@/mixin/saveConfig";
export default {
    name: "devMgmt",
    computed: {
        ...mapGetters(["$lang"])
    },
    mixins: [uploadFile, rebootOlt, saveConfig],
    data() {
        return {
            configFile: null,
            fileList: []
        };
    },
    created() {},
    methods: {
        fileChange(file, list) {
            this.configFile = file.raw;
        },
        removeFile(file, list) {
            this.configFile = null;
        },
        uploadConfigFile() {
            if (!this.configFile) {
                return this.$message.error(this.$lang("file_not_select"));
            }
            const formData = new FormData();
            formData.append("file", this.configFile);
            this.uploadFile("/system_restore", formData)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(
                            this.$lang("restore_config_succ")
                        );
                        this.fileList = [];
                        this.rebootOlt(
                            this.$lang("restore_succ_reboot") + " ?"
                        );
                    } else {
                        this.$message.error(
                            `(${res.data.code}) ${res.data.message}`
                        );
                    }
                })
                .catch(err => {});
        },
        backupConfig() {
            this.$http
                .get("/system_backup")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isPlainObject(res.data.data)) {
                            const filename = res.data.data.filename;
                            if (isDef(filename)) {
                                try {
                                    const anchor = document.createElement("a");
                                    anchor.href = "/" + filename;
                                    anchor.setAttribute("download", filename);
                                    anchor.style.display = "none";
                                    document.body.appendChild(anchor);
                                    anchor.click();
                                    document.body.removeChild(anchor);
                                } catch (e) {}
                            }
                        }
                    } else {
                        this.$message.error(
                            `(${res.data.code}) ${res.data.message}`
                        );
                    }
                })
                .catch(err => {});
        },
        defaultConfig() {
            this.$confirm(this.$lang("def_cfg_hit"))
                .then(_ => {
                    this.$http
                        .get("/system_def_config")
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("def_cfg_succ")
                                );
                                const timer = setTimeout(_ => {
                                    this.reboot();
                                }, 15000);
                                this.rebootOlt(null, timer);
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
        viewCurrentConfig() {
            this.$confirm(this.$lang("confirm_download_file"))
                .then(_ => {
                    this.$http
                        .get("/system_running_config")
                        .then(res => {
                            if (res.data.code === 1) {
                                try {
                                    const anchor = document.createElement("a");
                                    anchor.href = "/oltconfigtmp.txt";
                                    anchor.setAttribute(
                                        "download",
                                        "oltconfigtmp.txt"
                                    );
                                    anchor.style.display = "none";
                                    document.body.appendChild(anchor);
                                    anchor.click();
                                    document.body.removeChild(anchor);
                                } catch (e) {}
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
.dev-mgmt-item {
    span {
        color: @titleColor;
    }
    p {
        .base-font-style;
    }
}
</style>