<template>
    <el-form
        :model="form"
        label-width="200px"
        :rules="rules"
        ref="igmp-info-form"
    >
        <el-form-item :label="$lang('mode')" prop="mode">
            <el-select v-model.number="form.mode">
                <template v-for="(item, index) in IGMP_MODES">
                    <el-option :value="index" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="form.mode !== 0">
            <el-form-item :label="$lang('fast_leave')" prop="fast_leave">
                <el-select v-model.number="form.fast_leave">
                    <template v-for="(item, index) in SWITCH">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <!-- <el-form-item :label="$lang('protocol_policy')" prop="protocol_policy">
                <el-select v-model.number="form.protocol_policy">
                    <template v-for="(item, index) in IGMP_PROTOCOL_POLICIES">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item> -->
            <template v-if="form.mode === 1">
                <el-form-item
                    :label="$lang('group_aging_time')"
                    prop="group_aging_time"
                >
                    <el-input v-model.number="form.group_aging_time"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.mode === 2">
                <el-form-item :label="$lang('robustness')" prop="robustness">
                    <el-input v-model.number="form.robustness"></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('gen_response_time')"
                    prop="gen_response_time"
                >
                    <el-input
                        v-model.number="form.gen_response_time"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('gen_query_interval')"
                    prop="gen_query_interval"
                >
                    <el-input
                        v-model.number="form.gen_query_interval"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('sp_response_time')"
                    prop="sp_response_time"
                >
                    <el-input v-model.number="form.sp_response_time"></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('sp_query_interval')"
                    prop="sp_query_interval"
                >
                    <el-input
                        v-model.number="form.sp_query_interval"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('sp_query_number')"
                    prop="sp_query_number"
                >
                    <el-input v-model.number="form.sp_query_number"></el-input>
                </el-form-item>
            </template>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { IGMP_MODES, SWITCH, IGMP_PROTOCOL_POLICIES } from "@/utils/commonData";
import { isDef, isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "igmpInfoForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    inject: ["validateIp", "validateMac"],
    data() {
        return {
            IGMP_MODES,
            SWITCH,
            IGMP_PROTOCOL_POLICIES,
            form: {
                mode: 0,
                fast_leave: 0,
                protocol_policy: 0,
                group_aging_time: "",
                robustness: "",
                query_src_ip: "",
                query_src_mac: "",
                gen_response_time: "",
                gen_query_interval: "",
                sp_response_time: "",
                sp_query_interval: "",
                sp_query_number: "",
            },
            cacheData: null,
            rules: {
                group_aging_time: [
                    {
                        validator: this.validateAgingTime,
                        trigger: ["change", "blur"],
                    },
                ],
                robustness: [
                    {
                        validator: this.validateRobustness,
                        trigger: ["change", "blur"],
                    },
                ],
                query_src_ip: [
                    {
                        validator: this.validateSrcIp,
                        trigger: ["change", "blur"],
                    },
                ],
                query_src_mac: [
                    {
                        validator: this.validateMac,
                        trigger: ["change", "blur"],
                    },
                ],
                gen_response_time: [
                    {
                        validator: this.validateGenResTime,
                        trigger: ["change", "blur"],
                    },
                ],
                gen_query_interval: [
                    {
                        validator: this.validateGenInterval,
                        trigger: ["change", "blur"],
                    },
                ],
                sp_response_time: [
                    {
                        validator: this.validateSpResTime,
                        trigger: ["change", "blur"],
                    },
                ],
                sp_query_interval: [
                    {
                        validator: this.validateSpInterval,
                        trigger: ["change", "blur"],
                    },
                ],
                sp_query_number: [
                    {
                        validator: this.validateSpNumber,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    methods: {
        init(data) {
            this.$refs["igmp-info-form"].resetFields();
            this.cacheData = JSON.parse(JSON.stringify(data));
            Object.keys(this.form).forEach((key) => {
                if (isDef(data) && isDef(data[key])) {
                    this.form[key] = data[key];
                }
            });
        },
        // mode为disable(0)不显示以下所以信息
        // mode为snooping(1)显示fast_leave、protocol_policy、group_aging_time信息
        // mode为proxy(2)除了group_aging_time不显示，其他信息都显示
        validateAgingTime(ruel, val, cb) {
            if (this.form.mode !== 1) {
                return cb();
            }
            if (!regRange(val, 1, 3000)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 3000)));
            }
            cb();
        },
        validateRobustness(ruel, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!regRange(val, 1, 10)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 10)));
            }
            cb();
        },
        validateGenResTime(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!regRange(val, 1, 25)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 25)));
            }
            cb();
        },
        validateGenInterval(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!regRange(val, 2, 3000)) {
                return cb(new Error(this.validateMsg("inputRange", 2, 3000)));
            }
            cb();
        },
        validateSpResTime(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!regRange(val, 100, 10000)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 100, 10000))
                );
            }
            cb();
        },
        validateSpInterval(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!regRange(val, 100, 10000)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 100, 10000))
                );
            }
            cb();
        },
        validateSpNumber(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!regRange(val, 1, 10)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 10)));
            }
            cb();
        },
        validateSrcIp(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            this.validateIp(rule, val, cb);
        },
        validateSrcMac(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            this.validateMac(rule, val, cb);
        },
        validate(fn) {
            this.$refs["igmp-info-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        let flags = 0;
                        const FLAG_MAP = {
                            protocol_policy: 0x02,
                            fast_leave: 0x04,
                            group_aging_time: 0x08,
                            robustness: 0x10,
                            gen_response_time: 0x20,
                            gen_query_interval: 0x40,
                            query_src_ip: 0x80,
                            query_src_mac: 0x100,
                            sp_query_interval: 0x200,
                            sp_response_time: 0x400,
                            sp_query_number: 0x800,
                        };
                        Object.keys(FLAG_MAP).forEach((key) => {
                            if (this.form[key] !== this.cacheData[key]) {
                                flags |= FLAG_MAP[key];
                            }
                        });
                        fn.call(this, { flags, ...this.form });
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
</style>