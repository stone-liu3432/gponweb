<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <opt-card :data="mstateData" title="o_m_state"></opt-card>
            </el-col>
            <el-col :span="12">
                <opt-card
                    :data="manuInfoData"
                    title="o_m_maunu_info"
                ></opt-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
                <opt-card
                    :data="staticInfoData"
                    title="o_m_static_info"
                ></opt-card>
            </el-col>
            <el-col :span="12">
                <opt-card
                    :data="opParamData"
                    title="o_m_threshold"
                    :layout="[16, 8]"
                ></opt-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef } from "@/utils/common";
import optCard from "./optCard";
export default {
    name: "optModule",
    components: { optCard },
    computed: {
        ...mapGetters(["$lang"]),
        mstateData() {
            const STATE_MAP = {
                portstate: [this.$lang("offline"), this.$lang("online")],
                mstate: [this.$lang("undetected"), this.$lang("detected")],
                mtype: [this.$lang("in_cali"), this.$lang("ex_cali")],
            };
            return this.mStates.reduce((prev, item) => {
                if (!prev[item]) {
                    prev[item] = this.data[item];
                    if (isDef(STATE_MAP[item])) {
                        prev[item] = STATE_MAP[item][this.data[item]];
                    }
                }
                return prev;
            }, {});
        },
        manuInfoData() {
            return this.manuInfos.reduce((prev, item) => {
                if (!prev[item]) {
                    prev[item] = this.data[item];
                    if (isArray(this.data[item])) {
                        prev[item] = this.data[item]
                            .map((i) => i.toString(16))
                            .join(" ");
                    }
                }
                return prev;
            }, {});
        },
        staticInfoData() {
            return this.staticInfos.reduce((prev, item) => {
                if (!prev[item]) {
                    prev[item] = this.data[item];
                }
                return prev;
            }, {});
        },
        opParamData() {
            return Object.keys(this.opParams).reduce((prev, item) => {
                prev[item] = `[${this.data[this.opParams[item][0]].toFixed(
                    2
                )}, ${this.data[this.opParams[item][1]].toFixed(2)}]`;
                return prev;
            }, {});
        },
    },
    props: {
        data: {
            type: Object,
        },
    },
    data() {
        return {
            mStates: [
                "portstate",
                "mstate",
                "mtype",
                "work_temprature",
                "work_voltage",
                "transmit_bias",
                "transmit_power",
                // "receive_power"
            ],
            manuInfos: [
                "vendor_name",
                "vendor_oui",
                "vendor_rev",
                "vendor_pn",
                "vendor_sn",
                "date_code",
                "vendor_specific",
            ],
            staticInfos: [
                "module_type",
                "max_distance",
                "wave_length",
                "fiber_type",
                "identifier",
                "connector",
                "encoding",
                "cc_base",
            ],
            opParams: {
                temp_warn_threshold: ["temp_low_warning", "temp_high_warning"],
                temp_alarm_threshold: ["temp_low_alarm", "temp_high_alarm"],
                vol_warn_threshold: ["vol_low_warning", "vol_high_warning"],
                vol_alarm_threshold: ["vol_low_alarm", "vol_high_alarm"],
                tx_bias_warn_threshold: [
                    "bias_low_warning",
                    "bias_high_warning",
                ],
                tx_bias_alarm_threshold: ["bias_low_alarm", "bias_high_alarm"],
                tx_power_warn_threshold: [
                    "txpwr_low_warning",
                    "txpwr_high_warning",
                ],
                tx_power_alarm_threshold: [
                    "txpwr_low_alarm",
                    "txpwr_high_alarm",
                ],
                rx_power_warn_threshold: [
                    "rxpwr_low_warning",
                    "rxpwr_high_warning",
                ],
                rx_power_alarm_threshold: [
                    "rxpwr_low_alarm",
                    "rxpwr_high_alarm",
                ],
            },
        };
    },
    methods: {},
};
</script>

<style lang="less" scoped>
</style>