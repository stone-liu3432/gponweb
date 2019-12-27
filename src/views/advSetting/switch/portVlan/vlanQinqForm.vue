<template>
    <el-form label-width="120px" :model="formData" :rules="rules" ref="port-vlan-qinq-form">
        <el-form-item label="CVLAN" prop="cvlan">
            <el-input v-model.number="formData.cvlan" :disabled="disabled('cvlan')"></el-input>
        </el-form-item>
        <el-form-item label="CVLAN Start" prop="cvlan_s">
            <el-input v-model.number="formData.cvlan_s" :disabled="disabled('cvlan_s')"></el-input>
        </el-form-item>
        <el-form-item label="CVLAN End" prop="cvlan_e">
            <el-input v-model.number="formData.cvlan_e" :disabled="disabled('cvlan_e')"></el-input>
        </el-form-item>
        <el-form-item label="SVLAN" prop="svlan">
            <el-input v-model.number="formData.svlan"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('svlan_pri')" prop="svlan_pri">
            <el-select v-model.number="formData.svlan_pri">
                <el-option label="-" :value="255"></el-option>
                <el-option :value="0"></el-option>
                <template v-for="i in 7">
                    <el-option :value="i"></el-option>
                </template>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isFunction } from "@/utils/common";
export default {
    name: "vlanQinqForm",
    computed: {
        ...mapGetters(["$lang"])
    },
    inject: ["validateVlan"],
    data() {
        return {
            formData: {
                cvlan: "",
                cvlan_s: "",
                cvlan_e: "",
                svlan: "",
                svlan_pri: 255
            },
            rules: {
                cvlan: [
                    {
                        validator: this.validateVlanSingle,
                        trigger: ["change", "blur"]
                    }
                ],
                cvlan_s: [
                    {
                        validator: this.validateVlanRange,
                        trigger: ["change", "blur"]
                    }
                ],
                cvlan_e: [
                    {
                        validator: this.validateVlanRange,
                        trigger: ["change", "blur"]
                    }
                ],
                svlan: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init() {
            this.$nextTick(_ => {
                this.$refs["port-vlan-qinq-form"].resetFields();
            });
        },
        validate(fn) {
            const cb = this.$refs["port-vlan-qinq-form"].validate;
            if (isFunction(fn)) {
                cb(valid => {
                    if (valid) {
                        fn.call(this, this.formData);
                    } else {
                        fn.call(this, valid);
                    }
                });
            } else {
                return cb();
            }
        },
        validateVlanRange(rule, val, cb) {
            this.$refs["port-vlan-qinq-form"].clearValidate("cvlan");
            if (this.formData.cvlan) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validateVlanSingle(rule, val, cb) {
            this.$refs["port-vlan-qinq-form"].clearValidate([
                "cvlan_s",
                "cvlan_e"
            ]);
            if (this.formData.cvlan_s && this.formData.cvlan_e) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        disabled(prop) {
            if (prop === "cvlan") {
                if (this.formData.cvlan_s || this.formData.cvlan_e) {
                    return true;
                }
                return false;
            } else {
                if (this.formData.cvlan) {
                    return true;
                }
                return false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>