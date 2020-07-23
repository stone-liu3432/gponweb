<template>
    <el-form :model="form" ref="log-form" :rules="rules" label-width="120px">
        <el-form-item :label="$lang('module_name')" prop="module_name">
            <span>{{ form.module_name }}</span>
        </el-form-item>
        <el-form-item :label="$lang('level')" prop="level">
            <el-input v-model.number="form.level"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
import { isFunction, isDef } from "@/utils/common";
export default {
    name: "logForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            form: {
                module_name: "",
                level: ""
            },
            rules: {
                level: [
                    {
                        validator: this.validateLevel,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init(row) {
            Reflect.ownKeys(this.form).forEach(key => {
                if (isDef(row) && isDef(row[key])) {
                    this.form[key] = row[key];
                }
            });
        },
        validateLevel(rule, val, cb) {
            if (!regRange(val, 0, 7)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 7)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["log-form"].validate(valid => {
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