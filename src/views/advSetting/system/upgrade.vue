<template>
    <div>
        <page-header :title="$lang('upgrade')" type="none"></page-header>
        <el-card shadow="none" style="margin: 30px 0;">
            <template slot="header">{{ $lang('firmware') }}</template>
            <p>{{ $lang('file_limit_img') }}</p>
            <el-upload
                :auto-upload="false"
                action="www.hsgq.com"
                :limit="1"
                :multiple="false"
                :on-change="fwFileChange"
                :before-remove="removeFwFile"
                :file-list="fwList"
                accept=".img"
            >
                <el-button slot="trigger" size="small" type="primary">{{ $lang('file_click') }}</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitFile('firmware')"
                >{{ $lang('apply') }}</el-button>
            </el-upload>
        </el-card>
        <el-card shadow="none" style="margin: 30px 0;">
            <template slot="header">{{ $lang('system') }}</template>
            <p>{{ $lang('file_limit_img') }}</p>
            <el-upload
                :auto-upload="false"
                action="www.hsgq.com"
                :limit="1"
                :multiple="false"
                :on-change="sysFileChange"
                :before-remove="removeSysFile"
                :file-list="sysList"
                accept=".img"
            >
                <el-button slot="trigger" size="small" type="primary">{{ $lang('file_click') }}</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitFile('system')"
                >{{ $lang('apply') }}</el-button>
            </el-upload>
        </el-card>
        <el-card shadow="none" style="margin: 30px 0;">
            <template slot="header">{{ $lang('fullversion') }}</template>
            <p>{{ $lang('file_limit_zip') }}</p>
            <el-upload
                :auto-upload="false"
                action="www.hsgq.com"
                :limit="1"
                :multiple="false"
                :on-change="fullFileChange"
                :before-remove="removeFullFile"
                :file-list="fullList"
                accept=".zip"
            >
                <el-button slot="trigger" size="small" type="primary">{{ $lang('file_click') }}</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitFile('fullversion')"
                >{{ $lang('apply') }}</el-button>
            </el-upload>
        </el-card>
        <div v-show="showLoading" class="el-loading-mask is-fullscreen" style="min-height: 500px;">
            <div class="nms-dialog-container">
                <span>{{ $lang('upgrade_tips') }}</span>
                <el-progress
                    :text-inside="true"
                    :stroke-width="22"
                    :percentage="randomNum"
                    status="warning"
                ></el-progress>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import uploadFile from "@/mixin/uploadFile";
import rebootOlt from "@/mixin/rebootOlt";
import { isFunction, isPromise } from "@/utils/common";
const URLS = {
    firmware: "/upgrade?type=firmware",
    system: "/upgrade?type=system",
    fullversion: "/upgrade?type=fullversion"
};
export default {
    name: "upgradeDevice",
    mixins: [uploadFile, rebootOlt],
    data() {
        return {
            fwFile: null,
            fwList: [],
            sysFile: null,
            sysList: [],
            fullFile: null,
            fullList: [],
            randomNum: 0,
            interval: null,
            showLoading: false,
            loadingType: ""
        };
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    computed: {
        ...mapGetters(["$lang"])
    },
    methods: {
        fwFileChange(file, list) {
            this.fwFile = file.raw;
        },
        removeFwFile(file, list) {
            this.fwFile = null;
        },
        sysFileChange(file, list) {
            this.sysFile = file.raw;
        },
        removeSysFile(file, list) {
            this.sysFile = null;
        },
        fullFileChange(file, list) {
            this.fullFile = file.raw;
        },
        removeFullFile(file, list) {
            this.fullFile = null;
        },
        submitFile(type) {
            const ACTIONS = {
                firmware(url) {
                    if (!this.fwFile) {
                        return this.$message.error(
                            this.$lang("file_not_select")
                        );
                    }
                    return this.uploadFile(url, this.fwFile);
                },
                system(url) {
                    if (!this.sysFile) {
                        return this.$message.error(
                            this.$lang("file_not_select")
                        );
                    }
                    return this.uploadFile(url, this.sysFile);
                },
                fullversion(url) {
                    if (!this.fullFile) {
                        return this.$message.error(
                            this.$lang("file_not_select")
                        );
                    }
                    return this.uploadFile(url, this.fullFile);
                }
            };
            if (isFunction(ACTIONS[type])) {
                const result = ACTIONS[type].call(this, URLS[type]);
                if (isPromise(result)) {
                    this.showLoading = true;
                    this.loadingType = type;
                    result
                        .then(res => {
                            if (res.data.code === 1) {
                                this.testStatus(type);
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                                this.closeLoading();
                            }
                        })
                        .catch(err => {});
                }
            }
        },
        testStatus(type) {
            setTimeout(_ => {
                this.$http
                    .get("/upgrade_status")
                    .then(res => {
                        /*
                            code: 
                            为2时文件头不对
                            为3时其他失败原因。

                            status :
                            没有升级返回0，
                            正在升级返回1，
                            升级成功返回2，
                            其他用户正在升级返回3
                         */
                        if (res.data.code === 1) {
                            const { status } = res.data.data;
                            if (status === 1) {
                                this.testStatus(type);
                            } else if (status === 2) {
                                this.$message.success(
                                    this.upgradeTips(type)["succ"]
                                );
                                this.closeLoading();
                                const timer = setTimeout(_ => {
                                    this.reboot();
                                }, 15000);
                                this.rebootOlt(
                                    this.$lang("upgrade_success"),
                                    timer
                                );
                            } else if (status === 3) {
                                this.$message.error(this.$lang("upgrade_buzy"));
                                this.closeLoading();
                            }
                        } else if (res.data.code === 2) {
                            this.$message.error(
                                this.$lang("file_header_error")
                            );
                            this.closeLoading();
                        } else if (res.data.code === 3) {
                            this.$message.error(this.upgradeTips(type)["fail"]);
                            this.closeLoading();
                        }
                    })
                    .catch(err => {});
            }, 15000);
        },
        closeLoading() {
            this.showLoading = false;
        },
        upgradeTips(type) {
            const _this = this;
            const TIPS = {
                firmware: {
                    succ: _this.$lang("fw_upgrade_succ"),
                    fail: _this.$lang("fw_upgrade_fail")
                },
                system: {
                    succ: _this.$lang("sys_upgrade_succ"),
                    fail: _this.$lang("sys_upgrade_fail")
                },
                fullversion: {
                    succ: _this.$lang("fv_upgrade_succ"),
                    fail: _this.$lang("fv_upgrade_fail")
                }
            };
            return TIPS[type];
        }
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    watch: {
        showLoading() {
            if (this.showLoading) {
                this.interval = setInterval(_ => {
                    switch (this.loadingType) {
                        case "firmware": {
                            this.randomNum += Math.round(Math.random() * 3 + 1);
                            break;
                        }
                        case "system": {
                            this.randomNum += Math.round(Math.random() * 3 + 1);
                            break;
                        }
                        case "fullversion": {
                            this.randomNum += Math.round(Math.random() * 2 + 1);
                            break;
                        }
                    }
                    this.randomNum > 95 && (this.randomNum = 95);
                }, 1000);
            } else {
                clearInterval(this.interval);
                this.randomNum = 0;
            }
        }
    }
};
</script>

<style lang="less" scoped>
p {
    .base-font-style;
}
.nms-dialog-container {
    text-align: center;
    width: 400px;
    height: 200px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    span {
        display: inline-block;
        vertical-align: middle;
        margin: 6px 0;
    }
}
</style>