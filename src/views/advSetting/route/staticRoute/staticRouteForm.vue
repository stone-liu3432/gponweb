<template>
    <el-form :model="form" :rules="rules" label-width="150px" ref="static-route-form">
        <el-form-item :label="$lang('dst_ipaddr')" prop="ipaddress">
            <el-input v-model.trim="form.ipaddress"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('mask')" prop="mask">
            <el-input v-model.trim="form.mask"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('gateway')" prop="gateway">
            <el-input v-model.trim="form.gateway"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isFunction } from "@/utils/common";
export default {
    name: "staticRouteForm",
    computed: {
        ...mapGetters(["$lang"])
    },
    inject: ["validateIp"],
    data() {
        return {
            form: {
                ipaddress: "",
                mask: "",
                gateway: ""
            },
            rules: {
                ipaddress: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                mask: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                gateway: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    methods: {
        init() {
            this.$refs["static-route-form"].resetFields();
        },
        validate(fn) {
            this.$refs["static-route-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>