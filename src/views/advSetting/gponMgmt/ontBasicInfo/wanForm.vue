<template>
    <el-form
        :model="form"
        :rules="rules"
        label-width="180px"
        ref="ont-wan-form"
    >
        <el-form-item :label="$lang('name')" prop="name" key="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('ipmode')" prop="ipmode" key="ipmode">
            <el-select v-model.number="form.ipmode">
                <template v-for="(item, index) in IPMODE_MAP">
                    <el-option :value="index" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('ctype')" prop="ctype" key="ctype">
            <el-select v-model.number="form.ctype">
                <template v-for="(item, index) in CTYPE_MAP">
                    <template v-if="showCtypeOpts(item, index)">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="form.ipmode !== 3">
            <el-form-item :label="$lang('mtu')" prop="mtu" key="mtu">
                <el-input v-model.number="form.mtu"></el-input>
            </el-form-item>
        </template>
        <template v-if="form.ipmode === 0 || form.ipmode === 1">
            <el-form-item
                :label="$lang('ipproto')"
                prop="ipproto"
                key="ipproto"
            >
                <!-- 静态IP地址，暂时只支持 IPv4 -->
                <el-select
                    v-model.number="form.ipproto"
                    :disabled="form.ipmode === 0"
                >
                    <template v-for="(item, index) in IP_PROTOS_MAP">
                        <template v-if="showIpproto(item, index)">
                            <el-option :value="Number(index)" :label="item">
                            </el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="form.ipmode === 0">
            <el-form-item :label="$lang('ipaddr')" prop="ipaddr" key="ipaddr">
                <el-input v-model="form.ipaddr"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('ipmask')" prop="ipmask" key="ipmask">
                <el-input v-model="form.ipmask"></el-input>
            </el-form-item>
            <el-form-item
                :label="$lang('gateway')"
                prop="gateway"
                key="gateway"
            >
                <el-input v-model="form.gateway"></el-input>
            </el-form-item>
        </template>
        <template v-if="form.ipmode === 2">
            <el-form-item
                :label="$lang('pppoemode')"
                prop="pppoemode"
                key="pppoemode"
            >
                <el-select v-model.number="form.pppoemode">
                    <template v-for="(item, index) in PPPOE_MODE_MAP">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('user')" prop="user" key="user">
                <el-input v-model="form.user"></el-input>
            </el-form-item>
            <el-form-item
                :label="$lang('password')"
                prop="password"
                key="password"
            >
                <el-input v-model="form.password"></el-input>
            </el-form-item>
        </template>
        <el-form-item :label="$lang('tagmode')" prop="tagmode" key="tagmode">
            <el-switch
                v-model.number="form.tagmode"
                :active-value="1"
                :inactive-value="0"
            ></el-switch>
        </el-form-item>
        <el-form-item :label="$lang('vlan_id')" prop="vlan_id" key="vlan_id">
            <el-input
                v-model.number="form.vlan_id"
                :disabled="!form.tagmode"
            ></el-input>
        </el-form-item>
        <el-form-item
            :label="$lang('vlan_pri')"
            prop="vlan_priority"
            key="vlan_priority"
        >
            <el-select
                v-model.number="form.vlan_priority"
                :disabled="!form.tagmode"
            >
                <el-option :value="0"></el-option>
                <template v-for="i in 7">
                    <el-option :value="i"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="form.ipmode === 0 || form.ipmode === 1">
            <el-form-item
                :label="$lang('reqdns')"
                prop="requestdns"
                key="reqdns"
            >
                <el-switch
                    v-model="form.requestdns"
                    :active-value="1"
                    :inactive-value="0"
                ></el-switch>
            </el-form-item>
            <el-form-item :label="$lang('pridns')" prop="pridns" key="pridns">
                <el-input
                    v-model="form.pridns"
                    :disabled="!form.requestdns"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$lang('secdns')" prop="secdns" key="secdns">
                <el-input
                    v-model="form.secdns"
                    :disabled="!form.requestdns"
                ></el-input>
            </el-form-item>
        </template>
        <template v-if="form.ctype !== 0 && form.ctype !== 3">
            <el-form-item
                :label="$lang('portmap')"
                prop="portmap"
                key="portmap"
            >
                <el-checkbox-group v-model="form.portmap">
                    <template v-for="(item, index) in ONT_PORT_MAP">
                        <el-checkbox :label="Number(index)">
                            {{ item }}
                        </el-checkbox>
                    </template>
                </el-checkbox-group>
            </el-form-item>
        </template>
        <el-form-item
            :label="$lang('igmpproxy')"
            prop="igmpproxy"
            key="igmpproxy"
        >
            <el-select v-model.number="form.igmpproxy">
                <template v-for="(item, index) in NOT_CONCERNED_STATUS_MAP">
                    <el-option :value="index" :label="$lang(item)"></el-option>
                </template>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isIPv6, isFunction } from "@/utils/common";
import { regIp, regRange } from "@/utils/validator";
import {
    IPMODE_MAP,
    CTYPE_MAP,
    ONT_PORT_MAP,
    NOT_CONCERNED_STATUS_MAP,
} from "@/utils/commonData";
export default {
    name: "wanForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    data() {
        return {
            CTYPE_MAP,
            IPMODE_MAP,
            ONT_PORT_MAP,
            NOT_CONCERNED_STATUS_MAP,
            PPPOE_MODE_MAP: ["AUTO", "CHAP", "PAP"],
            IP_PROTOS_MAP: { 1: "IPv4", 2: "IPv6", 3: "IPv4/IPv6" },
            form: {
                name: "",
                //  index 值为-1时，表示create，否则为set
                index: -1,
                ipmode: 3,
                ctype: 1,
                igmpproxy: 0,
                ipproto: 1,
                mtu: 1500,
                ipaddr: "",
                ipmask: "",
                gateway: "",
                pppoemode: 0,
                user: "",
                password: "",
                tagmode: 0,
                vlan_id: "",
                vlan_priority: 0,
                reqdns: 0,
                pridns: "",
                secdns: "",
                portmap: [],
            },
            rules: {
                name: [
                    {
                        validator: this.vlaidName,
                        trigger: ["change", "blur"],
                    },
                ],
                vlan_id: [
                    {
                        validator: this.validVlan,
                        trigger: ["change", "blur"],
                    },
                ],
                pridns: [
                    {
                        validator: this.validDns,
                        trigger: ["change", "blur"],
                    },
                ],
                secdns: [
                    {
                        validator: this.validDns,
                        trigger: ["change", "blur"],
                    },
                ],
                portmap: [
                    {
                        validator: this.validPortmap,
                        trigger: ["change", "blur"],
                    },
                ],
                user: [
                    {
                        validator: this.validUser,
                        trigger: ["cahnge", "blur"],
                    },
                ],
                password: [
                    {
                        validator: this.validPwd,
                        trigger: ["cahnge", "blur"],
                    },
                ],
                mtu: [
                    {
                        validator: this.validMtu,
                        trigger: ["change", "blur"],
                    },
                ],
                ipaddr: [
                    {
                        validator: this.validIp,
                        trigger: ["change", "blur"],
                    },
                ],
                ipmask: [
                    {
                        validator: this.validIp,
                        trigger: ["change", "blur"],
                    },
                ],
                gateway: [
                    {
                        validator: this.validIp,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    inject: ["validateVlan", "validateIp"],
    methods: {
        init() {
            this.$refs["ont-wan-form"].resetFields();
        },
        showCtypeOpts(item, index) {
            if (this.form.ipmode !== 3) {
                return true;
            }
            return index === 1 || index === 2;
        },
        vlaidName(rule, val, cb) {
            if (!/^[\w-]{1,32}$/.test(val)) {
                return cb(new Error(this.validateMsg("inputName", 1, 32)));
            }
            cb();
        },
        validVlan(rule, val, cb) {
            if (!this.form.tagmode) {
                cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validIp(rule, val, cb) {
            if (this.form.ipmode !== 0) {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
        validDns(rule, val, cb) {
            if (
                !this.form.requestdns ||
                this.form.ipmode === 2 ||
                this.form.ipmode === 3
            ) {
                return cb();
            }
            if (
                !this.form.secdns &&
                (rule.field === "secdns" || rule.fullField === "secdns")
            ) {
                return cb();
            }
            return this.validateIp(rule, val, cb);
        },
        validPortmap(rule, val, cb) {
            if (this.form.ctype === 0 || this.form.ctype === 3) {
                return cb();
            }
            if (!this.form.portmap.length) {
                return cb(
                    new Error(
                        this.$lang("required") + ": " + this.$lang("portmap")
                    )
                );
            }
            cb();
        },
        validUser(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!/^[^\s]{1,32}$/.test(val)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 32)));
            }
            cb();
        },
        validPwd(rule, val, cb) {
            if (this.form.mode !== 2) {
                return cb();
            }
            if (!/^.{1,32}$/.test(val)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 32)));
            }
            cb();
        },
        showIpproto(item, index) {
            if (this.form.ipmode === 0 && index !== "1") {
                return false;
            }
            return true;
        },
        validMtu(rule, val, cb) {
            if (this.form.ipmode === 3) {
                return cb();
            }
            if (!regRange(val, 70, 1500)) {
                return cb(new Error(this.validateMsg("inputRange", 70, 1500)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["ont-wan-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
    },
    watch: {
        "form.ipmode"() {
            if (this.form.ipmode === 3) {
                this.form.ctype = 1;
            }
            if (this.form.ipmode === 0) {
                this.form.ipproto = 1;
            }
        },
        "form.ctype"() {
            if (this.form.ctype === 0 || this.form.ctype === 3) {
                this.form.portmap = [];
            }
        },
        "form.tagmode"() {
            if (!this.tagmode) {
                this.form.vlan_id = "";
                this.$refs["ont-wan-form"].clearValidate(["vlan_id"]);
            }
        },
        "form.requestdns"() {
            if (!this.requestdns) {
                this.form.pridns = "";
                this.form.secdns = "";
                this.$refs["ont-wan-form"].clearValidate(["pridns", "secdns"]);
            }
        },
    },
};
</script>

<style lang="less" scoped>
</style>