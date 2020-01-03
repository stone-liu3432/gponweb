<template>
    <el-form label-width="140px" :model="formData" :rules="rules" ref="service-snmp-form">
        <template v-if="type === 'trap'">
            <el-form-item label="Server IP" prop="serverip">
                <el-input v-model="formData.serverip"></el-input>
            </el-form-item>
            <el-form-item label="Trap Port" prop="trap_port">
                <el-input v-model.number="formData.trap_port"></el-input>
            </el-form-item>
            <el-form-item label="Trap Community" prop="trap_community">
                <el-input v-model="formData.trap_community"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'community'">
            <el-form-item label="Community">
                <el-checkbox-group v-model="formData.flag">
                    <el-checkbox :label="1">Read Community</el-checkbox>
                    <el-checkbox :label="2">Write Community</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="Read Community" prop="read_community">
                <el-input v-model="formData.read_community"></el-input>
            </el-form-item>
            <el-form-item label="Write Community" prop="write_community">
                <el-input v-model="formData.write_community"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { regIp, regRange, regLength } from "@/utils/validator";
export default {
    name: "snmpForm",
    props: {
        type: {
            type: String
        },
        baseData: {
            type: Object
        }
    },
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            formData: {
                serverip: "",
                trap_port: "",
                trap_community: "",
                flag: [],
                read_community: "",
                write_community: ""
            },
            rules: {
                serverip: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                trap_port: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ],
                trap_community: [
                    {
                        validator: this.validateTrap,
                        trigger: ["change", "blur"]
                    }
                ],
                read_community: [
                    {
                        validator: this.validateCommunity,
                        trigger: ["change", "blur"]
                    }
                ],
                write_community: [
                    {
                        validator: this.validateCommunity,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init() {
            Object.keys(this.formData).forEach(key => {
                if (isDef(this.baseData[key])) {
                    this.formData[key] = this.baseData[key];
                }
            });
            this.formData.flag = [];
        },
        validateIp(rule, val, cb) {
            if (this.type !== "trap") {
                return cb();
            }
            if (!regIp(val)) {
                return cb(new Error(this.validateMsg("ipaddr")));
            }
            cb();
        },
        validatePort(rule, val, cb) {
            if (this.type !== "trap") {
                return cb();
            }
            if (!regRange(val, 1, 65535)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 65535)));
            }
            cb();
        },
        validateTrap(rule, val, cb) {
            if (this.type !== "trap") {
                return cb();
            }
            if (!regLength(val, 0, 16)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 16)));
            }
            cb();
        },
        validateCommunity(rule, val, cb) {
            if (this.type !== "community") {
                return cb();
            }
            if (!regLength(val, 0, 16)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 16)));
            }
            cb();
        },
        validate(fn) {
            const cb = this.$refs["service-snmp-form"].validate;
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

<style lang="less" scoped>
</style>