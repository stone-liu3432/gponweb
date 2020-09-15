<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="virtual-port-form">
        <el-form-item :label="$lang('svp_id')" prop="svp_id" key="svp-id">
            <el-input style="width: 200px;" :disabled="disabledSvpid" v-model.number="form.svp_id"></el-input>
            <el-checkbox
                v-model="autoAssignSvpid"
                v-if="type === 'add'"
                style="margin-left: 30px;"
            >{{ $lang('auto_assign') }}</el-checkbox>
        </el-form-item>
        <template v-if="type === 'add' || type === 'set'">
            <el-form-item :label="$lang('new_svlan')" prop="new_svlan" key="new-svlan">
                <el-input v-model.number="form.new_svlan"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'add'">
            <el-form-item :label="$lang('port_id')" prop="port_id" key="port-id">
                <el-select v-model.number="form.port_id">
                    <template v-for="i in system.ponports">
                        <el-option :value="i" :label="getPortName(i)"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('ont_id')" prop="ont_id" key="ont-id">
                <el-input v-model.number="form.ont_id"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('gemport')" prop="gemport" key="gemport">
                <el-input v-model.number="form.gemport"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('svp_type')" prop="svp_type" key="svp-type">
                <el-select v-model.number="form.svp_type">
                    <template v-for="(item, index) in SVP_TYPE_MAP">
                        <el-option :label="$lang(item)" :value="Number(index)"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('user_vlan')" prop="user_vlan" key="user-vlan">
                <el-input v-model.number="form.user_vlan" :disabled="disabledUservlan"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$lang('install_mode')" prop="install_mode">
                <el-select v-model.number="form.install_mode">
                    <template v-for="(item, index) in INSTALL_MODE_MAP">
                        <el-option :label="$lang(item)" :value="index >>> 0"></el-option>
                    </template>
                </el-select>
            </el-form-item>-->
        </template>
        <template v-if="type === 'add' || type === 'set'">
            <el-form-item :label="$lang('tag_action')" prop="tag_action" key="tag-action">
                <el-select v-model.number="form.tag_action">
                    <template v-for="(item, index) in TAG_ACTIONS">
                        <el-option
                            :value="Number(index)"
                            :label="item"
                            :disabled="disabledTagaction(Number(index))"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('inner_vlan')" prop="inner_vlan" key="inner-vlan">
                <el-input v-model.number="form.inner_vlan" :disabled="disabledInnervlan"></el-input>
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
import {
    TAG_ACTIONS,
    SVP_TYPE_MAP,
    INSTALL_MODE_MAP
} from "@/utils/commonData";
import { regRange, regLength } from "@/utils/validator";
import { isFunction, isDef } from "@/utils/common";
export default {
    name: "virtualPortForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["system"]),
        disabledSvpid() {
            return this.autoAssignSvpid || this.type !== "add";
        },
        disabledUservlan() {
            if (this.form.svp_type === 1 || this.form.tag_action === 6) {
                this.form.user_vlan = "";
                return true;
            }
            return false;
        },
        disabledInnervlan() {
            if (this.form.tag_action === 4 || this.form.tag_action === 5) {
                return false;
            }
            this.form.inner_vlan = "";
            return true;
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
            SVP_TYPE_MAP,
            INSTALL_MODE_MAP,
            form: {
                svp_id: "", // 0-8190
                new_svlan: "", // 1-4094
                port_id: 1,
                ont_id: "", // 1-128
                gemport: "", // 1-32
                svp_type: 1,
                user_vlan: "", // 0-4094
                tag_action: 1,
                inner_vlan: "", // 1-4094
                desc: ""
                // install_mode: 1
            },
            rules: {
                svp_id: [
                    {
                        validator: this.validateSvpid,
                        trigger: ["change", "blur"]
                    }
                ],
                new_svlan: [
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
                    this.form.svp_type = this.data.svp_type;
                    this.form.tag_action = this.data.tag_action;
                    this.form.inner_vlan = this.data.inner_vlan;
                    this.form.new_svlan = this.data.new_svlan;
                } else {
                    this.form.tag_action = 1;
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
            if (!regRange(val, 0, 8190)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 8190)));
            }
            cb();
        },
        validateOntid(rule, val, cb) {
            if (!regRange(val, 0, 127)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 127)));
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
            if (this.form.svp_type == 1 || this.form.tag_action === 6) {
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
        disabledTagaction(val) {
            if (this.form.svp_type === 1) {
                if (val === 1 || val === 5) {
                    return false;
                }
                return true;
            } else if (this.form.svp_type === 2) {
                if (val === 5) {
                    return true;
                }
                return false;
            }
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
                            new_svlan: this.form.new_svlan,
                            port_id: this.form.port_id,
                            ont_id: this.form.ont_id,
                            gemport: this.form.gemport,
                            user_vlan: this.form.user_vlan >>> 0,
                            tag_action: this.form.tag_action,
                            inner_vlan: this.form.inner_vlan >>> 0,
                            desc: this.form.desc,
                            svp_type: this.form.svp_type
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
        },
        "form.svp_type"() {
            this.$refs["virtual-port-form"].clearValidate("user_vlan");
            this.form.tag_action = 1;
        },
        "form.tag_action"() {
            this.$refs["virtual-port-form"].clearValidate([
                "user_vlan",
                "inner_vlan"
            ]);
        }
    }
};
</script>

<style lang="less" scoped>
</style>