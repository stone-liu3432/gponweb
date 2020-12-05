<template>
    <el-form :model="form" :rules="rules" label-width="140px" ref="deny-form">
        <el-form-item :label="$lang('ont_sn')" prop="ont_sn">
            <el-input v-model="form.ont_sn"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('reason')" prop="reason">
            <el-input v-model="form.reason"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regLength } from "@/utils/validator";
import { isFunction } from "@/utils/common";
export default {
    name: "denyForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    data() {
        return {
            form: {
                ont_sn: "",
                reason: "",
            },
            rules: {
                ont_sn: [
                    { validator: this.validSn, trigger: ["change", "blur"] },
                ],
                reason: [
                    {
                        validator: this.validReason,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    methods: {
        init() {},
        validSn(rule, val, cb) {
            if (val.length !== 12 && val.length !== 16) {
                return cb(new Error("Invalid SN"));
            }
            cb();
        },
        validReason(rule, val, cb) {
            if (!regLength(val, 0, 128)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 128)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["deny-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
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