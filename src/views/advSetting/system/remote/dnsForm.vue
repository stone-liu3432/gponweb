<template>
    <el-form :model="form" :rules="rules" ref="dns-form" label-width="120px">
        <el-form-item :label="$lang('primary')" prop="primary">
            <el-input v-model="form.primary"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('secondary')" prop="secondary">
            <el-input v-model="form.secondary"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "dnsForm",
    computed: {
        ...mapGetters(["$lang"])
    },
    inject: ["validateIp"],
    data() {
        return {
            form: {
                primary: "",
                secondary: ""
            },
            rules: {
                primary: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                secondary: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init(row) {
            this.$refs["dns-form"].resetFields();
            Object.keys(this.form).forEach(key => {
                this.form[key] = row[key];
            });
        },
        validate(fn) {
            this.$refs["dns-form"].validate(valid => {
                if (valid) {
                    fn.call(this, this.form);
                } else {
                    fn.call(this, valid);
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>