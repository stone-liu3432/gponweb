<template>
    <el-form label-width="200px" :model="formData" :rules="rules" ref="port-config-form">
        <template v-if="type === 'sw_port_cfg'">
            <el-form-item :label="$lang('admin_status')" prop="admin_status" key="admin-status">
                <el-select
                    v-model.number="formData.admin_status"
                    :disabled="disabled('admin_status',data.port_id)"
                >
                    <el-option :label="$lang('disable')" :value="0"></el-option>
                    <el-option :label="$lang('enable')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('link_status')" prop="link_status" key="link-status">
                <el-select v-model.number="formData.link_status" disabled>
                    <el-option :label="$lang('link_down')" :value="0"></el-option>
                    <el-option :label="$lang('link_up')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('auto_neg')" prop="auto_neg" key="auto-neg">
                <el-select
                    v-model.number="formData.auto_neg"
                    :disabled="disabled('auto_neg', data.port_id)"
                >
                    <el-option :label="$lang('disable')" :value="0"></el-option>
                    <el-option :label="$lang('enable')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('speed')" prop="speed" key="speed">
                <el-select v-model="formData.speed" :disabled="disabled('speed',data.port_id)">
                    <el-option value="10M"></el-option>
                    <el-option value="100M"></el-option>
                    <el-option value="1000M"></el-option>
                    <el-option value="10000M"></el-option>
                    <el-option value="auto" label="Auto"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('duplex')" prop="duplex" key="duplex">
                <el-select
                    v-model.number="formData.duplex"
                    :disabled="disabled('duplex',data.port_id)"
                >
                    <el-option :label="$lang('half')" :value="0"></el-option>
                    <el-option :label="$lang('full')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('flow_ctrl')" prop="flow_ctrl" key="flow-ctrl">
                <el-select v-model.number="formData.flow_ctrl">
                    <el-option :label="$lang('disable')" :value="0"></el-option>
                    <el-option :label="$lang('enable')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('mtu')" prop="mtu" key="mtu">
                <el-input v-model="formData.mtu" style="width: 200px;"></el-input>
            </el-form-item>
            <template v-if="data.port_id > system.ponports">
                <el-form-item :label="$lang('erate')" prop="erate" key="erate">
                    <el-input v-model="formData.erate" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('irate')" prop="irate" key="irate">
                    <el-input v-model="formData.irate" style="width: 200px;"></el-input>
                </el-form-item>
            </template>
            <el-form-item :label="$lang('pvid')" prop="pvid" key="pvid">
                <el-input v-model="formData.pvid" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('port_desc')" prop="port_desc" key="port-desc">
                <el-input type="textarea" v-model.trim="formData.port_desc"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'stormctrl'">
            <el-form-item :label="$lang('broadcast')" prop="broadcast" key="broadcast">
                <el-input v-model="formData.broadcast" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('multicast')" prop="multicast" key="multicast">
                <el-input v-model="formData.multicast" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('unicast')" prop="unicast" key="unicast">
                <el-input v-model="formData.unicast" style="width: 200px;"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'mirror'">
            <el-form-item :label="$lang('dst_port')" prop="dst_port" key="dst-port">
                <el-select v-model="formData.dst_port">
                    <el-option label=" - " :value="0"></el-option>
                    <template v-for="item in port">
                        <template v-if="item.port_id > system.ponports && port_id !== item.port_id">
                            <el-option
                                :label="getPortName(item.port_id)"
                                :value="item.port_id"
                                :disabled="item.port_id === data.src_port"
                            ></el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('type')" prop="type" key="type">
                <el-select v-model="formData.type">
                    <template v-for="(item, index) in types">
                        <el-option :label="item" :value="index"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { regRange, regLength } from "@/utils/validator";
import { isFunction, isDef, toLower } from "@/utils/common";
export default {
    name: "portConfigForm",
    computed: {
        ...mapState(["port", "system"]),
        ...mapGetters(["$lang", "validateMsg", "getPortName"])
    },
    props: {
        type: {
            type: String
        },
        data: {
            type: Object
        },
        port_id: {
            type: Number
        }
    },
    data() {
        return {
            types: [" - ", "ingress", "egress", "all"],
            formData: {
                admin_status: 1,
                link_status: 1,
                auto_neg: 1,
                speed: "",
                duplex: 1,
                flow_ctrl: 1,
                mtu: "",
                media: "",
                erate: "",
                irate: "",
                pvid: "",
                port_desc: "",
                broadcast: 0,
                multicast: 0,
                unicast: 0,
                src_port: 0,
                dst_port: 0,
                type: 1
            },
            rules: {
                mtu: [
                    {
                        validator: this.validateMtu,
                        trigger: ["change", "blur"]
                    }
                ],
                erate: [
                    {
                        validator: this.validateRate,
                        trigger: ["change", "blur"]
                    }
                ],
                irate: [
                    {
                        validator: this.validateRate,
                        trigger: ["change", "blur"]
                    }
                ],
                pvid: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                broadcast: [
                    {
                        validator: this.validateCast,
                        trigger: ["change", "blur"]
                    }
                ],
                multicast: [
                    {
                        validator: this.validateCast,
                        trigger: ["change", "blur"]
                    }
                ],
                unicast: [
                    {
                        validator: this.validateCast,
                        trigger: ["change", "blur"]
                    }
                ],
                type: [
                    {
                        validator: this.validateType,
                        trigger: ["change", "blur"]
                    }
                ],
                dst_port: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ],
                port_desc: [
                    {
                        validator: this.validateDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        validateMtu(rule, val, cb) {
            if (this.type !== "sw_port_cfg") {
                return cb();
            }
            if (!regRange(val, 128, 2000)) {
                return cb(
                    new Error(this.validateMsg("inputLength", 128, 2000))
                );
            }
            cb();
        },
        validateRate(rule, val, cb) {
            if (
                this.type !== "sw_port_cfg" ||
                this.data.port_id < this.system.ponports
            ) {
                return cb();
            }
            if (!regRange(val, 64, 1024000) && val !== 0 && val !== "") {
                return cb(
                    new Error(this.validateMsg("inputLength", 64, 1024000))
                );
            }
            cb();
        },
        validateVlan(rule, val, cb) {
            if (this.type !== "sw_port_cfg") {
                return cb();
            }
            if (!regRange(val, 1, 4094)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 4094)));
            }
            cb();
        },
        validateCast(rule, val, cb) {
            if (this.type !== "stormctrl") {
                return cb();
            }
            if (!regRange(val, 0, 1488100)) {
                return cb(
                    new Error(this.validateMsg("inputLength", 0, 1488100))
                );
            }
            cb();
        },
        validateDesc(rule, val, cb) {
            if (!regLength(val, 0, 64)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 64)));
            }
            cb();
        },
        validate(fn) {
            if (isFunction(fn)) {
                this.$refs["port-config-form"].validate(valid => {
                    if (valid) {
                        fn.call(this, this.formData);
                    } else {
                        fn.call(this, valid);
                    }
                });
            } else {
                return this.$refs["port-config-form"].validate();
            }
        },
        validateType(rule, val, cb) {
            if (val < 1 || val > 3) {
                return cb(new Error(this.$lang("required")));
            }
            cb();
        },
        validatePort(rule, val, cb) {
            if (val < 1 || val > this.port.length) {
                return cb(new Error(this.$lang("required")));
            }
            cb();
        },
        init() {
            Object.keys(this.formData).forEach(item => {
                if (isDef(this.data[item])) {
                    this.formData[item] = this.data[item];
                }
            });
            if (isDef(this.data.speed)) {
                if (
                    toLower.call(this.data.speed) === "0M" ||
                    this.data.speed === ""
                ) {
                    this.data.speed = "auto";
                }
            }
        },
        disabled(key, port_id) {
            const { ponports, geports } = this.system;
            const keys = ["admin_status", "duplex", "speed", "auto_neg"];
            if (keys.includes(key) && port_id <= ponports) {
                return true;
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>