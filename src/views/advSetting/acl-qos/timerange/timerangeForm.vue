<template>
    <el-form :model="form" ref="timerange-form" label-width="150px" :rules="rules">
        <el-form-item :label="$lang('name')" prop="name">
            <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('type')" prop="type">
            <el-select v-model.number="form.type">
                <el-option :label="$lang('relative')" :value="0"></el-option>
                <el-option :label="$lang('absolute')" :value="1"></el-option>
            </el-select>
        </el-form-item>
        <template v-if="form.type === 0">
            <el-form-item :label="$lang('timerange')" prop="timerange">
                <el-time-picker
                    v-model="form.timerange"
                    is-range
                    range-separator=" - "
                    :start-placeholder="$lang('stime')"
                    :end-placeholder="$lang('etime')"
                ></el-time-picker>
            </el-form-item>
            <el-form-item :label="$lang('day')" prop="day">
                <el-select v-model="form.day">
                    <template v-for="item in DAY_MAP">
                        <el-option :value="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="form.type === 1">
            <el-form-item :label="$lang('timerange')" prop="stime">
                <el-date-picker
                    v-model="form.timerange"
                    type="datetimerange"
                    range-separator=" - "
                    :start-placeholder="$lang('stime')"
                    :end-placeholder="$lang('etime')"
                ></el-date-picker>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { DAY_MAP } from "@/utils/commonData";
import { isDef, isFunction, isArray } from "@/utils/common";
export default {
    name: "timerangeForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            DAY_MAP,
            form: {
                name: "",
                type: 0,
                day: "Daily",
                timerange: ""
            },
            rules: {
                name: [
                    {
                        validator: this.validateName,
                        trigger: ["change", "blur"]
                    }
                ],
                timerange: [
                    {
                        validator: this.validateTimerange,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init() {
            this.$refs["timerange-form"].resetFields();
        },
        validateName(rule, val, cb) {
            const reg = /^[a-zA-Z]\w{3,15}$/;
            if (!reg.test(val)) {
                return cb(new Error(this.validateMsg("inputLength", 4, 16)));
            }
            cb();
        },
        validateTimerange(rule, val, cb) {
            if (!this.form.timerange) {
                return cb(new Error(this.$lang("required")));
            }
            cb();
        },
        validate(fn) {
            this.$refs["timerange-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        }
    },
    watch: {
        "form.type"() {}
    }
};
</script>

<style lang="less" scoped>
</style>