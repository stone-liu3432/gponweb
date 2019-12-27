<template>
    <el-form label-width="120px" :model="formData" :rules="rules" ref="port-vlan-translate-form">
        <el-form-item label="Old VLAN" prop="old_vlan">
            <el-input v-model="formData.old_vlan"></el-input>
        </el-form-item>
        <el-form-item label="New VLAN" prop="new_vlan">
            <el-input v-model="formData.new_vlan"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('new_vlan_pri')">
            <el-select v-model="formData.new_vlan_pri">
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
    name: "vlanTranslateForm",
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {},
    inject: ["validateVlan"],
    data() {
        return {
            formData: {
                old_vlan: "",
                new_vlan: "",
                new_vlan_pri: 255
            },
            rules: {
                old_vlan: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                new_vlan: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        validate(fn) {
            const cb = this.$refs["port-vlan-translate-form"].validate;
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
        init() {
            this.$nextTick(_ => {
                this.$refs["port-vlan-translate-form"].resetFields();
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>