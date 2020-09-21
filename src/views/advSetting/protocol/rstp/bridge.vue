<template>
    <div>
        <h3>
            {{ $lang('rstp_b_info') }}
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ $lang('config') }}</el-button>
        </h3>
        <template v-if="!!Object.keys(bridgeInfo).length">
            <template v-for="(item, key) in bridgeInfo">
                <el-row :gutter="30" class="rstp-bridge-info">
                    <el-col :span="6" style="width: 260px; margin-left: 12px;">{{ $lang(key) }}</el-col>
                    <el-col :span="12">{{ showItem(key, item) }}</el-col>
                </el-row>
            </template>
        </template>
        <el-dialog
            :title="$lang('config')"
            :visible.sync="dialogVisible"
            append-to-body
            width="650px"
        >
            <bridge-form :form-data="bridgeInfo" ref="rstp-bridge-form"></bridge-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('rstp-bridge-form')"
                >{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import bridgeForm from "./bridgeForm";
import postData from "@/mixin/postData";
import { isEmptyObject, isDef } from "@/utils/common";
export default {
    name: "rstpBridge",
    components: { bridgeForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang"]),
        bridgeInfo() {
            return this.bridgeData;
        }
    },
    props: {
        bridgeData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            modes: { 0: "stp", 2: "rstp", 3: "mstp" },
            dialogVisible: false
        };
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["rstp-bridge-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (isDef(data)) {
                    const post_params = this.composeData(data);
                    if (isDef(post_params)) {
                        this.postData("/switch_rstp?form=bridge", post_params)
                            .then(_ => {
                                this.$emit("refresh");
                            })
                            .catch(_ => {});
                    }
                    this.dialogVisible = false;
                }
            });
        },
        composeData(data) {
            const flags = {
                status: 0x01,
                rb_priority: 0x02,
                max_age: 0x04,
                hello_time: 0x08,
                forward_delay: 0x10,
                rstp_mode: 0x20,
                transmit_hold_count: 0x100
            };
            let flag = 0;
            Object.keys(flags).forEach(key => {
                if (this.bridgeInfo[key] !== data[key]) {
                    flag |= flags[key];
                }
            });
            if (flag === 0) {
                this.$message.warning(this.$lang("modify_tips"));
                return;
            }
            return {
                method: "set",
                param: {
                    flags: flag,
                    status: data.status,
                    rstp_mode: data.rstp_mode,
                    rb_priority: data.rb_priority,
                    max_age: data.max_age,
                    hello_time: data.hello_time,
                    forward_delay: data.forward_delay,
                    transmit_hold_count: data.transmit_hold_count
                }
            };
        },
        showItem(key, item) {
            return key === "status"
                ? item
                    ? this.$lang("enable")
                    : this.$lang("disable")
                : key === "rstp_mode"
                ? this.modes[item]
                : item;
        },
        updateVisible(val) {
            this.dialogVisible = val;
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
.rstp-bridge-info {
    .base-font-style;
    margin: 12px 0;
}
</style>