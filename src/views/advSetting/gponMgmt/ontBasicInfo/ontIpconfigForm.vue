<template>
    <el-form
        :model="form"
        :rules="rules"
        ref="ont-ipconfig-form"
        label-width="140px"
    >
        <el-form-item :label="$lang('ipoption')" prop="ipoption">
            <el-select v-model.number="form.ipoption">
                <el-option
                    :value="1"
                    :label="$lang('static') + ' IP'"
                ></el-option>
                <el-option :value="2" label="DHCP"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('vlan_id')" prop="vlan_id">
            <el-input v-model.number="form.vlan_id"></el-input>
        </el-form-item>
        <template v-if="form.ipoption === 1">
            <el-form-item :label="$lang('ipaddr')" prop="ipaddr">
                <el-input v-model="form.ipaddr"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('ipmask')" prop="ipmask">
                <el-input v-model="form.ipmask"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('gateway')" prop="gateway">
                <el-input v-model="form.gateway"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('primary')" prop="primary">
                <el-input v-model="form.primary"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('secondary')" prop="secondary">
                <el-input v-model="form.secondary"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
import { isDef, isFunction } from "@/utils/common";
export default {
    name: "ontIpconfigForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    data() {
        return {
            type: "",
            form: {
                index: "",
                ipoption: 1,
                vlan_id: "",
                ipaddr: "",
                ipmask: "",
                gateway: "",
                primary: "",
                secondary: "",
            },
            rules: {
                vlan_id: [
                    { validator: this.validVlan, trigger: ["change", "blur"] },
                ],
                ipaddr: [
                    {
                        validator: this.validIpaddr,
                        trigger: ["change", "blur"],
                    },
                ],
                ipmask: [
                    {
                        validator: this.validIpaddr,
                        trigger: ["change", "blur"],
                    },
                ],
                gateway: [
                    {
                        validator: this.validIpaddr,
                        trigger: ["change", "blur"],
                    },
                ],
                primary: [
                    {
                        validator: this.validIpaddr,
                        trigger: ["change", "blur"],
                    },
                ],
                secondary: [
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
        init(type, row) {
            this.$refs["ont-ipconfig-form"].resetFields();
            this.type = type;
            if (row) {
                Object.keys(this.form).forEach((key) => {
                    if (isDef(row[key])) {
                        this.form[key] = row[key];
                    }
                });
            }
        },
        validVlan(rule, val, cb) {
            if (!regRange(val, 0, 4094)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 4094)));
            }
            cb();
        },
        validIpaddr(rule, val, cb) {
            if (this.form.ipoption === 2) {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
        validate(fn) {
            this.$refs["ont-ipconfig-form"].validate((valid) => {
                if (isFunction) {
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