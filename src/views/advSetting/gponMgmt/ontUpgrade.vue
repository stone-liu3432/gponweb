<template>
    <div>
        <page-header type="pon" @port-change="portChange">
            <template slot="title">{{ $lang("onu_batch_upgrade") }}</template>
            <template slot="content">
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px"
                    @click="refreshData"
                >
                    {{ $lang("refresh") }}
                </el-button>
            </template>
        </page-header>
        <div class="ont-upgrade-state">
            <span>{{ $lang("upgrade_state") }}:</span>
            <span>{{ UPGRADE_STATE_MAP[statusData.upgrade_state] }}</span>
        </div>
        <div class="ont-upgrade-state">
            <span>{{ $lang("file_size") }}:</span>
            <span>{{ statusData.file_size }}</span>
        </div>
        <div class="ont-upgrade-file">
            <el-upload
                action="https://www.hsgq.com"
                :multiple="false"
                :limit="1"
                :file-list="fileList"
                :auto-upload="false"
                :on-change="fileChange"
                :before-remove="removeFile"
                style="width: 360px"
            >
                <el-button size="small" type="primary" slot="trigger">
                    {{ $lang("file_click") }}
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px"
                    @click="submitFile"
                >
                    {{ $lang("commit") }}
                </el-button>
                <div slot="tip" class="el-upload__tip">
                    {{ $lang("select_ont_file") }}
                </div>
            </el-upload>
        </div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane
                :label="$lang('onu_upgrade_status')"
                name="upgradeStatus"
            >
                <upgrade-status :data="statusData"></upgrade-status>
            </el-tab-pane>
            <el-tab-pane
                :label="$lang('onu_batch_upgrade')"
                name="batchUpgrade"
            >
                <batch-upgrade
                    :data="versionData"
                    @start-upgrade="startUpgrade"
                    @cancel-upgrade="cancelUpgrade"
                ></batch-upgrade>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isArray, debounce } from "@/utils/common";
import upgradeStatus from "./ontUpgrade/upgradeStatus";
import batchUpgrade from "./ontUpgrade/batchUpgrade";
import uploadFile from "@/mixin/uploadFile";
import postData from "@/mixin/postData";
import timeVue from "../system/time.vue";
export default {
    name: "ontUpgrade",
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateAdvMainScrollbar();
        });
    },
    mixins: [uploadFile, postData],
    components: { upgradeStatus, batchUpgrade },
    computed: {
        ...mapGetters(["$lang"]),
        UPGRADE_STATE_MAP() {
            return ["not start", "in process", "success", "failure", "aborted"];
        },
    },
    data() {
        return {
            port_id: 0,
            activeName: "upgradeStatus",
            statusData: {},
            versionData: [],
            fileList: [],
            upgradeFile: null,
        };
    },
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
            this.getData(port_id);
        },
        getOntUpgradeState(port_id) {
            this.statusData = {};
            this.$http
                .get(
                    `/gpon_ontupgrade?form=ont_upgrade_status&port_id=${port_id}`
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.statusData = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getOntVersions(port_id) {
            this.$http
                .get(`/gpon_ontupgrade?form=ont_version&port_id=${port_id}`)
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.versionData = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getData(port_id) {
            switch (this.activeName) {
                case "upgradeStatus":
                    this.getOntUpgradeState(port_id);
                    break;
                case "batchUpgrade":
                    this.getOntVersions(port_id);
                    break;
            }
        },
        refreshData() {
            debounce(this.getData, 1000, this, this.port_id);
        },
        submitFile() {
            if (!this.upgradeFile) {
                return this.$message.error(this.$lang("file_not_select"));
            }
            this.$confirm(this.$lang("if_sure", "commit") + " ?")
                .then(() => {
                    const formData = new FormData();
                    formData.append("file", this.upgradeFile);
                    this.uploadFile("/upgrade?type=ontimage", formData)
                        .then((res) => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("commit", "st_success")
                                );
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        startUpgrade(ontList) {
            this.$confirm(this.$lang("if_sure") + " ?")
                .then(() => {
                    this.postData(
                        "/gpon_ontupgrade?form=upgrade",
                        {
                            method: "set",
                            param: {
                                port_id: this.port_id,
                                flag: 1,
                                onu_ids: ontList,
                            },
                        },
                        false
                    )
                        .then((res) => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("ont_upgrade_succ_msg")
                                );
                                // this.activeName = "upgradeStatus";
                                // this.getData(this.port_id);
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        },
        cancelUpgrade(ontList) {
            this.$confirm(this.$lang("if_sure") + " ?")
                .then(() => {
                    this.postData("/gpon_ontupgrade?form=upgrade", {
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            flag: 0,
                            onu_ids: ontList,
                        },
                    })
                        .then(() => {
                            this.getData(this.port_id);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        fileChange(file) {
            this.upgradeFile = file.raw;
        },
        removeFile() {
            this.upgradeFile = null;
        },
    },
    watch: {
        activeName() {
            this.getData(this.port_id);
        },
    },
};
</script>

<style lang="less" scoped>
.ont-upgrade-state {
    .base-font-style;
    margin: 12px 0;
    span + span {
        padding: 0 12px;
    }
}
.ont-upgrade-file {
    margin: 20px 0;
}
</style>