<template>
    <el-form
        :model="form"
        ref="sys-port-form"
        label-width="120px"
        :rules="rules"
    >
        <template v-if="type === 'sysport'">
            <el-form-item label="http" prop="http">
                <el-input v-model.number="form.http"></el-input>
            </el-form-item>
            <el-form-item label="https" prop="https">
                <el-input v-model.number="form.https"></el-input>
            </el-form-item>
            <el-form-item label="telnet" prop="telnet">
                <el-input v-model.number="form.telnet"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'syslog'">
            <el-form-item :label="$lang('ipaddr')" prop="ipaddr">
                <el-input v-model="form.ipaddr"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
export default {
    name: "sysPortForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    data() {
        return {
            type: "",
            form: {
                http: "",
                https: "",
                telnet: "",
                ipaddr: "",
            },
            rules: {
                http: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"],
                    },
                ],
                https: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"],
                    },
                ],
                telnet: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"],
                    },
                ],
                ipaddr: [
                    {
                        validator: this.validIpaddr,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    inject: ["validateIp"],
    methods: {
        init(row, type) {
            this.type = type;
            this.$refs["sys-port-form"].resetFields();
            Object.keys(this.form).forEach((key) => {
                this.form[key] = row[key];
            });
        },
        validate(fn) {
            this.$refs["sys-port-form"].validate((valid) => {
                if (valid) {
                    fn.call(this, this.form, this.type);
                } else {
                    fn.call(this, valid);
                }
            });
        },
        validatePort(rule, val, cb) {
            if (this.type === "syslog") {
                return cb();
            }
            const field = rule.field,
                min = field === "http" ? 80 : field === "https" ? 443 : 1000;
            if (field === "telnet" && val === 23) {
                return cb();
            }
            if (!regRange(val, min, 50000)) {
                return cb(
                    new Error(
                        this.validateMsg("inputRange", min, 50000) +
                            (field === "telnet" ? ", 23" : "")
                    )
                );
            }
            cb();
        },
        validIpaddr(rule, val, cb) {
            if (this.type !== "syslog") {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
    },
};
</script>

<style lang="less" scoped>
</style>