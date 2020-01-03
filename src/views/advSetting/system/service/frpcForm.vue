<template>
    <el-form label-width="150px" :model="formData" :rules="rules" ref="service-frpc-form">
        <el-form-item label="Server Addr" prop="server_addr">
            <el-input v-model="formData.server_addr"></el-input>
        </el-form-item>
        <el-form-item label="Server Port" prop="server_port">
            <el-input v-model.number="formData.server_port"></el-input>
        </el-form-item>
        <el-form-item label="Appname" prop="appname">
            <el-input v-model="formData.appname"></el-input>
        </el-form-item>
        <el-form-item label="Type">
            <el-select v-model.number="formData.type">
                <el-option :value="0" label="http"></el-option>
                <el-option :value="1" label="https"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Remote Port" prop="remote_port">
            <el-input v-model.number="formData.remote_port"></el-input>
        </el-form-item>
        <el-form-item label="Custom Domains" prop="custom_domains">
            <el-input v-model="formData.custom_domains"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { regRange, regName, regLength } from "@/utils/validator";
export default {
    name: "frpcForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    props: {
        frpc: {
            type: Object
        }
    },
    inject: ["validateIp"],
    data() {
        return {
            formData: {
                server_addr: "",
                server_port: "",
                appname: "",
                type: 0,
                remote_port: "",
                custom_domains: ""
            },
            rules: {
                server_addr: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                server_port: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ],
                appname: [
                    {
                        validator: this.validateName,
                        trigger: ["change", "blur"]
                    }
                ],
                remote_port: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ],
                custom_domains: [
                    {
                        validator: this.validateDomain,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init() {
            Object.keys(this.formData).forEach(key => {
                if (isDef(this.frpc[key])) {
                    this.formData[key] = this.frpc[key];
                }
            });
        },
        validateName(rule, val, cb) {
            if (!regName(val)) {
                return cb(
                    new Error(
                        `${this.validateMsg(
                            "inputLength",
                            4,
                            32
                        )}, ${this.$lang("no_allow_special")}`
                    )
                );
            }
            cb();
        },
        validatePort(rule, val, cb) {
            if (!regRange(val, 1, 65535)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 65535)));
            }
            cb();
        },
        validateDomain(rule, val, cb) {
            if (!regLength(val, 4, 64)) {
                return cb(new Error(this.validateMsg("inputLength", 4, 64)));
            }
            cb();
        },
        validate(fn) {
            const cb = this.$refs["service-frpc-form"].validate;
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
        }
    }
};
</script>

<style lang='less' scoped>
</style>