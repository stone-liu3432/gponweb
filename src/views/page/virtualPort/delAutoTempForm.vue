<template>
    <el-form
        label-width="100px"
        ref="del-auto-temp-form"
        :model="form"
        :rules="rules"
    >
        <el-form-item :label="$lang('type')" prop="type">
            <el-select v-model.number="form.type">
                <el-option :value="0" :label="$lang('all')"></el-option>
                <el-option :value="1" :label="$lang('port_id')"></el-option>
                <el-option
                    :value="2"
                    :label="`${$lang('port_id')}+${$lang('gemport')}`"
                ></el-option>
            </el-select>
        </el-form-item>
        <template v-if="form.type !== 0">
            <el-form-item :label="$lang('port_id')" prop="port_id">
                <el-select v-model.number="form.port_id">
                    <el-option
                        :value="0"
                        :label="$lang('select_all')"
                    ></el-option>
                    <template v-for="i in system.ponports">
                        <el-option
                            :value="i"
                            :label="getPortName(i)"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="form.type === 2">
            <el-form-item :label="$lang('gemport')" prop="gemport">
                <el-input
                    v-model.number="form.gemport"
                    style="width: 220px"
                ></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "delAutoTempForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["system"]),
    },
    data() {
        return {
            form: {
                type: 0,
                port_id: 0,
                gemport: 0,
            },
            rules: {
                gemport: [
                    {
                        validator: this.validGemport,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    methods: {
        init() {
            this.$refs["del-auto-temp-form"].resetFields();
        },
        validate(fn) {
            this.$refs["del-auto-temp-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
        validGemport(rule, val, cb) {
            if (!regRange(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 32)));
            }
            cb();
        },
    },
    watch: {
        "form.type"() {
            this.form.port_id = 0;
            this.form.gemport = 0;
        },
    },
};
</script>

<style lang="less" scoped>
span.nms-tips {
    .base-font-style;
    margin-left: 12px;
    color: @tipsColor;
}
</style>