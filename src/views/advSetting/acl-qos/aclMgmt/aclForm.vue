<template>
    <el-form label-width="150px" :model="form" :rules="rules" ref="acl-form">
        <template v-if="type === 'add' || type === 'delete'">
            <el-form-item label="ACL ID" prop="acl_id">
                <el-input v-model.number="form.acl_id"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'config' || type === 'rule'">
            <el-form-item label="ACL ID" prop="acl_id">{{ form.acl_id }}</el-form-item>
            <el-form-item label="Rule ID" prop="rule_id">
                <el-select v-model.number="form.rule_id">
                    <template v-for="i in 16">
                        <el-option :value="i"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('action')" prop="action">
                <el-select v-model.number="form.action">
                    <template v-for="(item, index) in ACL_ACTION_MAP">
                        <el-option :label="item" :value="index >>> 0"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="acl_type === 'basic'">
                <el-form-item :label="$lang('src_ipaddr')" prop="src_ipaddr">
                    <el-input v-model="form.src_ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('src_ipmask')" prop="src_ipmask">
                    <el-input
                        v-model="form.src_ipmask"
                        :disabled="acl_type!== 'basic' && !form.src_ipaddr"
                    ></el-input>
                </el-form-item>
            </template>
            <template v-if="acl_type === 'advanced'">
                <el-form-item :label="$lang('protocol')" prop="protocol">
                    <el-input v-model="form.protocol"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('src_ipaddr')" prop="src_ipaddr">
                    <el-input v-model="form.src_ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('src_ipmask')" prop="src_ipmask">
                    <el-input v-model="form.src_ipmask" :disabled="!form.src_ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('dst_ipaddr')" prop="dst_ipaddr">
                    <el-input v-model="form.dst_ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('dst_ipmask')" prop="dst_ipmask">
                    <el-input v-model="form.dst_ipmask" :disabled="!form.dst_ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('src_port')" prop="src_port">
                    <el-input v-model="form.src_port"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('dst_port')" prop="dst_port">
                    <el-input v-model="form.dst_port"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('precedence')" prop="precedence">
                    <el-input v-model="form.precedence"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('dscp')" prop="dscp">
                    <el-input v-model="form.dscp"></el-input>
                </el-form-item>
            </template>
            <template v-if="acl_type === 'link'">
                <el-form-item :label="$lang('eth_type')" prop="eth_type">
                    <el-input v-model="form.eth_type"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('cos')" prop="cos">
                    <el-input v-model="form.cos"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('inner_cos')" prop="inner_cos">
                    <el-input v-model="form.inner_cos"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('vlan_id')" prop="vlan_id">
                    <el-input v-model="form.vlan_id"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('inner_vlan_id')" prop="inner_vlan_id">
                    <el-input v-model="form.inner_vlan_id"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('src_mac')" prop="src_mac">
                    <el-input v-model="form.src_mac"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('src_mask')" prop="src_mask">
                    <el-input v-model="form.src_mask" :disabled="!form.src_mask"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('dst_mac')" prop="dst_mac">
                    <el-input v-model="form.dst_mac"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('dst_mask')" prop="dst_mask">
                    <el-input v-model="form.dst_mask" :disabled="!form.dst_mask"></el-input>
                </el-form-item>
            </template>
            <el-form-item :label="$lang('timerange')" prop="timerange">
                <el-select v-model="form.timerange">
                    <el-option value label="-"></el-option>
                    <template v-for="item in timerangeList">
                        <el-option :value="item.name"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isFunction, isDef } from "@/utils/common";
import { regRange, regLength } from "@/utils/validator";
import { ACL_ACTION_MAP, PROTOCOL_MAP } from "@/utils/commonData";
export default {
    name: "aclForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["timerangeList"]),
        acl_type() {
            if (this.form.acl_id < 3000) {
                return "basic";
            }
            if (this.form.acl_id < 5000) {
                return "advanced";
            }
            return "link";
        }
    },
    inject: ["validateMac", "validateVlan", "validateIp"],
    data() {
        return {
            ACL_ACTION_MAP,
            form: {
                acl_id: "", // 2000 - 5999
                rule_id: 1,
                action: 1,
                timerange: "",
                protocol: "", // icmp / udp / tcp / ip / ipinip / 0-255
                src_ipaddr: "",
                src_ipmask: "",
                dst_ipaddr: "",
                dst_ipmask: "",
                src_port: "", // 0 - 65535
                dst_port: "", // 0 - 65535
                precedence: "", // 0 - 7
                dscp: "", // 0-63
                eth_type: "", // 0 - 65535
                cos: "", // 0 - 7
                inner_cos: "", // 0 - 7
                vlan_id: "",
                inner_vlan_id: "",
                src_mac: "",
                src_mask: "",
                dst_mac: "",
                dst_mask: ""
            },
            type: "",
            rules: {
                acl_id: [
                    { validator: this.validateAcl, trigger: ["change", "blur"] }
                ], // 2000 - 5999
                protocol: [
                    {
                        validator: this.validateProtocol,
                        trigger: ["change", "blur"]
                    }
                ], // icmp / udp / tcp / ip / ipinip / 0-255
                src_ipaddr: [
                    {
                        validator: this.validateIpaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                src_ipmask: [
                    {
                        validator: this.validateIpaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                dst_ipaddr: [
                    {
                        validator: this.validateIpaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                dst_ipmask: [
                    {
                        validator: this.validateIpaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                src_port: [
                    {
                        validator: this.validatePortOrType,
                        trigger: ["change", "blur"]
                    }
                ], // 0 - 65535
                dst_port: [
                    {
                        validator: this.validatePortOrType,
                        trigger: ["change", "blur"]
                    }
                ], // 0 - 65535
                precedence: [
                    {
                        validator: this.validatePrec,
                        trigger: ["change", "blur"]
                    }
                ], // 0 - 7
                dscp: [
                    {
                        validator: this.validateDscp,
                        trigger: ["change", "blur"]
                    }
                ], // 0-63
                eth_type: [
                    {
                        validator: this.validatePortOrType,
                        trigger: ["change", "blur"]
                    }
                ], // 0 - 65535
                cos: [
                    { validator: this.validateCos, trigger: ["change", "blur"] }
                ], // 0 - 7
                inner_cos: [
                    { validator: this.validateCos, trigger: ["change", "blur"] }
                ], // 0 - 7
                vlan_id: [
                    {
                        validator: this.validateVlanid,
                        trigger: ["change", "blur"]
                    }
                ],
                inner_vlan_id: [
                    {
                        validator: this.validateVlanid,
                        trigger: ["change", "blur"]
                    }
                ],
                src_mac: [
                    {
                        validator: this.validateMacaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                src_mask: [
                    {
                        validator: this.validateMacmask,
                        trigger: ["change", "blur"]
                    }
                ],
                dst_mac: [
                    {
                        validator: this.validateMacaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                dst_mask: [
                    {
                        validator: this.validateMacmask,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            cacheData: {}
        };
    },
    methods: {
        init(type, row) {
            this.$refs["acl-form"].resetFields();
            this.type = type;
            if (isDef(row)) {
                this.form.acl_id = row.acl_id;
                if (type === "config") {
                    this.cacheData = JSON.parse(JSON.stringify(row));
                }
            }
        },
        validateAcl(rule, val, cb) {
            if (!regRange(val, 2000, 5999)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 2000, 5999))
                );
            }
            cb();
        },
        validateProtocol(rule, val, cb) {
            if (
                !PROTOCOL_MAP.includes(val) &&
                (val < 0 || val > 255 || isNaN(val) || val === "")
            ) {
                return cb(new Error(`${PROTOCOL_MAP.join(",")}, 0 - 255`));
            }
            cb();
        },
        validatePortOrType(rule, val, cb) {
            if (!regRange(val, 0, 65535)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 65535)));
            }
            cb();
        },
        validateCos(rule, val, cb) {
            if (!regRange(val, 0, 7)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 7)));
            }
            cb();
        },
        validateMacaddr(rule, val, cb) {
            if (val === "") {
                return cb();
            }
            return this.validateMac(rule, val, cb);
        },
        validateIpaddr(rule, val, cb) {
            if (val === "" && this.acl_type !== "basic") {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
        validateVlanid(rule, val, cb) {
            if (val === "" || val === 0) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validatePrec(rule, val, cb) {
            if (this.form.dscp) {
                return cb();
            }
            if (!regRange(val, 0, 7)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 7)));
            }
            cb();
        },
        validateDscp(rule, val, cb) {
            if (this.form.precedence) {
                return cb();
            }
            if (!regRange(val, 0, 63)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 63)));
            }
            cb();
        },
        validateMacmask(rule, val, cb) {
            if (val === "") {
                return cb();
            }
            const reg = /^([0-9a-f]{4}(-(?!$)|$)){3}/i;
            if (!reg.test(val)) {
                return cb(new Error("ffff-ffff-ffff"));
            }
            cb();
        },
        validate(fn) {
            this.$refs["acl-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        const flags = this.computedFlags(this.form);
                        fn.call(this, this.type, { ...this.form, flags });
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        },
        computedFlags(data) {
            const acl = data.acl_id;
            let flags = 0;
            if (acl < 3000) {
                const BASE_FLAGS = {
                    src_ipaddr: 0x01,
                    timerange: 0x02
                };
                Object.keys(BASE_FLAGS).forEach(key => {
                    if (isDef(data[key])) {
                        flags |= BASE_FLAGS[key];
                    }
                });
                return flags;
            }
            if (acl < 5000) {
                const ADV_FLAGS = {
                    protocol: 0x1,
                    src_ipaddr: 0x02,
                    dst_ipaddr: 0x04,
                    src_port: 0x08,
                    dst_port: 0x10,
                    precedence: 0x20,
                    dscp: 0x40,
                    timerange: 0x80
                };
                Object.keys(ADV_FLAGS).forEach(key => {
                    if (isDef(data[key])) {
                        flags |= ADV_FLAGS[key];
                    }
                });
                return flags;
            }
            const LINK_FLAGS = {
                eth_type: 0x01,
                cos: 0x02,
                inner_cos: 0x04,
                vlan_id: 0x08,
                inner_vlan_id: 0x10,
                src_mac: 0x20,
                dst_mac: 0x40,
                timerange: 0x80
            };
            Object.keys(LINK_FLAGS).forEach(key => {
                if (isDef(data[key])) {
                    flags |= LINK_FLAGS[key];
                }
            });
            return flags;
        }
    }
};
</script>

<style lang="less" scoped>
</style>