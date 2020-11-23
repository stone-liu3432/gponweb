<template>
    <el-form
        :model="form"
        :rules="rules"
        :label-width="labelWidth"
        ref="dev-mgmt-form"
    >
        <el-form-item :label="$lang('fanid')" prop="fanid">
            <template>{{ form.fanid }}</template>
        </el-form-item>
        <template v-if="type === 'mode'">
            <el-form-item :label="$lang('mode')" prop="mode">
                <el-select v-model.number="form.mode">
                    <template v-for="(item, index) in FAN_MODE_MAP">
                        <el-option
                            :value="index"
                            :label="$lang(item)"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'speed'">
            <el-form-item :label="$lang('fan_speed')" prop="speed">
                <el-input v-model.number="form.speed"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'ap'">
            <el-form-item :label="$lang('temp1')" prop="temp1">
                <el-input v-model.number="form.temp1"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('speed1')" prop="speed1">
                <el-input v-model.number="form.speed1"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('temp2')" prop="temp2">
                <el-input v-model.number="form.temp2"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('speed2')" prop="speed2">
                <el-input v-model.number="form.speed2"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { FAN_MODE_MAP } from "@/utils/commonData";
import { regRange } from "@/utils/validator";
export default {
    name: "devMgmtForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    data() {
        return {
            FAN_MODE_MAP,
            form: {
                fanid: "",
                mode: 2,
                speed: "",
                speed1: "",
                speed2: "",
                temp1: "",
                temp2: "",
            },
            rules: {
                speed: [
                    { validator: this.validSpeed, trigger: ["change", "blur"] },
                ],
                speed1: [
                    { validator: this.validSpeed, trigger: ["change", "blur"] },
                ],
                speed2: [
                    { validator: this.validSpeed, trigger: ["change", "blur"] },
                ],
                temp1: [
                    { validator: this.validTemp, trigger: ["change", "blur"] },
                ],
                temp2: [
                    { validator: this.validTemp, trigger: ["change", "blur"] },
                ],
            },
            type: "",
            labelWidth: "140px",
            row: {},
        };
    },
    methods: {
        init(type, row) {
            this.type = type;
            this.row = row;
            if (type === "ap") {
                this.labelWidth = "300px";
            }
            Object.keys(this.form).forEach((key) => {
                if (isDef(row[key])) {
                    this.form[key] = row[key];
                }
            });
        },
        validSpeed(rule, val, cb) {
            if (!regRange(val, 0, 255)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 255)));
            }
            cb();
        },
        validTemp(rule, val, cb) {
            if (!regRange(val, 0, 100)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 100)));
            }
            cb();
        },
        validate(fn) {
            if (this.type === "ap") {
                const keys = ["speed1", "speed2", "temp1", "temp2"];
                if (keys.every((key) => this.row[key] === this.form[key])) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
            } else {
                if (this.row[this.type] === this.form[this.type]) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
            }
            this.$refs["dev-mgmt-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.type, this.form);
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
</style>