<template>
    <el-form :model="formData" label-width="140px" :rules="rules" ref="dba-form">
        <el-form-item :label="$lang('profname')" prop="profname">
            <el-input v-model="formData.profname"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('profid')" prop="profid">
            <el-input v-model.number="formData.profid"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('type')" prop="type">
            <el-select v-model.number="formData.type">
                <template v-for="i in 5">
                    <el-option :label="`type${i}`" :value="i"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('fix')" prop="fix">
            <el-input v-model.number="formData.fix" :disabled="disabledItem('fix')"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('assure')" prop="assure">
            <el-input v-model.number="formData.assure" :disabled="disabledItem('assure')"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('max')" prop="max">
            <el-input v-model.number="formData.max" :disabled="disabledItem('max')"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { isFunction } from "@/utils/common";
import { regLength, regRange } from "@/utils/validator";
import { DBA_PROFILE_TYPES } from "@/utils/commonData";
export default {
    name: "dbaForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    props: {
        type: {
            type: String
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
            formData: {
                profname: "", // 1-32
                profid: "", // 10-512
                type: 1,
                fix: "", // 128-1000000
                assure: "",
                max: ""
            },
            rules: {
                profname: [
                    {
                        validator: this.validProfname,
                        trigger: ["change", "blur"]
                    }
                ],
                profid: [
                    { validator: this.validProfid, trigger: ["change", "blur"] }
                ],
                fix: [
                    { validator: this.validFix, trigger: ["change", "blur"] }
                ],
                assure: [
                    { validator: this.validAssure, trigger: ["change", "blur"] }
                ],
                max: [{ validator: this.validMax, trigger: ["change", "blur"] }]
            }
        };
    },
    methods: {
        init() {
            this.$refs["dba-form"].resetFields();
            if (this.type === "set") {
                Object.keys(this.formData).forEach(key => {
                    this.formData[key] = this.data[key];
                });
            }
        },
        validate(fn) {
            this.$refs["dba-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        return fn.call(this, this.formData);
                    }
                    return fn.call(this, valid);
                }
            });
        },
        validProfname(rule, val, cb) {
            if (!regLength(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 32)));
            }
            cb();
        },
        validProfid(rule, val, cb) {
            if (!regRange(val, 10, 512)) {
                return cb(new Error(this.validateMsg("inputRange", 10, 512)));
            }
            cb();
        },
        validFix(rule, val, cb) {
            if (this.formData.type !== 1 && this.formData.fix !== 5) {
                return cb();
            }
            return this.validRange(val, cb);
        },
        validAssure(rule, val, cb) {
            if (this.formData.type === 1 || this.formData.type === 4) {
                return cb();
            }
            return this.validRange(val, cb);
        },
        validMax(rule, val, cb) {
            if (this.formData.type === 1 || this.formData.type === 2) {
                return cb();
            }
            return this.validRange(val, cb);
        },
        validRange(val, cb) {
            if (!regRange(val, 128, 1000000)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 128, 1000000))
                );
            }
            cb();
        },
        disabledItem(key) {
            const type = this.formData.type;
            return DBA_PROFILE_TYPES[type].includes(key) ? false : true;
        }
    },
    watch: {
        "formData.type"() {
            this.$refs["dba-form"].clearValidate(["fix", "assure", "max"]);
        }
    }
};
</script>

<style lang="less" scoped>
</style>