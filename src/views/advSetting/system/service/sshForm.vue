<template>
    <el-form label-width="80px" :model="formData" :rules="rules" ref="ssh-key-form">
        <el-form-item :label="$lang('title')" prop="keyname">
            <el-input v-model="formData.keyname" placeholder="Enter a name to ensure clear use"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('key')" prop="publickey">
            <el-input
                type="textarea"
                placeholder="Begins with 'ssh-rsa', 'ssh-dss', 'ssh-ed25519', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', or 'ecdsa-sha2-nistp521'"
                v-model="formData.publickey"
            ></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regLength } from "@/utils/validator";
import { isFunction } from "@/utils/common";
export default {
    name: "sshForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            formData: {
                keyname: "",
                publickey: ""
            },
            rules: {
                keyname: [
                    {
                        validator: this.validateName,
                        trigger: ["change", "blur"]
                    }
                ],
                publickey: [
                    { validator: this.validateKey, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    methods: {
        init() {
            this.$refs["ssh-key-form"].resetFields();
        },
        validate(fn) {
            const cb = this.$refs["ssh-key-form"].validate;
            if (isFunction(fn)) {
                cb(valid => {
                    if (valid) {
                        fn.call(this, this.formData);
                    } else {
                        fn.call(this, valid);
                    }
                });
            } else {
                return cb();
            }
        },
        validateName(rule, val, cb) {
            if (!regLength(val, 4, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 4, 32)));
            }
            cb();
        },
        validateKey(rule, val, cb) {
            if (!regLength(val, 1, 512)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 512)));
            }
            cb();
        }
    }
};
</script>

<style lang='less' scoped>
</style>