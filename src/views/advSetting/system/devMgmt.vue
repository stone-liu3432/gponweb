<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("dev_mgmt") }} </template>
        </page-header>
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
            <div class="dev-mgmt-item-title" style="margin-bottom: 12px">
                {{ $lang("fan_info") }}
            </div>
            <el-table :data="fanctrls" border style="margin-left: 10px">
                <el-table-column
                    :label="$lang('fanid')"
                    prop="fanid"
                ></el-table-column>
                <el-table-column :label="$lang('mode')" prop="mode">
                    <template slot-scope="scope">
                        {{ $lang(FAN_MODE_MAP[scope.row.mode]) }}
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$lang('fan_speed')"
                    prop="speed"
                ></el-table-column>
                <el-table-column
                    :label="$lang('temperature')"
                    prop="temperature"
                ></el-table-column>
                <el-table-column :label="$lang('config')" width="150px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="openDialog('mode', scope.row)"
                        >
                            {{ $lang("config", "mode") }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dev-mgmt-item">
            <div class="dev-mgmt-item-title" style="margin-bottom: 12px">
                {{ $lang("fan_mgmt") }}
            </div>
            <el-table :data="fanaps" border style="margin-left: 10px">
                <el-table-column
                    :label="$lang('fanid')"
                    prop="fanid"
                ></el-table-column>
                <el-table-column
                    :label="$lang('temp1')"
                    prop="temp1"
                ></el-table-column>
                <el-table-column
                    :label="$lang('speed1')"
                    prop="speed1"
                ></el-table-column>
                <el-table-column
                    :label="$lang('temp2')"
                    prop="temp2"
                ></el-table-column>
                <el-table-column
                    :label="$lang('speed2')"
                    prop="speed2"
                ></el-table-column>
                <el-table-column :label="$lang('config')" width="150px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="openDialog('ap', scope.row)"
                        >
                            {{ $lang("config") }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            width="650px"
        >
            <template slot="title">{{ $lang("config") }}</template>
            <dev-mgmt-form ref="dev-mgmt-form"></dev-mgmt-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dev-mgmt-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isPlainObject, isDef, isArray, isFunction } from "@/utils/common";
import { FAN_MODE_MAP } from "@/utils/commonData";
import uploadFile from "@/mixin/uploadFile";
import rebootOlt from "@/mixin/rebootOlt";
import saveConfig from "@/mixin/saveConfig";
import devMgmtForm from "./devMgmt/devMgmtForm";
import postData from "@/mixin/postData";
export default {
    name: "devMgmt",
    computed: {
        ...mapGetters(["$lang"]),
    },
    components: { devMgmtForm },
    mixins: [uploadFile, rebootOlt, saveConfig, postData],
    data() {
        return {
            configFile: null,
            fileList: [],
            FAN_MODE_MAP,
            fanctrls: [],
            fanaps: [],
            dialogVisible: false,
        };
    },
    created() {
        this.getFanInfo();
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
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
        getFanInfo() {
            this.$http
                .get("/board?info=faninfo")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            if (isArray(res.data.data.fanctrl)) {
                                this.fanctrls = res.data.data.fanctrl;
                            }
                            if (isArray(res.data.data.fanap)) {
                                this.fanaps = res.data.data.fanap;
                            }
                        }
                    }
                })
                .catch((err) => {});
        },
        openDialog(type, row) {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["dev-mgmt-form"].init(type, row);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, form) => {
                if (form) {
                    const ACTIONS = {
                        ap(form) {
                            return {
                                url: "/board?info=fanpoint",
                                data: {
                                    method: "set",
                                    param: {
                                        fanid: form.fanid,
                                        speed1: form.speed1,
                                        speed2: form.speed2,
                                        temp1: form.temp1,
                                        temp2: form.temp2,
                                    },
                                },
                            };
                        },
                        mode(form) {
                            return {
                                url: "/board?info=fanmode",
                                data: {
                                    method: "set",
                                    param: {
                                        mode: form.mode,
                                        fanid: form.fanid,
                                        speed: Number(form.speed),
                                    },
                                },
                            };
                        },
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, form);
                        if (res) {
                            const { url, data } = res;
                            this.postData(url, data)
                                .then(() => {
                                    this.getFanInfo();
                                })
                                .catch(() => {})
                                .finally(() => {
                                    this.dialogVisible = false;
                                });
                        }
                    }
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
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