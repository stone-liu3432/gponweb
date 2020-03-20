<template>
    <el-form :model="form" label-width="140px" :rules="rules" ref="onu-allow-form">
        <el-form-item label="ont_id" prop="identifier">
            <span>{{ ont_id }}</span>
        </el-form-item>
        <el-form-item label="ont_name" prop="ont_name">
            <el-input v-model="form.ont_name"></el-input>
        </el-form-item>
        <el-form-item label="ont_description" prop="ont_description">
            <el-input
                v-model="form.ont_description"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
            ></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regLength } from "@/utils/validator";
import { isFunction } from "@/utils/common";
export default {
    name: "onuAllowForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ont_id() {
            const bytes = this.form.identifier;
            return `${this.getPortName((bytes >> 8) & 0xff)}/${bytes & 0xff}`;
        }
    },
    data() {
        return {
            cache: {},
            form: {
                identifier: 0,
                ont_name: "",
                ont_description: ""
            },
            rules: {
                ont_name: [
                    {
                        validator: this.validateName,
                        trigger: ["change", "blur"]
                    }
                ],
                ont_description: [
                    {
                        validator: this.validateDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init(data) {
            this.$refs["onu-allow-form"].resetFields();
            Object.keys(this.form).forEach(key => {
                this.form[key] = data[key];
                // 校验用，无修改时提示
                this.cache[key] = data[key];
            });
        },
        validateName(rule, val, cb) {
            if (!regLength(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 32)));
            }
            cb();
        },
        validateDesc(rule, val, cb) {
            if (!regLength(val, 1, 128)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 128)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["onu-allow-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        let flag = true;
                        Object.keys(this.form).forEach(key => {
                            if (this.cache[key] !== this.form[key]) {
                                flag = false;
                            }
                        });
                        if (flag) {
                            return this.$message.error(
                                this.$lang("modify_tips")
                            );
                        }
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