<template>
    <el-form
        label-width="120px"
        :model="bound"
        :rules="rules"
        ref="remote-form"
    >
        <el-form-item :label="$lang('interface')" v-if="showInterface">
            <span>{{ row.interface }}</span>
        </el-form-item>
        <el-form-item :label="$lang('type')" prop="type">
            <el-select v-model.number="flag">
                <el-option :value="0" :label="$lang('ipv4')"></el-option>
                <el-option :value="1" :label="$lang('ipv6')"></el-option>
            </el-select>
        </el-form-item>
        <template v-if="flag === 0">
            <el-form-item :label="$lang('ipaddr')" prop="ipaddr" key="ipaddr">
                <el-input v-model="bound.ipaddr"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('ipmask')" prop="ipmask" key="ipmask">
                <el-input v-model="bound.ipmask"></el-input>
            </el-form-item>
        </template>
        <template v-if="flag === 1">
            <el-form-item :label="$lang('ipv6')" prop="ipv6" key="ipv6">
                <el-input v-model="bound.ipv6"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'add'">
            <el-form-item
                :label="$lang('vlan_id')"
                prop="vlan_id"
                key="vlan-id"
            >
                <el-input
                    :disabled="type === 'config'"
                    v-model.number="bound.vlan_id"
                ></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
import { isFunction, isIPv6, isDef } from "@/utils/common";
export default {
    name: "remoteForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        showInterface() {
            return this.row && this.type === "config";
        },
    },
    inject: ["validateIp"],
    data() {
        return {
            flag: 0,
            type: "",
            row: {},
            bound: {
                ipaddr: "",
                ipmask: "",
                vlan_id: "",
                interface: "",
                ipv6: "",
            },
            rules: {
                ipaddr: [
                    {
                        validator: this.validIpv4,
                        trigger: ["change", "blur"],
                    },
                ],
                ipmask: [
                    {
                        validator: this.validIpv4,
                        trigger: ["change", "blur"],
                    },
                ],
                vlan_id: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"],
                    },
                ],
                ipv6: [
                    {
                        validator: this.validIpv6,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    methods: {
        init(row, type) {
            this.type = type;
            this.row = row || {};
            if (row) {
                Object.keys(this.bound).forEach((key) => {
                    if (isDef(row[key])) {
                        this.bound[key] = row[key];
                    }
                });
            }
        },
        validate(fn) {
            this.$refs["remote-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        const flag = this.flag ? "v6" : "v4";
                        return fn.call(this, this.bound, flag);
                    } else {
                        return fn.call(this);
                    }
                }
            });
        },
        resetForm() {
            this.$nextTick(() => {
                this.$refs["remote-form"].resetFields();
            });
        },
        validateVlan(rule, value, cb) {
            if (!regRange(this.bound.vlan_id, 1, 4094)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 4094)));
            }
            cb();
        },
        validIpv4(rule, val, cb) {
            if (this.flag !== 0) {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
        validIpv6(rule, val, cb) {
            if (this.flag !== 1) {
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

<style lang='less' scoped>
</style>