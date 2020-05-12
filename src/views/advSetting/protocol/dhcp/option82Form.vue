<template>
    <el-form :model="form" label-width="160px" ref="dhcp-option82-form">
        <el-form-item :label="$lang('option82_policy')" prop="option82_policy">
            <el-select v-model.number="form.option82_policy">
                <template v-for="(item, index) in OPTION82_POLICY">
                    <el-option :label="$lang(item)" :value="index"></el-option>
                </template>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { OPTION82_POLICY } from "@/utils/commonData";
import { isFunction } from "@/utils/common";
export default {
    name: "dhcpOption82Form",
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            OPTION82_POLICY,
            type: "",
            form: {
                option82_policy: 0
            }
        };
    },
    methods: {
        init(type, data) {
            this.$refs["dhcp-option82-form"].resetFields();
            this.type = type;
            this.form.option82_policy = data.option82_policy;
        },
        validate(fn) {
            this.$refs["dhcp-option82-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.type, this.form);
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>