<template>
    <div>
        <page-header type="none">
            <div slot="title">{{ $lang("pon_setting") }}</div>
        </page-header>
        <template v-if="Object.keys(ponInfo).length && ponInfo.gpon_setting">
            <div class="pon-setting-info">
                <span>{{ $lang("af_aging_time") }}:</span>
                <span>{{ ponInfo.af_aging_time }}</span>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px"
                    @click="openDialog('time', ponInfo)"
                >
                    {{ $lang("config") }}
                </el-button>
            </div>
            <div class="pon-setting-info">
                <span>{{ $lang("af_interval") }}:</span>
                <span>{{ ponInfo.af_interval }}</span>
            </div>
            <div style="margin: 20px 0 20px 0px">
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('all')"
                >
                    {{ $lang("config", "all", "port") }}
                </el-button>
            </div>
            <el-table :data="ponInfo.gpon_setting || []" border>
                <el-table-column
                    :label="$lang('port_id')"
                    prop="port_id"
                    width="100px"
                >
                    <template slot-scope="scope">
                        {{ getPortName(scope.row.port_id) }}
                    </template>
                </el-table-column>
                <el-table-column :label="$lang('autofind')" prop="autofind">
                    <template slot-scope="scope">
                        <div class="pon-setting-info-item">
                            <span>
                                {{
                                    scope.row.autofind
                                        ? $lang("enable")
                                        : $lang("disable")
                                }}
                            </span>
                            <el-switch
                                v-model="scope.row.autofind"
                                :active-value="1"
                                :inactive-value="0"
                                @change="changeAutofind(scope.row)"
                            ></el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$lang('laser')" prop="laser">
                    <template slot-scope="scope">
                        <div class="pon-setting-info-item">
                            <span>
                                {{
                                    scope.row.laser ? $lang("on") : $lang("off")
                                }}
                            </span>
                            <el-switch
                                v-model="scope.row.laser"
                                @change="changeLaser(scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                            ></el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$lang('trx_type')" width="300px">
                    <template slot-scope="scope">
                        <div class="pon-setting-info-item">
                            <span style="width: 200px">
                                {{ TRX_TYPE_MAP[scope.row.trx_type] }}
                            </span>
                            <el-button
                                type="text"
                                style="margin-left: 12px"
                                @click="openDialog('trx_type', scope.row)"
                            >
                                {{ $lang("config") }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$lang('auth_type')" prop="auth_type">
                    <template slot-scope="scope">
                        <div class="pon-setting-info-item">
                            <span>
                                {{ scope.row.auth_type ? "Auto" : "Manual" }}
                            </span>
                            <el-button
                                type="text"
                                @click="openDialog('auth', scope.row)"
                            >
                                {{ $lang("config") }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$lang('lineprof_id')"
                    prop="lineprof_id"
                >
                    <template slot-scope="scope">
                        {{ scope.row.auth_type ? scope.row.lineprof_id : "-" }}
                    </template>
                </el-table-column>
                <el-table-column :label="$lang('srvprof_id')" prop="srvprof_id">
                    <template slot-scope="scope">
                        {{ scope.row.auth_type ? scope.row.srvprof_id : "-" }}
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                :visible.sync="dialogVisible"
                append-to-body
                width="650px"
            >
                <div slot="title">
                    {{ $lang(dialogTitle) || $lang("config", "all", "port") }}
                </div>
                <pon-setting-form ref="pon-setting-form"></pon-setting-form>
                <div slot="footer">
                    <el-button @click="dialogVisible = false">
                        {{ $lang("cancel") }}
                    </el-button>
                    <el-button
                        type="primary"
                        @click="submitForm('pon-setting-form')"
                    >
                        {{ $lang("apply") }}
                    </el-button>
                </div>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { TRX_TYPE_MAP } from "@/utils/commonData";
import postData from "@/mixin/postData";
import ponSettingForm from "./ponSetting/ponSettingForm";
const TITLE_MAP = {
    time: "af_aging_time",
    interval: "af_interval",
    auth: "auth_type",
};
export default {
    name: "ponSetting",
    mixins: [postData],
    components: { ponSettingForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        dialogTitle() {
            return TITLE_MAP[this.dialogType] || "";
        },
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick((_) => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            TRX_TYPE_MAP,
            ponInfo: {},
            dialogVisible: false,
            dialogType: "",
            dialogData: null,
        };
    },
    created() {
        this.getData();
        this.getLineProfs();
        this.getSrvProfs();
    },
    methods: {
        ...mapActions(["getLineProfs", "getSrvProfs"]),
        getData() {
            this.$http
                .get("/gponmgmt?form=gpon_setting")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.ponInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        changeAutofind(row) {
            row.autofind = Number(!row.autofind);
            this.$confirm(
                this.$lang("if_sure", row.autofind ? "off" : "on", "autofind") +
                    " ?"
            )
                .then((_) => {
                    const url = `/gponmgmt?form=ont_autofind&port_id=${row.port_id}`,
                        data = {
                            method: "set",
                            param: {
                                autofind: Number(!row.autofind),
                            },
                        };
                    this.postData(url, data)
                        .then((_) => {
                            this.getData();
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
        changeLaser(row) {
            row.laser = Number(!row.laser);
            this.$confirm(
                this.$lang("if_sure", row.laser ? "off" : "on", "laser") + " ?"
            )
                .then((_) => {
                    const url = `/gponmgmt?form=laser&port_id=${row.port_id}`,
                        data = {
                            method: "set",
                            param: {
                                laser: Number(!row.laser),
                            },
                        };
                    this.postData(url, data)
                        .then((_) => {
                            this.getData();
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
        openDialog(type, data) {
            this.dialogVisible = true;
            this.dialogType = type;
            if (data) {
                this.dialogData = JSON.parse(JSON.stringify(data));
            }
            this.$nextTick((_) => {
                this.$refs["pon-setting-form"].init(type, data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, data) => {
                if (
                    type === "auth" &&
                    ["auth_type", "lineprof_id", "srvprof_id"].every(
                        (key) => data[key] === this.dialogData[key]
                    )
                ) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
                // pon 模块类型
                if (
                    type === "trx_type" &&
                    this.dialogData["trx_type"] === data["trx_type"]
                ) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
                const ACTIONS = {
                    auth(form) {
                        return {
                            url: `/gponmgmt?form=ont_auth&port_id=${this.dialogData.port_id}`,
                            param: {
                                method: "set",
                                param: {
                                    auth_type: form.auth_type,
                                    lineprof_id: form.lineprof_id,
                                    srvprof_id: form.srvprof_id,
                                },
                            },
                        };
                    },
                    time(form) {
                        return {
                            url: `/gponmgmt?form=af_param`,
                            param: {
                                method: "set",
                                param: {
                                    af_aging_time: form.af_aging_time,
                                    af_interval: form.af_interval,
                                },
                            },
                        };
                    },
                    interval(form) {
                        return {
                            url: `/gponmgmt?form=af_param`,
                            param: {
                                method: "set",
                                param: {
                                    af_aging_time: form.af_aging_time,
                                    af_interval: form.af_interval,
                                },
                            },
                        };
                    },
                    trx_type(form) {
                        return {
                            url: `/gponmgmt?form=trxtype&port_id=${this.dialogData.port_id}`,
                            param: {
                                method: "set",
                                param: {
                                    trx_type: form.trx_type,
                                },
                            },
                        };
                    },
                    all(form) {
                        return {
                            url: "/gponmgmt?form=gpon_setting",
                            param: {
                                method: "set",
                                param: {
                                    autofind: form.autofind,
                                    laser: form.laser,
                                    trx_type: form.trx_type,
                                    auth_type: form.auth_type,
                                    lineprof_id: form.lineprof_id,
                                    srvprof_id: form.srvprof_id,
                                },
                            },
                        };
                    },
                };
                if (isFunction(ACTIONS[type])) {
                    const res = ACTIONS[type].call(this, data);
                    if (res) {
                        const { url, param } = res;
                        url &&
                            param &&
                            this.postData(url, param)
                                .then((_) => {
                                    this.getData();
                                })
                                .catch((_) => {});
                        this.dialogVisible = false;
                    }
                }
            });
        },
        command({ action, row }) {
            const ACTIONS = {
                autofind(data) {
                    this.changeAutofind(data);
                },
                laser(data) {
                    this.changeLaser(data);
                },
                auth_type(data) {
                    this.openDialog("auth", data);
                },
                trx_type(data) {
                    this.openDialog("trx_type", data);
                },
            };
            if (isFunction(ACTIONS[action])) {
                ACTIONS[action].call(this, row);
            }
        },
    },
};
</script>

<style lang="less" scoped>
.pon-setting-info {
    .base-font-style;
    margin: 12px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
        &:first-child {
            width: 200px;
        }
        & + span {
            width: 120px;
        }
    }
}
.pon-setting-info-item {
    > span {
        display: inline-block;
        width: 80px;
        vertical-align: middle;
    }
}
.el-dropdown-link {
    cursor: pointer;
    color: @titleColor;
}
</style>