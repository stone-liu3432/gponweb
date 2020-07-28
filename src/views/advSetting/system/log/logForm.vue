<template>
    <el-form :model="form" ref="log-form" label-width="120px">
        <el-form-item :label="$lang('module_name')" prop="module_name">
            <span>{{ form.module_name }}</span>
        </el-form-item>
        <el-form-item :label="$lang('level')" prop="level">
            <el-select v-model.number="form.level">
                <template v-for="(item, index) in LOG_LEVEL">
                    <el-option :value="index" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
import { isFunction, isDef } from "@/utils/common";
import { LOG_LEVEL } from "@/utils/commonData";
export default {
    name: "logForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            LOG_LEVEL,
            form: {
                module_name: "",
                level: ""
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