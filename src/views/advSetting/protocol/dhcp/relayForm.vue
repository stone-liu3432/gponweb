<template>
    <el-form label-width="180px" ref="dhcp-relay-form" :model="form" :rules="rules">
        <template v-if="type === 'set'">
            <el-form-item :label="$lang('relay_policy')" prop="relay_policy" key="relay_policy">
                <el-select v-model="form.relay_policy">
                    <template v-for="(item, index) in RELAY_POLICY">
                        <el-option :label="item" :value="index"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'add'">
            <template v-if="cacheData.relay_policy === 0">
                <el-form-item :label="$lang('vlan_id')" prop="vlan_id" key="vlan_id">
                    <el-input v-model.number="form.vlan_id"></el-input>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item :label="$lang('option60')" prop="option60" key="option60">
                    <el-input v-model.trim="form.option60"></el-input>
                </el-form-item>
            </template>
            <el-form-item :label="$lang('server_ip')" prop="server_ip" key="server_ip">
                <el-input v-model.trim="form.server_ip"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { RELAY_POLICY } from "@/utils/commonData";
import { regLength } from "@/utils/validator";
import { isFunction } from "@/utils/common";
export default {
    name: "dhcpRelayForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    inject: ["validateIp", "validateVlan"],
    data() {
        return {
            RELAY_POLICY,
            type: "",
            cacheData: {},
            form: {
                relay_policy: 0,
                vlan_id: "",
                option60: "",
                server_ip: ""
            },
            rules: {
                vlan_id: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                option60: [
                    {
                        validator: this.validateOption60,
                        trigger: ["change", "blur"]
                    }
                ],
                server_ip: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    methods: {
        init(type, data) {
            this.$refs["dhcp-relay-form"].resetFields();
            this.type = type;
            this.cacheData = JSON.parse(JSON.stringify(data));
            if (type === "set") {
                this.form.relay_policy = data.relay_policy;
            }
        },
        validateOption60(rule, val, cb) {
            if (!regLength(val, 1, 64)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 64)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["dhcp-relay-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.type, this.form);
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