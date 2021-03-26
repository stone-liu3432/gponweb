<template>
    <el-form
        :model="formData"
        :rules="rules"
        ref="wlan-form"
        label-width="120px"
    >
        <el-form-item :label="$lang('type')">
            <el-select v-model="formData.wlan_type">
                <template v-for="(item, index) in WLAN_TYPE_MAP">
                    <el-option :label="item" :value="Number(index)"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="formData.wlan_type === 1 || formData.wlan_type === 3">
            <el-form-item
                :label="'2.4G ' + $lang('encrypt')"
                prop="wlan_2_4g_encrypt"
            >
                <el-select v-model.number="formData.wlan_2_4g_encrypt">
                    <template v-for="(item, index) in ENCRYPT_MAP">
                        <el-option
                            :label="item"
                            :value="Number(index)"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item
                label="2.4G ssid"
                prop="wlan_2_4g_ssid"
                key="wlan_2_4g_ssid"
            >
                <el-input v-model="formData.wlan_2_4g_ssid"></el-input>
            </el-form-item>
            <el-form-item
                :label="'2.4G ' + $lang('password')"
                prop="wlan_2_4g_password"
                key="wlan_2_4g_password"
            >
                <el-input v-model="formData.wlan_2_4g_password"></el-input>
            </el-form-item>
        </template>
        <template v-if="formData.wlan_type === 2 || formData.wlan_type === 3">
            <el-form-item
                :label="'5G ' + $lang('encrypt')"
                prop="wlan_5g_encrypt"
            >
                <el-select v-model.number="formData.wlan_5g_encrypt">
                    <template v-for="(item, index) in ENCRYPT_MAP">
                        <el-option
                            :label="item"
                            :value="Number(index)"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item
                label="5G ssid"
                prop="wlan_5g_ssid"
                key="wlan_5g_ssid"
            >
                <el-input v-model="formData.wlan_5g_ssid"></el-input>
            </el-form-item>
            <el-form-item
                :label="'5G ' + $lang('password')"
                prop="wlan_5g_password"
                key="wlan_5g_password"
            >
                <el-input v-model="formData.wlan_5g_password"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { ENCRYPT_MAP } from "@/utils/commonData";
import { regLength } from "@/utils/validator";
import { isFunction } from "@/utils/common";
export default {
    name: "wlanForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    props: {
        data: {
            type: Object,
        },
    },
    data() {
        return {
            ENCRYPT_MAP,
            WLAN_TYPE_MAP: { 1: "2.4G", 2: "5G", 3: "All" },
            formData: {
                wlan_type: 1,
                wlan_2_4g_encrypt: 0,
                wlan_2_4g_ssid: "",
                wlan_2_4g_password: "",
                wlan_5g_encrypt: 0,
                wlan_5g_ssid: "",
                wlan_5g_password: "",
            },
            rules: {
                wlan_2_4g_ssid: [
                    { validator: this.validSsid, trigger: ["change", "blur"] },
                ],
                wlan_2_4g_password: [
                    { validator: this.validPwd, trigger: ["change", "blur"] },
                ],
                wlan_5g_ssid: [
                    { validator: this.validSsid, trigger: ["change", "blur"] },
                ],
                wlan_5g_password: [
                    { validator: this.validPwd, trigger: ["change", "blur"] },
                ],
            },
        };
    },
    methods: {
        init(data) {},
        validSsid(rule, val, cb) {
            // 说明，ssid最大32个字符，
            const { field } = rule;
            switch (this.formData.wlan_type) {
                case 1:
                    if (this.formData.wlan_2_4g_encrypt === 0) {
                        return cb();
                    }
                    if (field === "wlan_5g_ssid") {
                        return cb();
                    }
                    break;
                case 2:
                    if (this.formData.wlan_5g_encrypt === 0) {
                        return cb();
                    }
                    if (field === "wlan_2_4g_ssid") {
                        return cb();
                    }
                    break;
                case 3:
                    if (
                        (this.formData.wlan_2_4g_encrypt === 0 &&
                            field === "wlan_2_4g_ssid") ||
                        (this.formData.wlan_5g_encrypt === 0 &&
                            field === "wlan_5g_ssid")
                    ) {
                        return cb();
                    }
                    break;
            }
            const min = 1,
                max = 32;
            if (!regLength(val, min, max)) {
                return cb(new Error(this.validateMsg("inputLength", min, max)));
            }
            cb();
        },
        validPwd(rule, val, cb) {
            // 说明，password最大32个字符，encrypt为WEP时，最小5个字符，其他最小8个字符
            // 加密方式，0-None,1-WEP,4-WPA2,6-WPA2Mixed
            const { field } = rule;
            let min = 8;
            switch (this.formData.wlan_type) {
                case 1:
                    if (field === "wlan_5g_password") {
                        return cb();
                    } else {
                        if (this.formData.wlan_2_4g_encrypt === 0) {
                            return cb();
                        }
                        if (this.formData.wlan_2_4g_encrypt === 1) {
                            min = 5;
                        }
                    }
                    break;
                case 2:
                    if (field === "wlan_2_4g_password") {
                        return cb();
                    } else {
                        if (this.formData.wlan_5g_encrypt === 0) {
                            return cb();
                        }
                        if (this.formData.wlan_5g_encrypt === 1) {
                            min = 5;
                        }
                    }
                    break;
                case 3:
                    if (
                        (this.formData.wlan_2_4g_encrypt === 0 &&
                            field === "wlan_2_4g_ssid") ||
                        (this.formData.wlan_5g_encrypt === 0 &&
                            field === "wlan_5g_ssid")
                    ) {
                        return cb();
                    }
                    if (
                        field === "wlan_2_4g_password" &&
                        this.formData.wlan_2_4g_encrypt === 1
                    ) {
                        min = 5;
                    }
                    if (
                        field === "wlan_5g_password" &&
                        this.formData.wlan_5g_encrypt === 1
                    ) {
                        min = 5;
                    }

                    break;
            }
            const max = 32;
            if (!regLength(val, min, max)) {
                return cb(new Error(this.validateMsg("inputLength", min, max)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["wlan-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, this.formData);
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
    },
    watch: {
        "formData.wlan_2_4g_encrypt"() {
            this.$refs["wlan-form"].validateField([
                "wlan_2_4g_password",
                "wlan_2_4g_ssid",
            ]);
        },
        "formData.wlan_5g_encrypt"() {
            this.$refs["wlan-form"].validateField([
                "wlan_5g_password",
                "wlan_5g_ssid",
            ]);
        },
    },
};
</script>

<style lang="less" scoped>
</style>