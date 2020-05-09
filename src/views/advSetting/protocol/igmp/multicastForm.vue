<template>
    <el-form :model="form" :rules="rules" ref="multicast-form" label-width="180px">
        <el-form-item :label="$lang('multi_ip')" prop="multi_ip">
            <el-input v-model.trim="form.multi_ip"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('vid')" prop="vid">
            <el-input v-model.number="form.vid"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('port_id')" prop="port_id">
            <el-select v-model.number="form.port_id">
                <template v-for="item in portName">
                    <el-option :label="item.name" :value="item.port_id"></el-option>
                </template>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isFunction } from "@/utils/common";
export default {
    name: "multicastForm",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["portName"])
    },
    inject: ["validateVlan", "validateIp"],
    data() {
        return {
            form: {
                multi_ip: "",
                vid: "",
                port_id: 1
            },
            rules: {
                multi_ip: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                vid: [
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
            this.$refs["multicast-form"].resetFields();
        },
        validate(fn) {
            this.$refs["multicast-form"].validate(valid => {
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