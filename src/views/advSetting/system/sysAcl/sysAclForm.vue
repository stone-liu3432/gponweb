<template>
    <el-form
        :model="form"
        :rules="rules"
        label-width="140px"
        ref="sys-acl-form"
    >
        <el-form-item :label="$lang('name')" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('afi')" prop="afi">
            <el-select v-model.number="form.afi">
                <template v-for="(item, index) in AFI_MAP">
                    <el-option
                        :value="Number(index)"
                        :label="$lang(item)"
                    ></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('hostip')" prop="hostip">
            <el-input v-model="form.hostip"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('macaddr')" prop="macaddr">
            <el-input v-model="form.macaddr"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('access')" prop="access">
            <el-select v-model.number="form.access">
                <template v-for="(item, index) in SYSTEM_ACL_ACCESS_MAP">
                    <el-option :value="Number(index)" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { SYSTEM_ACL_ACCESS_MAP, AFI_MAP } from "@/utils/commonData";
import { regLength } from "@/utils/validator";
import { isIPv6, isFunction } from "@/utils/common";
export default {
    name: "sysAclForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    data() {
        return {
            AFI_MAP,
            SYSTEM_ACL_ACCESS_MAP,
            form: {
                name: "",
                afi: 1,
                type: 1,
                hostip: "",
                macaddr: "",
                access: 1,
            },
            rules: {
                name: [
                    {
                        validator: this.validName,
                        trigger: ["change", "blur"],
                    },
                ],
                hostip: [
                    {
                        validator: this.validIp,
                        trigger: ["change", "blur"],
                    },
                ],
                macaddr: [
                    {
                        validator: this.validateMac,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    inject: ["validateMac", "validateIp"],
    methods: {
        validName(rule, val, cb) {
            if (!regLength(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 32)));
            }
            cb();
        },
        validIp(rule, val, cb) {
            if (this.form.afi === 1) {
                this.validateIp(rule, val, cb);
            } else {
                if (!isIPv6(val)) {
                    return cb(new Error(""));
                }
                cb();
            }
        },
        validate(fn) {
            this.$refs["sys-acl-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
    },
    watch: {
        "form.afi"() {
            this.$refs["sys-acl-form"].clearValidate("hostip");
        },
    },
};
</script>

<style lang="less" scoped>
</style>