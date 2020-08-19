<template>
    <div>
        <el-row class="loop-detect-status">
            <el-col :span="6">{{ $lang('ld_status') }}</el-col>
            <el-col :span="4">{{ status ? $lang('enable') : $lang('disable') }}</el-col>
            <el-col :span="4">
                <el-button size="small" type="primary" @click="setLdStatus">{{ $lang('config') }}</el-button>
            </el-col>
        </el-row>
        <template v-if="status">
            <el-row class="loop-detect-status">
                <el-col :span="6">{{ $lang('detect_interval') }}</el-col>
                <el-col :span="4">{{ ldStatus.detect_interval }}</el-col>
                <el-col :span="4">
                    <el-button
                        size="small"
                        type="primary"
                        @click="setDetectInterval"
                    >{{ $lang('config') }}</el-button>
                </el-col>
            </el-row>
            <el-row class="loop-detect-status">
                <el-col :span="6">{{ $lang('recover_mode') }}</el-col>
                <el-col :span="4">{{ ldStatus.recover_mode ? 'Manual' : 'Auto' }}</el-col>
                <el-col :span="8">
                    <el-button
                        size="small"
                        type="primary"
                        @click="setLdRecoverMode"
                    >{{ $lang('config') }}</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        v-if="isManual"
                        @click="recoverManualDebounce"
                    >{{ $lang('recover_manual') }}</el-button>
                </el-col>
            </el-row>
            <el-row class="loop-detect-status">
                <el-col :span="6">{{ $lang('recover_time') }}</el-col>
                <el-col :span="4">{{ ldStatus.recover_time }}</el-col>
                <el-col :span="4">
                    <el-button
                        size="small"
                        type="primary"
                        @click="setRecoverTime"
                    >{{ $lang('config') }}</el-button>
                </el-col>
            </el-row>
            <h3>
                {{ $lang('ld_info') }}
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="refreshData"
                >{{ $lang('refresh') }}</el-button>
            </h3>
            <el-table
                border
                stripe
                :data="ldInfo"
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
                <template v-if="type === 'pon'">
                    <el-table-column :label="`PON ID / ${$lang('onu_id')}`">
                        <template
                            slot-scope="scope"
                        >{{ `${scope.row.port_id} / ${scope.row.onu_id}` }}</template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column :label="$lang('port_id')">
                        <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
                    </el-table-column>
                </template>
                <el-table-column :label="$lang('status')">
                    <template slot-scope="scope">{{ scope.row.status ? 'Loop-Detect' : ' - ' }}</template>
                </el-table-column>
                <template v-if="type === 'pon'">
                    <el-table-column :label="$lang('onu_status')">
                        <template
                            slot-scope="scope"
                        >{{ scope.row.onu_status ? 'Add Black List' : ' - ' }}</template>
                    </el-table-column>
                    <el-table-column :label="`${$lang('loopback')} PON ID / ${$lang('onu_id')}`">
                        <template
                            slot-scope="scope"
                        >{{ `${scope.row.ld_port_id} / ${scope.row.ld_onu_id}` }}</template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column :label="$lang('port_status')">
                        <template slot-scope="scope">{{ scope.row.port_status ? 'Blocked' : ' - ' }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('ld_port_id')">
                        <template slot-scope="scope">{{ getPortName(scope.row.ld_port_id) }}</template>
                    </el-table-column>
                </template>
            </el-table>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isFunction, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
export default {
    name: "loopDetectDetail",
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        status() {
            return this.ldStatus.ld_status;
        },
        isManual() {
            return this.ldStatus.recover_mode === 1;
        }
    },
    data() {
        return {
            ld_status: 0,
            recover_mode: 0
        };
    },
    props: {
        ldStatus: {
            type: Object
        },
        ldInfo: {
            type: Array
        },
        type: {
            type: String
        }
    },
    methods: {
        setLdStatus() {
            this.ld_status = this.status;
            this.$msgbox({
                title: this.$lang("config"),
                message: (
                    <div class="ld-form-content">
                        <span>{this.$lang("ld_status")}</span>
                        <select v-model={this.ld_status}>
                            <option value={0}>{this.$lang("disable")}</option>
                            <option value={1}>{this.$lang("enable")}</option>
                        </select>
                    </div>
                ),
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                showCancelButton: true
            })
                .then(_ => {
                    if (this.ld_status === this.ldStatus.ld_status) {
                        return;
                    }
                    this.submitActions("ld_status", this.ld_status);
                })
                .catch(_ => {});
        },
        setLdRecoverMode() {
            this.recover_mode = this.ldStatus.recover_mode;
            this.$msgbox({
                title: this.$lang("config"),
                message: (
                    <div class="ld-form-content">
                        <span>{this.$lang("recover_mode")}</span>
                        <select v-model={this.recover_mode}>
                            <option value={0}>Auto</option>
                            <option value={1}>Manual</option>
                        </select>
                    </div>
                ),
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                showCancelButton: true
            })
                .then(_ => {
                    if (this.recover_mode === this.ldStatus.recover_mode) {
                        return;
                    }
                    this.submitActions("recover_mode", this.recover_mode);
                })
                .catch(_ => {});
        },
        setDetectInterval() {
            this.$prompt(this.$lang("detect_interval"), {
                title: this.$lang("config"),
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                inputValue: this.ldStatus.detect_interval,
                inputErrorMessage: this.validateMsg("inputRange", 3, 3600),
                inputValidator: val => {
                    const v = val >>> 0;
                    return v >= 3 && v <= 3600 && !isNaN(v);
                }
            })
                .then(({ value }) => {
                    const val = value >>> 0;
                    if (val === this.ldStatus.detect_interval) {
                        return;
                    }
                    this.submitActions("detect_interval", val);
                })
                .catch(_ => {});
        },
        setRecoverTime() {
            this.$prompt(this.$lang("recover_time"), {
                title: this.$lang("config"),
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                inputValue: this.ldStatus.recover_time,
                inputErrorMessage: this.validateMsg("inputRange", 3, 3600),
                inputValidator: val => {
                    const v = val >>> 0;
                    return v >= 3 && v <= 3600 && !isNaN(v);
                }
            })
                .then(({ value }) => {
                    const val = value >>> 0;
                    if (val === this.ldStatus.recover_time) {
                        return;
                    }
                    this.submitActions("recover_time", val);
                })
                .catch(_ => {});
        },
        submitActions(action, val) {
            const ACTIONS = {
                ld_status(val) {
                    if (this.type === "pon_loop_detect") {
                        return {
                            url: "/pon_loop_detect?form=admin",
                            data: {
                                method: "set",
                                param: {
                                    ld_status: val
                                }
                            }
                        };
                    }
                    if (this.type === "ge_loop_detect") {
                        return {
                            url: "/switch_loop_detect?form=admin",
                            data: {
                                method: "set",
                                param: {
                                    ld_status: val
                                }
                            }
                        };
                    }
                },
                recover_mode(val) {
                    if (this.type === "pon_loop_detect") {
                        return {
                            url: "/pon_loop_detect?form=recover_mode",
                            data: {
                                method: "set",
                                param: {
                                    recover_mode: val
                                }
                            }
                        };
                    }
                    if (this.type === "ge_loop_detect") {
                        return {
                            url: "/switch_loop_detect?form=recover_mode",
                            data: {
                                method: "set",
                                param: {
                                    recover_mode: val
                                }
                            }
                        };
                    }
                },
                detect_interval(val) {
                    if (this.type === "pon_loop_detect") {
                        return {
                            url: "/pon_loop_detect?form=detect_interval",
                            data: {
                                method: "set",
                                param: {
                                    detect_interval: val
                                }
                            }
                        };
                    }
                    if (this.type === "ge_loop_detect") {
                        return {
                            url: "/switch_loop_detect?form=detect_interval",
                            data: {
                                method: "set",
                                param: {
                                    detect_interval: val
                                }
                            }
                        };
                    }
                },
                recover_time(val) {
                    if (this.type === "pon_loop_detect") {
                        return {
                            url: "/pon_loop_detect?form=recover_time",
                            data: {
                                method: "set",
                                param: {
                                    recover_time: val
                                }
                            }
                        };
                    }
                    if (this.type === "ge_loop_detect") {
                        return {
                            url: "/switch_loop_detect?form=recover_time",
                            data: {
                                method: "set",
                                param: {
                                    recover_time: val
                                }
                            }
                        };
                    }
                }
            };
            if (isFunction(ACTIONS[action])) {
                const { url, data } = ACTIONS[action].call(this, val);
                this.postData(url, data)
                    .then(_ => {
                        this.$emit("refresh");
                    })
                    .catch(_ => {});
            }
        },
        recoverManual() {
            let url = "/pon_loop_detect?form=recover_manual";
            if (this.type === "ge_loop_detect") {
                url = "/switch_loop_detect?form=recover_manual";
            }
            const post_params = {
                method: "set",
                param: {
                    manual: 0
                }
            };
            this.postData(url, post_params)
                .then(_ => {
                    this.$emit("refresh");
                })
                .catch(_ => {});
        },
        recoverManualDebounce() {
            debounce(this.recoverManual, 1000, this);
        },
        refreshData() {
            debounce(this.$emit, 1000, this, "refresh-info");
        }
    }
};
</script>

<style lang="less" scoped>
.loop-detect-status {
    .base-font-style;
    margin: 10px;
}
h3 {
    color: @titleColor;
}
.ld-form-content {
    span {
        float: left;
        width: 150px;
        line-height: 30px;
        & + div {
            float: left;
        }
    }
    select {
        .base-font-style;
        width: 200px;
        height: 30px;
        text-indent: 10px;
        border-radius: 3px;
    }
    input[type="text"] {
        .base-font-style;
        position: relative;
        width: 200px;
        height: 30px;
        border-radius: 3px;
        text-indent: 10px;
        border: @border-style;
        outline: none;
        &:focus {
            border: 1px solid @titleColor;
        }
    }
    &:after {
        content: "";
        display: table;
        clear: both;
    }
    p {
        line-height: 18px;
        color: red;
        font-size: 12px;
        text-indent: 10px;
        opacity: 0.7;
    }
}
</style>