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
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import optCard from "../../gponMgmt/optical/optCard";
import { isDef, isArray } from "@/utils/common";
export default {
    name: "portOpticalDetail",
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
                "receive_power",
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
            ],
        };
    },
    methods: {},
};
</script>

<style lang="less" scoped>
</style>