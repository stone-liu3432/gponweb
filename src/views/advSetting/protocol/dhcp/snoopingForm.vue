<template>
    <el-form label-width="150px" ref="dhcp-snooping-form" :model="form" :rules="rules">
        <template v-if="type === 'response_time'">
            <el-form-item :label="$lang('response_time')" prop="response_time" key="response_time">
                <el-input v-model.number="form.response_time"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'add_port' || type === 'delete_port'">
            <el-form-item
                :label="$lang('trust_portlist')"
                prop="trust_portlist"
                key="trust_portlist"
            >
                <el-checkbox-group v-model="form.trust_portlist">
                    <template v-for="item in port">
                        <!-- uplink -->
                        <template v-if="item.port_id > system.ponports">
                            <el-checkbox
                                :label="item.port_id"
                                :disabled="disabledItem(item)"
                            >{{ getPortName(item.port_id) }}</el-checkbox>
                        </template>
                    </template>
                </el-checkbox-group>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isFunction, parseStringAsList } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "dhcpSnoopingForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["port", "system"])
    },
    data() {
        return {
            form: {
                response_time: "",
                trust_portlist: []
            },
            rules: {
                response_time: [
                    {
                        validator: this.validateResTime,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            portlist: [],
            type: ""
        };
    },
    methods: {
        init(type, data) {
            this.$refs["dhcp-snooping-form"].resetFields();
            this.type = type;
            this.form.response_time = data.response_time;
            const plist = parseStringAsList(data.trust_portlist);
            this.form.trust_portlist = plist;
            this.portlist = plist.slice(0);
        },
        validateResTime(rule, val, cb) {
            if (!regRange(val, 3, 3600)) {
                return cb(new Error(this.validateMsg("inputRange", 3, 3600)));
            }
            cb();
        },
        disabledItem(item) {
            if (this.type === "add_port") {
                return this.portlist.includes(item.port_id);
            }
            return !this.portlist.includes(item.port_id);
        },
        validate(fn) {
            this.$refs["dhcp-snooping-form"].validate(valid => {
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