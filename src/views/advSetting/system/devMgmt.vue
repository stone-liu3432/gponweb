<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("dev_mgmt") }} </template>
        </page-header>
        <!-- <el-row :gutter="30" style="margin: 30px 0">
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang("restore_config") }}</span>
                        </span>
                    </template>
                    <p>{{ $lang("res_cfg_info") }}</p>
                    <el-upload
                        :auto-upload="false"
                        action="www.hsgq.com"
                        :limit="1"
                        :multiple="false"
                        :on-change="fileChange"
                        :before-remove="removeFile"
                        :file-list="fileList"
                    >
                        <el-button slot="trigger" size="small" type="primary">{{
                            $lang("file_click")
                        }}</el-button>
                        <el-button
                            style="margin-left: 10px"
                            size="small"
                            type="success"
                            @click="uploadConfigFile"
                            >{{ $lang("restore_config") }}</el-button
                        >
                    </el-upload>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang("reboot") }}</span>
                        </span>
                    </template>
                    <p>{{ $lang("reboot_olt") }}</p>
                    <el-button
                        size="small"
                        type="primary"
                        @click="rebootOlt()"
                        >{{ $lang("reboot") }}</el-button
                    >
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="30" style="margin: 30px 0">
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang("backup_config") }}</span>
                        </span>
                    </template>
                    <p>{{ $lang("bkup_cfg_info") }}</p>
                    <el-button
                        size="small"
                        type="primary"
                        @click="backupConfig"
                        >{{ $lang("backup_config") }}</el-button
                    >
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang("default_config") }}</span>
                        </span>
                    </template>
                    <p>{{ $lang("def_cfg_info") }}</p>
                    <el-button
                        size="small"
                        type="primary"
                        @click="defaultConfig"
                        >{{ $lang("default_config") }}</el-button
                    >
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="30" style="margin: 30px 0">
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang("save_config") }}</span>
                        </span>
                    </template>
                    <p>{{ $lang("save_cfg_info") }}</p>
                    <el-button
                        size="small"
                        type="primary"
                        @click="saveConfig"
                        >{{ $lang("save_config") }}</el-button
                    >
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" class="dev-mgmt-item">
                    <template slot="header">
                        <span>
                            <span>{{ $lang("view_cfg") }}</span>
                        </span>
                    </template>
                    <p>{{ $lang("view_cfg_tips") }}</p>
                    <el-button
                        size="small"
                        type="primary"
                        @click="viewCurrentConfig"
                        >{{ $lang("view_cfg") }}</el-button
                    >
                </el-card>
            </el-col>
        </el-row> -->
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title">{{ $lang("restore_config") }}</div>
            <div class="dev-mgmt-item-content">
                <el-upload
                    :auto-upload="false"
                    action="www.hsgq.com"
                    :limit="1"
                    :multiple="false"
                    :on-change="fileChange"
                    :before-remove="removeFile"
                    :file-list="fileList"
                    class="lf"
                >
                    <el-button slot="trigger" size="small" type="primary">{{
                        $lang("file_click")
                    }}</el-button>
                    <el-button
                        style="margin-left: 10px"
                        size="small"
                        type="success"
                        @click="uploadConfigFile"
                        >{{ $lang("restore_config") }}</el-button
                    >
                </el-upload>
                <div class="dev-mgmt-item-tips">
                    {{ $lang("res_cfg_info") }}
                </div>
            </div>
        </div>
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title">{{ $lang("reboot") }}</div>
            <div class="dev-mgmt-item-content">
                <el-button
                    size="small"
                    class="lf"
                    type="primary"
                    @click="rebootOlt()"
                    >{{ $lang("reboot") }}</el-button
                >
                <div class="dev-mgmt-item-tips">{{ $lang("reboot_olt") }}</div>
            </div>
        </div>
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title">{{ $lang("backup_config") }}</div>
            <div class="dev-mgmt-item-content">
                <el-button
                    size="small"
                    type="primary"
                    class="lf"
                    @click="backupConfig"
                    >{{ $lang("backup_config") }}
                </el-button>
                <div class="dev-mgmt-item-tips">
                    {{ $lang("bkup_cfg_info") }}
                </div>
            </div>
        </div>
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title">{{ $lang("default_config") }}</div>
            <div class="dev-mgmt-item-content">
                <el-button
                    size="small"
                    type="primary"
                    class="lf"
                    @click="defaultConfig"
                    >{{ $lang("default_config") }}
                </el-button>
                <div class="dev-mgmt-item-tips">
                    {{ $lang("def_cfg_info") }}
                </div>
            </div>
        </div>
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title">{{ $lang("save_config") }}</div>
            <div class="dev-mgmt-item-content">
                <el-button
                    size="small"
                    type="primary"
                    class="lf"
                    @click="saveConfig"
                    >{{ $lang("save_config") }}
                </el-button>
                <div class="dev-mgmt-item-tips">
                    {{ $lang("save_cfg_info") }}
                </div>
            </div>
        </div>
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title">{{ $lang("view_cfg") }}</div>
            <div class="dev-mgmt-item-content">
                <el-button
                    size="small"
                    class="lf"
                    type="primary"
                    @click="viewCurrentConfig"
                    >{{ $lang("view_cfg") }}
                </el-button>
                <div class="dev-mgmt-item-tips">
                    {{ $lang("view_cfg_tips") }}
                </div>
            </div>
        </div>
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title">{{ $lang("") }}</div>
            <div class="dev-mgmt-item-content">
                <div class="dev-mgmt-item-tips">{{ $lang("") }}</div>
            </div>
        </div>
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
        ...mapGetters(["$lang"]),
    },
    mixins: [uploadFile, rebootOlt, saveConfig],
    data() {
        return {
            configFile: null,
            fileList: [],
        };
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick((_) => {
            this.updateAdvMainScrollbar();
        });
    },
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
                .then((res) => {
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
                .catch((err) => {});
        },
        backupConfig() {
            this.$http
                .get("/system_backup")
                .then((res) => {
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
                .catch((err) => {});
        },
        defaultConfig() {
            this.$confirm(this.$lang("def_cfg_hit"))
                .then((_) => {
                    this.$http
                        .get("/system_def_config")
                        .then((res) => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("def_cfg_succ")
                                );
                                const timer = setTimeout((_) => {
                                    this.reboot();
                                }, 15000);
                                this.rebootOlt(null, timer);
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch((err) => {});
                })
                .catch((_) => {});
        },
        viewCurrentConfig() {
            this.$confirm(this.$lang("confirm_download_file"))
                .then((_) => {
                    this.$http
                        .get("/system_running_config")
                        .then((res) => {
                            if (res.data.code === 1) {
                                // try {
                                //     const anchor = document.createElement("a");
                                //     anchor.href = "/oltconfigtmp.txt";
                                //     anchor.setAttribute(
                                //         "download",
                                //         "oltconfigtmp.txt"
                                //     );
                                //     anchor.style.display = "none";
                                //     document.body.appendChild(anchor);
                                //     anchor.click();
                                //     document.body.removeChild(anchor);
                                // } catch (e) {}
                                window.open("/oltconfigtmp.txt", "_blank");
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch((err) => {});
                })
                .catch((_) => {});
        },
    },
};
</script>

<style lang="less" scoped>
// .dev-mgmt-item {
//     span {
//         color: @titleColor;
//     }
//     p {
//         .base-font-style;
//     }
// }
.lf {
    float: left;
}
.dev-mgmt-item {
    margin: 30px 0;
    .dev-mgmt-item-title {
        .lf;
        color: @titleColor;
        line-height: 32px;
        margin: 0 20px 0 10px;
    }
    .dev-mgmt-item-content {
        .lf;
        &:after {
            content: "";
            display: table;
            clear: both;
        }
    }
    .dev-mgmt-item-tips {
        .base-font-style;
        float: left;
        height: 32px;
        line-height: 32px;
        margin-left: 30px;
    }
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}
</style>