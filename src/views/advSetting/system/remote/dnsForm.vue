<template>
    <el-form :model="form" :rules="rules" ref="dns-form" label-width="160px">
        <template v-if="type === 'v4'">
            <el-form-item :label="$lang('primary')" prop="primary">
                <el-input v-model="form.primary"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('secondary')" prop="secondary">
                <el-input v-model="form.secondary"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'v6'">
            <el-form-item :label="$lang('primary_v6')" prop="primary_v6">
                <el-input v-model="form.primary_v6"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('secondary_v6')" prop="secondary_v6">
                <el-input v-model="form.secondary_v6"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'add_v6' || type === 'delete_v6'">
            <el-form-item :label="$lang('interface')">
                {{ this.form.interface }}
            </el-form-item>
            <template v-if="type === 'add_v6'">
                <el-form-item :label="$lang('ipv6')" prop="ipv6">
                    <el-input v-model="form.ipv6"></el-input>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item :label="$lang('ipv6')" prop="ipv6">
                    <el-select v-model="form.ipv6" style="width: 360px">
                        <template v-for="item in ipv6s">
                            <el-option :value="item.ipv6"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isIPv6 } from "@/utils/common";
export default {
    name: "dnsForm",
    computed: {
        ...mapGetters(["$lang"]),
    },
    inject: ["validateIp"],
    data() {
        return {
            type: "",
            ipv6s: [],
            form: {
                primary: "",
                secondary: "",
                primary_v6: "",
                secondary_v6: "",
                ipv6: "",
                interface: "",
                vlan_id: 0,
            },
            rules: {
                primary: [
                    {
                        validator: this.validateDns,
                        trigger: ["change", "blur"],
                    },
                ],
                secondary: [
                    {
                        validator: this.validateDns,
                        trigger: ["change", "blur"],
                    },
                ],

                primary_v6: [
                    {
                        validator: this.validateIpv6,
                        trigger: ["change", "blur"],
                    },
                ],
                secondary_v6: [
                    {
                        validator: this.validateIpv6,
                        trigger: ["change", "blur"],
                    },
                ],
                ipv6: [
                    {
                        validator: this.validateIpv6,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    methods: {
        init(row, type) {
            this.type = type;
            this.$refs["dns-form"].resetFields();
            Object.keys(this.form).forEach((key) => {
                this.form[key] = row[key];
            });
            if (type === "add_v6") {
                this.form.ipv6 = "";
            } else if (type === "delete_v6") {
                this.ipv6s = row.ipv6_address;
                this.form.ipv6 = row.ipv6_address[0].ipv6;
            }
        },
        validateDns(rule, val, cb) {
            if (val === "" || val === "0.0.0.0" || this.type === "v6") {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
        validate(fn) {
            this.$refs["dns-form"].validate((valid) => {
                if (valid) {
                    fn.call(this, this.form, this.type);
                } else {
                    fn.call(this, valid);
                }
            });
        },
        validateIpv6(rule, val, cb) {
            if (val === "" || this.type === "v4") {
                return cb();
            }
            if (!isIPv6(val)) {
                return cb(new Error(""));
            }
            cb();
        },
    },
};
</script>

<style lang="less" scoped>
</style>