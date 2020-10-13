<template>
    <el-form :model="form" :rules="rules" ref="vp-form" label-width="120px">
        <el-form-item :label="$lang('unitype')" prop="unitype" key="unitype">
            <el-select v-model.number="form.unitype">
                <template v-for="(item, index) in UNI_TYPES">
                    <el-option :value="Number(index)" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('uniport')" prop="uniport" key="uniport">
            <el-input v-model.number="form.uniport"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('mode')" prop="mode">
            <el-select v-model.number="form.mode">
                <template v-for="(item, index) in VLAN_MODES">
                    <template v-if="Number(index) !== 2">
                        <el-option
                            :value="Number(index)"
                            :label="item"
                        ></el-option>
                    </template>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('svlanid')" prop="svlanid" key="svlan-id">
            <el-input
                v-model.number="form.svlanid"
                :disabled="form.mode === 1"
            ></el-input>
        </el-form-item>
        <el-form-item
            :label="$lang('svlanpri')"
            prop="svlanpri"
            key="svlan-pri"
        >
            <el-select
                v-model.number="form.svlanpri"
                :disabled="form.mode === 1"
            >
                <el-option :value="0"></el-option>
                <template v-for="i in 7">
                    <el-option :value="i"></el-option>
                </template>
                <el-option :value="8" label="-"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('cvlanid')" prop="cvlanid" key="cvlan-id">
            <el-input
                v-model.number="form.cvlanid"
                :disabled="form.mode === 1 || form.mode === 2"
            ></el-input>
        </el-form-item>
        <el-form-item :label="$lang('cvlanpri')" prop="cvlanpri" key="cvlanpri">
            <el-select
                v-model.number="form.cvlanpri"
                :disabled="form.mode === 1 || form.mode === 2"
            >
                <el-option :value="0"></el-option>
                <template v-for="i in 7">
                    <el-option :value="i"></el-option>
                </template>
                <el-option :value="8" label="-"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { UNI_TYPES, VLAN_MODES } from "@/utils/commonData";
import { isFunction, isArray, isDef } from "@/utils/common";
import { regRange, regLength } from "@/utils/validator";
export default {
    name: "ontPortVlanForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    inject: ["validateVlan"],
    props: {
        data: {
            type: Array
        }
    },
    data() {
        return {
            UNI_TYPES,
            VLAN_MODES,
            form: {
                uniport: "",
                unitype: 0,
                mode: 1,
                svlanid: "",
                svlanpri: 8,
                cvlanid: "",
                cvlanpri: 8
            },
            rules: {
                uniport: [
                    {
                        validator: this.validatePort,
                        trigger: ["change", "blur"]
                    }
                ],
                svlanid: [
                    {
                        validator: this.validateSvlan,
                        trigger: ["change", "blur"]
                    }
                ],
                cvlanid: [
                    {
                        validator: this.validateCvlan,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            dialogData: null,
            dialogType: ""
        };
    },
    methods: {
        init(type, data) {
            this.$refs["vp-form"].resetFields();
            this.dialogType = type;
            this.dialogData = null;
            if (isDef(data)) {
                this.dialogData = JSON.parse(JSON.stringify(data));
                Object.keys(this.form).forEach(key => {
                    if (isDef(data[key])) {
                        this.form[key] = data[key];
                    }
                });
            }
        },
        validate(fn) {
            if (this.dialogType === "config") {
                if (
                    Object.keys(this.dialogData).every(
                        key => this.dialogData[key] === this.form[key]
                    )
                ) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
            }
            this.$refs["vp-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
        validatePort(rule, val, cb) {
            const data = this.data.filter(
                item =>
                    item.uniport === Number(val) &&
                    item.unitype === this.form.unitype
            );
            if (data.length >= 8) {
                return cb(new Error(this.$lang("uniport_vlan_limit")));
            }
            if (this.form.unitype === 1 && this.form.mode !== 2) {
                if (!regRange(val, 0, 2)) {
                    return cb(new Error(this.validateMsg("inputRange", 0, 2)));
                }
                return cb();
            }
            if (!regRange(val, 1, 8)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 8)));
            }
            cb();
        },
        validateSvlan(rule, val, cb) {
            if (this.form.mode === 1) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validateCvlan(rule, val, cb) {
            if (this.form.mode === 1) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        }
    },
    watch: {
        "form.mode"() {
            if (this.form.mode === 1) {
                this.form.svlanid = "";
                this.form.cvlanid = "";
                this.form.svlanpri = 8;
                this.form.cvlanpri = 8;
                const el = this.$refs["vp-form"];
                el && el.clearValidate(["cvlanid", "svlanid"]);
            } else {
                if (isDef(this.dialogData)) {
                    ["svlanid", "cvlanid", "svlanpri", "cvlanpri"].forEach(
                        key => {
                            if (isDef(this.dialogData[key])) {
                                this.form[key] = this.dialogData[key];
                            }
                        }
                    );
                }
            }
        },
        "form.unitype"() {
            const el = this.$refs["vp-form"];
            el && el.clearValidate(["uniport"]);
        }
    }
};
</script>

<style lang="less" scoped>
</style>