<template>
    <el-form :model="addOnuForm" :rules="rules" ref="add-onu-form" label-width="100px">
        <el-form-item :label="$lang('onu_id')" prop="onu_id">
            <el-input v-model.number="addOnuForm.onu_id" :placeholder="$lang('zero_auto_')"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('macaddr')" prop="macaddr">
            <el-input v-model="addOnuForm.macaddr" placeholder="e.x. 00:00:00:00:00:00"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('auth_state')">
            <el-select v-model.number="addOnuForm.auth_state">
                <el-option :value="0" label="False"></el-option>
                <el-option :value="1" label="True"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('desc')" prop="desc">
            <el-input type="textarea" v-model="addOnuForm.desc" resize="none"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regMac, regDesc } from "@/utils/validator";
export default {
    name: "addOnuForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            addOnuForm: {
                onu_id: "",
                macaddr: "",
                auth_state: 0,
                desc: ""
            },
            rules: {
                onu_id: [
                    { validator: this.validOid, trigger: ["blur", "change"] }
                ],
                macaddr: [
                    { validator: this.validMac, trigger: ["blur", "change"] }
                ],
                desc: [
                    { validator: this.validDesc, trigger: ["blur", "change"] }
                ]
            }
        };
    },
    methods: {
        validOid(rule, value, cb) {
            if (isNaN(value) || value < 0 || value > 128) {
                return cb(new Error(this.validateMsg("inputRange", 0, 128)));
            }
            cb();
        },
        validMac(rule, value, cb) {
            if (!regMac(value)) {
                return cb(new Error(this.validateMsg("macaddr")));
            }
            cb();
        },
        validDesc(ruel, value, cb) {
            if (!regDesc(value)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 128)));
            }
            cb();
        },
        validate() {
            return new Promise((resolve, reject) => {
                this.$refs["add-onu-form"].validate(valid => {
                    if (valid) {
                        resolve(this.addOnuForm);
                    } else {
                        reject(valid);
                    }
                });
            });
        },
        resetForm() {
            this.$refs["add-onu-form"].resetFields();
        }
    }
};
</script>

<style>
</style>