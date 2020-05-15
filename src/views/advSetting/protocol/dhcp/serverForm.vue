<template>
    <el-form ref="dhcp-server-form" label-width="180px" :model="form" :rules="rules">
        <template v-if="type === 'interface'">
            <el-form-item :label="$lang('interface')" prop="interface" key="interface">
                <el-select v-model.number="form.interface">
                    <template v-for="item in interfaces.slice(1)">
                        <el-option :label="item.interface" :value="item.vlan_id"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'info'">
            <el-form-item :label="$lang('ipaddress_s')" prop="ipaddress_s">
                <el-input v-model.trim="form.ipaddress_s"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('ipaddress_e')" prop="ipaddress_e">
                <el-input v-model.trim="form.ipaddress_e"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('ipmask')" prop="ipmask">
                <el-input v-model.trim="form.ipmask"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('pridns')" prop="pridns">
                <el-input v-model.trim="form.pridns"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('secdns')" prop="secdns">
                <el-input v-model.trim="form.secdns"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('gateway')" prop="gateway">
                <el-input v-model.trim="form.gateway"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('lease_time')" prop="lease_time">
                <el-input v-model.number="form.lease_time"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "dhcpServerForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["interfaces"])
    },
    data() {
        return {
            type: "",
            form: {
                ipaddress_s: "",
                ipaddress_e: "",
                ipmask: "",
                interface: "",
                pridns: "",
                secdns: "",
                gateway: "",
                lease_time: ""
            },
            cacheData: {},
            rules: {
                ipaddress_s: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                ipaddress_e: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                ipmask: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                pridns: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                secdns: [
                    {
                        validator: this.validateSecdns,
                        trigger: ["change", "blur"]
                    }
                ],
                gateway: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                lease_time: [
                    {
                        validator: this.validateLeaseTime,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    inject: ["validateIp"],
    methods: {
        init(type, data) {
            this.type = type;
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                }
            });
            if (type === "info") {
                this.cacheData = JSON.parse(JSON.stringify(data));
            }
        },
        validateLeaseTime(rule, val, cb) {
            if (!regRange(val, 60, 864000)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 60, 864000))
                );
            }
            cb();
        },
        validateSecdns(rule, val, cb) {
            if (this.form.secdns === "") {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
        validate(fn) {
            this.$refs["dhcp-server-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        const FLAGS = {
                            ipaddress_s: 0x01,
                            ipaddress_e: 0x01,
                            ipmask: 0x02,
                            pridns: 0x08,
                            secdns: 0x08,
                            gateway: 0x10,
                            lease_time: 0x20
                        };
                        const flags = Object.keys(FLAGS).reduce((pre, key) => {
                            if (this.form[key] !== this.cacheData[key]) {
                                //  ipaddress_s   ipaddress_e
                                if ((pre & FLAGS[key]) !== FLAGS[key]) {
                                    pre |= FLAGS[key];
                                }
                            }
                            return pre;
                        }, 0);
                        fn.call(this, this.type, { ...this.form, flags });
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>