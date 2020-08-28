<template>
    <el-form :model="form" ref="sys-port-form" label-width="120px" :rules="rules">
        <el-form-item label="http" prop="http">
            <el-input v-model.number="form.http"></el-input>
        </el-form-item>
        <el-form-item label="https" prop="https">
            <el-input v-model.number="form.https"></el-input>
        </el-form-item>
        <el-form-item label="telnet" prop="telnet">
            <el-input v-model.number="form.telnet"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
export default {
    name: "sysPortForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            form: {
                http: "",
                https: "",
                telnet: ""
            },
            rules: {
                http: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ],
                https: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ],
                telnet: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init(row) {
            this.$refs["sys-port-form"].resetFields();
            Object.keys(this.form).forEach(key => {
                this.form[key] = row[key];
            });
        },
        validate(fn) {
            this.$refs["sys-port-form"].validate(valid => {
                if (valid) {
                    fn.call(this, this.form);
                } else {
                    fn.call(this, valid);
                }
            });
        },
        validatePort(rule, val, cb) {
            if (!regRange(val, 1, 65535)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 65535)));
            }
            cb();
        }
    }
};
</script>

<style lang="less" scoped>
</style>