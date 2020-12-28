<template>
    <div>
        <h3>
            {{ $lang("sys_port") }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="openDialog('sysport')"
            >
                {{ $lang("config") }}
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                v-if="showRestoreBtn"
                @click="restoreDefPorts"
            >
                {{ $lang("restore_defaults") }}
            </el-button>
        </h3>
        <div class="system-port-item">
            <span>http:</span>
            <span>{{ baseData.http || "-" }}</span>
        </div>
        <div class="system-port-item">
            <span>https:</span>
            <span>{{ baseData.https || "-" }}</span>
        </div>
        <div class="system-port-item">
            <span>telnet:</span>
            <span>{{ baseData.telnet || "-" }}</span>
        </div>
        <h3>
            {{ $lang("syslog_server") }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="openDialog('syslog')"
            >
                {{ $lang("config") }}
            </el-button>
            <el-button type="primary" size="small" style="margin-left: 30px">
                {{ $lang("delete") }}
            </el-button>
        </h3>
        <div class="system-port-item">
            <span>{{ $lang("ipaddr") }}:</span>
            <span>{{ sysLogIp }}</span>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            width="650px"
        >
            <div slot="title">{{ $lang("config") }}</div>
            <sys-port-form ref="sys-port-form"></sys-port-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('sys-port-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import sysPortForm from "./sysPortForm";
import postData from "@/mixin/postData";
import { isFunction } from "@/utils/common";
export default {
    name: "sysPort",
    mixins: [postData],
    components: { sysPortForm },
    computed: {
        ...mapGetters(["$lang"]),
        showRestoreBtn() {
            return !(
                this.baseData.http === 80 &&
                this.baseData.https === 443 &&
                this.baseData.telnet === 23
            );
        },
    },
    props: {
        baseData: {
            type: Object,
        },
        sysLogIp: {
            type: String,
        },
    },
    data() {
        return {
            dialogVisible: false,
            dialogType: "",
        };
    },
    methods: {
        openDialog(type) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(() => {
                this.$refs["sys-port-form"].init(
                    type === "sysport"
                        ? this.baseData
                        : { ipaddr: this.sysLogIp },
                    this.dialogType
                );
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form, type) => {
                if (form) {
                    const ACTIONS = {
                        sysport(form) {
                            if (
                                Number(form.http) === this.baseData.http &&
                                Number(form.https) === this.baseData.https &&
                                Number(form.telnet) === this.baseData.telnet
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/system_service?form=port",
                                data: {
                                    method: "set",
                                    param: {
                                        http: Number(form.http),
                                        https: Number(form.https),
                                        telnet: Number(form.telnet),
                                    },
                                },
                            };
                        },
                        syslog(form) {
                            if (form.ipaddr === this.sysLogIp) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/system_service?form=syslog",
                                data: {
                                    method: "set",
                                    param: {
                                        ipaddr: form.ipaddr,
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
                                    this.$emit("refresh");
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
        restoreDefPorts() {
            this.$confirm(this.$lang("if_sure", "restore_defaults") + " ?")
                .then((_) => {
                    this.postData("/system_service?form=port", {
                        method: "set",
                        param: {
                            http: 80,
                            https: 443,
                            telnet: 23,
                        },
                    })
                        .then((_) => {
                            this.$emit("refresh");
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
    },
};
</script>

<style lang="less" scoped>
.system-port-item {
    .base-font-style;
    margin: 20px 0 20px 10px;
    span {
        display: inline-block;
        vertical-align: middle;
        & + span {
            margin-left: 12px;
        }
    }
}
h3 {
    color: @titleColor;
}
</style>