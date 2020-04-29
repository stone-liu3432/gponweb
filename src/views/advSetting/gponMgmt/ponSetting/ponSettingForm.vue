<template>
    <el-form :model="form" :rules="rules" label-width="185px" ref="pon-setting-form">
        <template v-if="type === 'time' || type === 'interval'">
            <el-form-item :label="$lang('af_aging_time')" prop="af_aging_time" key="af_aging_time">
                <el-input v-model.number="form.af_aging_time"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('af_interval')" prop="af_interval" key="af_interval">
                <el-input v-model.number="form.af_interval"></el-input>
            </el-form-item>
        </template>
        <template v-else>
            <el-form-item :label="$lang('auth_type')" prop="auth_type" key="auth_type">
                <el-select v-model.number="form.auth_type">
                    <el-option :value="0" label="Manual"></el-option>
                    <el-option :value="1" label="Auto"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="form.auth_type === 1">
                <el-form-item :label="$lang('lineprof_id')" prop="lineprof_id" key="lineprof_id">
                    <el-select v-model.number="form.lineprof_id">
                        <template v-for="item in lineProfs">
                            <el-option :value="item.profid" :label="item.profname"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$lang('srvprof_id')" prop="srvprof_id" key="srvprof_id">
                    <el-select v-model.number="form.srvprof_id">
                        <template v-for="item in srvProfs">
                            <el-option :value="item.profid" :label="item.profname"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "ponSettingForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["lineProfs", "srvProfs"])
    },
    data() {
        return {
            form: {
                auth_type: 0,
                lineprof_id: 0,
                srvprof_id: 0,
                af_aging_time: "",
                af_interval: ""
            },
            rules: {
                af_aging_time: [
                    {
                        validator: this.validateTime,
                        trigger: ["change", "blur"]
                    }
                ],
                af_interval: [
                    {
                        validator: this.validateInterval,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            type: "",
            cacheData: null
        };
    },
    methods: {
        init(type, data) {
            this.$refs["pon-setting-form"].resetFields();
            this.type = type;
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                }
            });
        },
        validateTime(rule, val, cb) {
            if (this.type === "auth") {
                return cb();
            }
            if (val === 0) {
                return cb();
            }
            if (!regRange(val, 100, 300)) {
                return cb(new Error(this.validateMsg("inputRange", 100, 300)));
            }
            cb();
        },
        validateInterval(rule, val, cb) {
            if (this.type === "auth") {
                return cb();
            }
            if (!regRange(val, 2, 10)) {
                return cb(new Error(this.validateMsg("inputRange", 2, 10)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["pon-setting-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        return fn.call(this, this.type, this.form);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>