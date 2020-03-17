<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="virtual-port-form">
        <el-form-item :label="$lang('svp_id')" prop="svp_id">
            <el-input style="width: 200px;" :disabled="disabledSvpid" v-model.number="form.svp_id"></el-input>
            <el-checkbox
                v-model="autoAssignSvpid"
                v-if="type === 'add'"
                style="margin-left: 30px;"
            >{{ $lang('auto_assign') }}</el-checkbox>
        </el-form-item>
        <template v-if="type === 'add'">
            <el-form-item :label="$lang('svlan')" prop="svlan">
                <el-input v-model.number="form.svlan"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('port_id')" prop="port_id">
                <el-select v-model.number="form.port_id">
                    <template v-for="i in system.ponports">
                        <el-option :value="i" :label="getPortName(i)"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('ont_id')" prop="ont_id">
                <el-input v-model.number="form.ont_id"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('gemport')" prop="gemport">
                <el-input v-model.number="form.gemport"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('user_vlan')" prop="user_vlan">
                <el-input v-model.number="form.user_vlan"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'add' || type === 'set'">
            <el-form-item :label="$lang('tag_action')" prop="tag_action">
                <el-select v-model.number="form.tag_action">
                    <el-option :value="0" label="-"></el-option>
                    <template v-for="(item, index) in TAG_ACTIONS">
                        <el-option :value="index >>> 0" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('inner_vlan')" prop="inner_vlan">
                <el-input v-model.number="form.inner_vlan"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'desc'">
            <el-form-item :label="$lang('desc')" prop="desc" key="desc">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { TAG_ACTIONS } from "@/utils/commonData";
import { regRange, regLength } from "@/utils/validator";
import { isFunction, isDef } from "@/utils/common";
export default {
    name: "virtualPortForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["system"]),
        disabledSvpid() {
            return this.autoAssignSvpid || this.type !== "add";
        }
    },
    props: {
        type: {
            type: String
        },
        data: {
            type: Object
        }
    },
    inject: ["validateVlan"],
    data() {
        return {
            TAG_ACTIONS,
            form: {
                svp_id: "", // 0-8191
                svlan: "", // 1-4094
                port_id: 1,
                ont_id: "", // 1-128
                gemport: "", // 1-32
                user_vlan: "", // 0-4094
                tag_action: 0,
                inner_vlan: "", // 1-4094
                desc: ""
            },
            rules: {
                svp_id: [
                    {
                        validator: this.validateSvpid,
                        trigger: ["change", "blur"]
                    }
                ],
                svlan: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                ont_id: [
                    {
                        validator: this.validateOntid,
                        trigger: ["change", "blur"]
                    }
                ],
                gemport: [
                    {
                        validator: this.validateGemport,
                        trigger: ["change", "blur"]
                    }
                ],
                user_vlan: [
                    {
                        validator: this.validateUservlan,
                        trigger: ["change", "blur"]
                    }
                ],
                inner_vlan: [
                    {
                        validator: this.validateInnerVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                desc: [
                    {
                        validator: this.validateDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            autoAssignSvpid: false
        };
    },
    methods: {
        init(fn) {
            this.$refs["virtual-port-form"].resetFields();
            this.autoAssignSvpid = false;
            if (this.type === "set" || this.type === "desc") {
                this.form.svp_id = this.data.svp_id;
                if (this.type === "set") {
                    this.form.tag_action = this.data.tag_action;
                    this.form.inner_vlan = this.data.inner_vlan;
                } else {
                    this.form.tag_action = 0;
                    this.form.inner_vlan = "";
                }
            }
            if (isFunction(fn)) {
                fn.call(this, this.form);
            }
        },
        validateSvpid(rule, val, cb) {
            if (this.autoAssignSvpid) {
                return cb();
            }
            if (!regRange(val, 0, 8191)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 8191)));
            }
            cb();
        },
        validateOntid(rule, val, cb) {
            if (!regRange(val, 1, 128)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 128)));
            }
            cb();
        },
        validateGemport(rule, val, cb) {
            if (!regRange(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 32)));
            }
            cb();
        },
        validateUservlan(rule, val, cb) {
            if (val === "" || val === 0) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validateInnerVlan(rule, val, cb) {
            if (this.form.tag_action !== 4 && this.form.tag_action !== 5) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validateDesc(rule, val, cb) {
            if (!regLength(val, 0, 64)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 64)));
            }
            cb();
        },
        validate(fn) {
            if (this.type === "set") {
                if (
                    this.form.tag_action === this.data.tag_action &&
                    this.form.inner_vlan === this.data.inner_vlan
                ) {
                    return this.$message.error(this.$lang("modify_tips"));
                }
            }
            this.$refs["virtual-port-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        return fn.call(this, {
                            svp_id: this.autoAssignSvpid
                                ? 0xffff
                                : this.form.svp_id >>> 0,
                            svlan: this.form.svlan,
                            port_id: this.form.port_id,
                            ont_id: this.form.ont_id,
                            gemport: this.form.gemport,
                            user_vlan: this.form.user_vlan >>> 0,
                            tag_action: this.form.tag_action,
                            inner_vlan: this.form.inner_vlan >>> 0,
                            desc: this.form.desc
                        });
                    }
                    return fn.call(this, valid);
                }
            });
        }
    },
    watch: {
        autoAssignSvpid() {
            if (this.autoAssignSvpid) {
                this.form.svp_id = "";
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>