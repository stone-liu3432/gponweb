<template>
    <el-form
        label-width="150px"
        :model="form"
        :rules="rules"
        ref="add-vp-from-autofind"
    >
        <el-form-item :label="$lang('svp_af_id')" prop="svp_af_id">
            <!-- <el-input v-model.number="form.svp_af_id"></el-input> -->
            {{ form.svp_af_id }}
        </el-form-item>
        <el-form-item :label="$lang('new_svlan')" prop="new_svlan">
            <el-input v-model.number="form.new_svlan"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('tag_action')" prop="tag_action">
            <el-select v-model.number="form.tag_action">
                <el-option label="-" :value="0"></el-option>
                <template v-for="(item, index) in TAG_ACTIONS">
                    <el-option :label="item" :value="Number(index)"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('inner_vlan')" prop="inner_vlan">
            <el-input
                v-model.number="form.inner_vlan"
                :disabled="disabledInnervlan"
            ></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { TAG_ACTIONS } from "@/utils/commonData";
import { regRange } from "@/utils/validator";
export default {
    name: "addVpFromAfForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        disabledInnervlan() {
            if (this.form.tag_action === 4 || this.form.tag_action === 5) {
                return false;
            }
            this.form.inner_vlan = "";
            return true;
        }
    },
    inject: ["validateVlan"],
    data() {
        return {
            TAG_ACTIONS,
            form: {
                svp_af_id: "",
                new_svlan: "",
                tag_action: 1,
                inner_vlan: ""
            },
            rules: {
                svp_af_id: [
                    { validator: this.validateId, trigger: ["change", "blur"] }
                ],
                new_svlan: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                inner_vlan: [
                    {
                        validator: this.validateInnerVlan,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init(data) {
            this.$refs["add-vp-from-autofind"].resetFields();
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                }
            });
        },
        validateId(rule, val, cb) {
            if (!regRange(val, 0, 8190)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 8190)));
            }
            cb();
        },
        validateInnerVlan(rule, val, cb) {
            if (this.form.tag_action !== 4 && this.form.tag_action !== 5) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validate(fn) {
            this.$refs["add-vp-from-autofind"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        }
    },
    watch: {
        "form.tag_action"() {
            this.$refs["add-vp-from-autofind"].clearValidate("inner_vlan");
        }
    }
};
</script>

<style lang='less' scoped>
</style>