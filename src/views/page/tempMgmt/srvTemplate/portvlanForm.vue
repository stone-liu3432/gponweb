<template>
    <el-form label-width="120px" ref="portvlan-form" :model="form" :rules="rules">
        <el-form-item :label="$lang('unitype')" prop="unitype">
            <el-select v-model.number="form.unitype">
                <template v-for="(item, index) in UNI_TYPES">
                    <el-option
                        :value="Number(index)"
                        :label="item"
                        :disabled="disabledIphost(item)"
                    ></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('uniport')" prop="uniport">
            <el-input v-model.number="form.uniport"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('mode')" prop="mode">
            <el-select v-model.number="form.mode">
                <template v-for="(item, index) in VLAN_MODES">
                    <el-option :value="Number(index)" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('svlanid')" prop="svlanid">
            <el-input v-model.number="form.svlanid" :disabled="form.mode === 1"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('svlanpri')" prop="svlanpri">
            <el-select v-model.number="form.svlanpri" :disabled="form.mode === 1">
                <el-option :value="0"></el-option>
                <template v-for="i in 7">
                    <el-option :value="i"></el-option>
                </template>
                <el-option :value="8" label="-"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('cvlanid')" prop="cvlanid">
            <el-input v-model.number="form.cvlanid" style="width: 200px;" :disabled="disabledCvlan"></el-input>
            <el-checkbox
                v-model="autoAssignCvlan"
                style="margin-left: 30px;"
                v-if="form.mode === 4"
            >untag</el-checkbox>
        </el-form-item>
        <el-form-item :label="$lang('cvlanpri')" prop="cvlanpri">
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
    name: "portvlanForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        disabledCvlan() {
            return (
                this.autoAssignCvlan ||
                this.form.mode === 1 ||
                this.form.mode === 2
            );
        }
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
                uniport: "", // 0-8
                unitype: 0,
                mode: 1,
                svlanid: "", // 0-4094
                svlanpri: 8, // 0-8
                cvlanid: "", // 1-4094, 4096
                cvlanpri: 8 // 0-8
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
            autoAssignCvlan: false,
            dialogType: "",
            dialogData: null
        };
    },
    methods: {
        init(data) {
            this.$refs["portvlan-form"].resetFields();
            this.dialogType = "";
            this.dialogData = null;
            if (isDef(data)) {
                this.dialogType = "set";
                this.dialogData = JSON.parse(JSON.stringify(data));
                Object.keys(this.form).forEach(key => {
                    if (isDef(data[key])) {
                        this.form[key] = data[key];
                    }
                });
            }
        },
        validate(fn) {
            if (this.dialogType === "set") {
                if (
                    Object.keys(this.dialogData).every(
                        key => this.dialogData[key] === this.form[key]
                    )
                ) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
            }
            this.$refs["portvlan-form"].validate(valid => {
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
            if (
                this.form.mode !== 2 &&
                this.data.some(
                    item =>
                        item.uniport === this.form.uniport &&
                        item.unitype === this.form.unitype &&
                        item.svlanid === this.form.svlanid &&
                        item.svlanpri === this.form.svlanpri
                )
            ) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "svlanid"
                        )}`
                    )
                );
            }
            return this.validateVlan(rule, val, cb);
        },
        validateCvlan(rule, val, cb) {
            if (this.form.mode === 1 || this.form.mode === 2) {
                return cb();
            }
            if (this.form.mode === 4) {
                if (val === 4096) {
                    return cb();
                }
            }
            if (
                this.data.some(
                    item =>
                        item.uniport === this.form.uniport &&
                        item.unitype === this.form.unitype &&
                        item.cvlanid === this.form.cvlanid &&
                        item.cvlanpri === this.form.cvlanpri
                )
            ) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "cvlanid"
                        )}`
                    )
                );
            }
            return this.validateVlan(rule, val, cb);
        },
        // 只能出现一个iphost的端口 ?  =>  待定
        disabledIphost(val) {
            return false;
            // return (
            //     val === "iphost" &&
            //     this.data &&
            //     this.data.some(item => item.unitype === 1)
            // );
        }
    },
    watch: {
        "form.mode"() {
            if (this.form.mode === 1) {
                this.form.svlanid = "";
                this.form.cvlanid = "";
                const el = this.$refs["portvlan-form"];
                el && el.clearValidate(["cvlanid", "svlanid"]);
            }
            if (this.form.mode === 4) {
                if (this.form.cvlanid === 4096) {
                    const el = this.$refs["portvlan-form"];
                    el && el.clearValidate("cvlanid");
                }
            } else if (this.form.mode === 2) {
                this.form.cvlanid = "";
                const el = this.$refs["portvlan-form"];
                el && el.clearValidate(["cvlanid"]);
            } else {
                this.autoAssignCvlan = false;
            }
        },
        autoAssignCvlan() {
            if (this.autoAssignCvlan) {
                this.form.cvlanid = 4096;
            } else {
                this.form.cvlanid = "";
            }
        },
        "form.unitype"() {
            const el = this.$refs["portvlan-form"];
            el && el.clearValidate(["uniport"]);
        }
    }
};
</script>

<style lang="less" scoped>
</style>