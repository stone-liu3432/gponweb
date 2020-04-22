<template>
    <el-form :model="form" :rules="rules" label-width="140px" ref="ont-basic-form">
        <el-form-item :label="$lang('port_id')" prop="port_id">{{ portName }}</el-form-item>
        <el-form-item :label="$lang('ont_id')" prop="ont_id">{{ ontName }}</el-form-item>
        <el-form-item :label="$lang('ont_name')" prop="ont_name">
            <el-input v-model="form.ont_name"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('ont_description')" prop="ont_description">
            <el-input v-model="form.ont_description" type="textarea"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { regLength } from "@/utils/validator";
export default {
    name: "ontBasicForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        portName() {
            return this.getPortName((this.form.identifier >> 8) & 0xff);
        },
        ontName() {
            return `${this.portName}/${this.form.identifier & 0xff}`;
        }
    },
    data() {
        return {
            form: {
                identifier: 0,
                ont_description: "",
                ont_name: ""
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
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                }
            });
        },
        validate(fn) {
            this.$refs["ont-basic-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        const data = {
                            identifier: this.form.identifier,
                            flags: 0x8,
                            ont_name: this.form.ont_name,
                            ont_description: this.form.ont_description
                        };
                        fn.call(this, data);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
        validateName(rule, val, cb) {
            if (!regLength(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 32)));
            }
            cb();
        },
        validateDesc(rule, val, cb) {
            if (!regLength(val, 0, 128)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 128)));
            }
            cb();
        }
    }
};
</script>

<style lang="less" scoped>
</style>