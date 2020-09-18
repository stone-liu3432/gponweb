<template>
    <el-form :model="form" label-width="180px" ref="ont-port-config-form" :rules="rules">
        <el-form-item :label="$lang('uniport')" prop="uniport">{{ form.uniport }}</el-form-item>
        <template v-if="type === 'port'">
            <el-form-item :label="$lang('epspeed')" prop="epspeed">
                <el-select v-model.number="form.epspeed">
                    <el-option label="10" :value="10"></el-option>
                    <el-option label="100" :value="100"></el-option>
                    <el-option label="1000" :value="1000"></el-option>
                    <el-option label="Auto-neg" :value="0xffff"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('epduplex')" prop="epduplex">
                <el-select v-model.number="form.epduplex">
                    <el-option :label="$lang('full')" :value="0"></el-option>
                    <el-option :label="$lang('half')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('epautoneg')" prop="epautoneg">
                <el-select v-model.number="form.epautoneg">
                    <el-option :label="$lang('enable')" :value="0"></el-option>
                    <el-option :label="$lang('disable')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('adminstate')" prop="adminstate">
                <el-select v-model.number="form.adminstate">
                    <el-option :label="$lang('enable')" :value="0"></el-option>
                    <el-option :label="$lang('disable')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('flow_ctrl')" prop="flow_ctrl">
                <el-select v-model.number="form.flow_ctrl">
                    <el-option :label="$lang('enable')" :value="0"></el-option>
                    <el-option :label="$lang('disable')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('ring')" prop="ring">
                <el-select v-model.number="form.ring">
                    <el-option :label="$lang('on')" :value="1"></el-option>
                    <el-option :label="$lang('off')" :value="2"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'vlan'">
            <el-form-item :label="$lang('unitype')" prop="unitype" key="unitype">
                <el-select v-model.number="form.unitype">
                    <template v-for="(item,index) in UNI_TYPES">
                        <el-option :label="item" :value="index"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('na_vlan_id')" prop="na_vlan_id" key="na_vlan_id">
                <el-input
                    v-model.number="form.na_vlan_id"
                    :disabled="flush_vlan"
                    style="width: 215px;"
                ></el-input>
                <el-checkbox
                    v-model="flush_vlan"
                    style="margin-left: 30px;"
                >{{ $lang('clear') }} VLAN</el-checkbox>
            </el-form-item>
            <el-form-item :label="$lang('na_vlan_pri')" prop="na_vlan_pri" key="na_vlan_pri">
                <el-select v-model.number="form.na_vlan_pri" :disabled="flush_vlan">
                    <el-option label="-" :value="15"></el-option>
                    <el-option :value="0"></el-option>
                    <template v-for="i in 7">
                        <el-option :value="i"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { UNI_TYPES } from "@/utils/commonData";
import { regRange } from "@/utils/validator";
export default {
    name: "ontPortConfigForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            UNI_TYPES,
            form: {
                identifier: 0,
                uniport: "",
                epspeed: 1000,
                epduplex: 0,
                epautoneg: 1,
                adminstate: 1,
                flow_ctrl: 1,
                ring: 1,
                unitype: 1,
                na_vlan_id: "",
                na_vlan_pri: 0
            },
            rules: {
                na_vlan_id: [
                    {
                        validator: this.validateVlanid,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            cacheData: null,
            type: "",
            flush_vlan: false
        };
    },
    methods: {
        init(type, data) {
            this.$refs["ont-port-config-form"].resetFields();
            this.type = type;
            this.flush_vlan = false;
            this.cacheData = JSON.parse(JSON.stringify(data));
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                    if (key === "epspeed" && data[key] === 0) {
                        this.form[key] = 0xffff;
                    }
                }
            });
            if (this.form.na_vlan_id === 0x1000) {
                this.flush_vlan = true;
            }
        },
        validate(fn) {
            this.$refs["ont-port-config-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        let flags;
                        if (this.type === "port") {
                            const FLAGS = {
                                epspeed: 0x1,
                                epduplex: 0x1,
                                flow_ctrl: 0x2,
                                epautoneg: 0x4,
                                adminstate: 0x8,
                                ring: 0x10
                            };
                            flags = Object.keys(FLAGS).reduce((prev, key) => {
                                if (this.form[key] !== this.cacheData[key]) {
                                    if ((prev & FLAGS[key]) !== FLAGS[key]) {
                                        return prev | FLAGS[key];
                                    }
                                }
                                return prev;
                            }, 0);
                        }
                        if (this.type === "vlan") {
                            if (this.flush_vlan) {
                                this.form.na_vlan_id = 0x1000;
                            }
                            ["unitype", "na_vlan_id", "na_vlan_pri"].forEach(
                                key => {
                                    if (
                                        this.form[key] !== this.cacheData[key]
                                    ) {
                                        flags = 1;
                                    }
                                }
                            );
                        }
                        fn.call(this, this.type, {
                            flags,
                            ...this.form
                        });
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        },
        validateVlanid(rule, val, cb) {
            if (this.flush_vlan) {
                return cb();
            }
            if (!regRange(val, 1, 4095)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 4095)));
            }
            cb();
        }
    },
    watch: {
        flush_vlan() {
            if (this.flush_vlan) {
                this.form.na_vlan_id = "";
                this.form.na_vlan_pri = 15;
            } else {
                this.form.na_vlan_id = this.cacheData.na_vlan_id || "";
                this.form.na_vlan_pri = this.cacheData.na_vlan_pri || 15;
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>