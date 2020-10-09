<template>
    <el-form
        label-width="150px"
        :model="form"
        :rules="rules"
        ref="rstp-bridge-form"
    >
        <el-form-item :label="$lang('status')">
            <el-select v-model.number="form.status">
                <el-option :value="0" :label="$lang('disable')"></el-option>
                <el-option :value="1" :label="$lang('enable')"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('rstp_mode')">
            <el-select v-model.number="form.rstp_mode">
                <template v-for="(item, key) in modes">
                    <el-option :value="Number(key)" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('rb_priority')">
            <el-select v-model.number="form.rb_priority">
                <template v-for="item in pris">
                    <el-option :value="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('max_age')" prop="max_age">
            <el-input v-model.number="form.max_age"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('hello_time')" prop="hello_time">
            <el-input v-model.number="form.hello_time"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('forward_delay')" prop="forward_delay">
            <el-input v-model.number="form.forward_delay"></el-input>
        </el-form-item>
        <el-form-item
            :label="$lang('transmit_hold_count')"
            prop="transmit_hold_count"
        >
            <el-input v-model.number="form.transmit_hold_count"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
export default {
    name: "bridgeForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            modes: { 0: "stp", 2: "rstp" /*, 3: "mstp" */ },
            pris: [
                0,
                4096,
                8192,
                12288,
                16384,
                20480,
                24576,
                28672,
                32768,
                36864,
                40960,
                45056,
                49152,
                53248,
                57344,
                61440
            ],
            form: {
                status: 0,
                rstp_mode: 0,
                rb_priority: 0,
                max_age: "",
                hello_time: "",
                forward_delay: "",
                transmit_hold_count: ""
            },
            rules: {
                max_age: [
                    {
                        validator: this.validateMaxAge,
                        trigger: ["change", "blur"]
                    }
                ],
                hello_time: [
                    {
                        validator: this.validateHelloTime,
                        trigger: ["change", "blur"]
                    }
                ],
                forward_delay: [
                    {
                        validator: this.validateForwardDelay,
                        trigger: ["change", "blur"]
                    }
                ],
                transmit_hold_count: [
                    {
                        validator: this.validateTransmitHoldCount,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        validateMaxAge(rule, val, cb) {
            const v = Number(val);
            if (v < 6 || v > 40) {
                return cb(new Error(this.validateMsg("inputRange", 6, 40)));
            }
            cb();
        },
        validateHelloTime(rule, val, cb) {
            const v = Number(val);
            if (v < 1 || v > 10) {
                return cb(new Error(this.validateMsg("inputRange", 1, 10)));
            }
            cb();
        },
        validateForwardDelay(rule, val, cb) {
            const v = Number(val);
            if (v < 4 || v > 30) {
                return cb(new Error(this.validateMsg("inputRange", 4, 30)));
            }
            cb();
        },
        validateTransmitHoldCount(rule, val, cb) {
            const v = Number(val);
            if (v < 1 || v > 255) {
                return cb(new Error(this.validateMsg("inputRange", 1, 255)));
            }
            cb();
        },
        init() {
            Object.keys(this.form).forEach(key => {
                if (isDef(this.formData[key])) {
                    this.form[key] = this.formData[key];
                }
            });
        },
        validate(fn) {
            const cb = this.$refs["rstp-bridge-form"].validate;
            if (isFunction(fn)) {
                cb(valid => {
                    if (valid) {
                        return fn.call(this, this.form);
                    }
                    return fn.call(this, valid);
                });
            } else {
                return cb();
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>