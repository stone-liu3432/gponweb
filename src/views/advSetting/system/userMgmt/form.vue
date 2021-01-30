<template>
    <el-form
        label-width="150px"
        :model="formData"
        :rules="rules"
        ref="user-mgmt-form"
    >
        <template v-if="type === 'add'">
            <el-form-item
                :label="$lang('user')"
                prop="user"
                style="margin-bottom: 28px"
            >
                <el-input v-model="formData.user"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('new_pwd')" prop="user_pwd1">
                <el-input v-model="formData.user_pwd1" show-password></el-input>
            </el-form-item>
            <el-form-item :label="$lang('cfm_pwd')" prop="user_pwd2">
                <el-input v-model="formData.user_pwd2" show-password></el-input>
            </el-form-item>
            <el-form-item :label="$lang('user_level')" prop="user_level">
                <el-select v-model.number="formData.user_level">
                    <template v-for="(item, index) in USER_LEVEL">
                        <el-option
                            :label="item"
                            :value="index"
                            v-if="index > 2"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('user_reenter')" prop="user_reenter">
                <el-input v-model="formData.user_reenter"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('desc')" prop="desc">
                <el-input v-model="formData.desc" type="textarea"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'delete'">
            <el-form-item :label="$lang('user')" prop="user" key="user">
                <el-select v-model="formData.user">
                    <template v-for="item in data">
                        <el-option :value="item.name"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'modify'">
            <el-form-item :label="$lang('user')" prop="user">
                <!-- 超级用户修改其他用户密码 -->
                <template v-if="currUserLevel > 2">
                    <span>{{ formData.user }}</span>
                </template>
                <template v-else>
                    <el-select v-model="formData.user">
                        <template v-for="item in data">
                            <el-option :value="item.name"></el-option>
                        </template>
                    </el-select>
                </template>
            </el-form-item>
            <!-- 超级用户修改其他用户密码时，无须密码直接修改 -->
            <template v-if="showCurrPwd">
                <el-form-item
                    :label="$lang('current_pwd')"
                    prop="current_pwd"
                    key="current_pwd"
                >
                    <el-input
                        v-model="formData.current_pwd"
                        show-password
                    ></el-input>
                </el-form-item>
            </template>
            <el-form-item
                :label="$lang('new_pwd')"
                prop="user_pwd1"
                key="new_pwd"
            >
                <el-input v-model="formData.user_pwd1" show-password></el-input>
            </el-form-item>
            <el-form-item
                :label="$lang('cfm_pwd')"
                prop="user_pwd2"
                key="cfm_pwd"
            >
                <el-input v-model="formData.user_pwd2" show-password></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regName, regPwd, regDesc, regRange } from "@/utils/validator";
import { USER_LEVEL } from "@/utils/commonData";
export default {
    name: "userMgmtForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        showCurrPwd() {
            return (
                this.currUserLevel > 2 ||
                (this.currUserLevel <= 2 &&
                    this.formData.user === this.currUserName)
            );
        },
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        data: {
            type: Array,
        },
    },
    data() {
        return {
            USER_LEVEL,
            formData: {
                user: "",
                user_pwd1: "",
                user_pwd2: "",
                user_level: 5,
                user_reenter: "",
                desc: "",
                current_pwd: "",
            },
            rules: {
                user: [
                    {
                        validator: this.validateName,
                        trigger: ["blur", "change"],
                    },
                ],
                user_pwd1: [
                    {
                        validator: this.validatePwd,
                        trigger: ["blur", "change"],
                    },
                ],
                user_pwd2: [
                    {
                        validator: this.validatePwd,
                        trigger: ["blur", "change"],
                    },
                ],
                user_reenter: [
                    {
                        validator: this.validateReenter,
                        trigger: ["blur", "change"],
                    },
                ],
                desc: [
                    {
                        validator: this.validateDesc,
                        trigger: ["blur", "change"],
                    },
                ],
                current_pwd: [
                    {
                        validator: this.validatePwd,
                        trigger: ["blur", "change"],
                    },
                ],
            },
            currUserLevel: 5,
            currUserName: "",
        };
    },
    methods: {
        validateName(rule, val, cb) {
            if (this.type === "delete") {
                return cb();
            }
            if (!regName(val)) {
                return cb(new Error(this.$lang("username_length_fail")));
            }
            cb();
        },
        validatePwd(rule, val, cb) {
            if (
                rule.field === "current_pwd" ||
                rule.fullField === "current_pwd"
            ) {
                if (!this.showCurrPwd) {
                    return cb();
                }
            }
            if (rule.field === "user_pwd2" || rule.fullField === "user_pwd2") {
                if (this.formData.user_pwd1 !== this.formData.user_pwd2) {
                    return cb(new Error(this.$lang("pwd_not_match")));
                }
            }
            if (!regPwd(val)) {
                return cb(new Error(this.$lang("password_length_fail")));
            }
            cb();
        },
        validateReenter(ruel, val, cb) {
            if (!regRange(val, 1, 4)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 4)));
            }
            cb();
        },
        validateDesc(ruel, val, cb) {
            if (!regDesc(val)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 128)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["user-mgmt-form"].validate((valid) => {
                return valid
                    ? fn.call(this, this.formData)
                    : fn.call(this, valid);
            });
        },
        resetForm() {
            this.$refs["user-mgmt-form"].resetFields();
        },
        init(level, name) {
            if (this.type === "delete") {
                this.formData.user = this.data[0] ? this.data[0].name : "";
            } else if (this.type === "modify") {
                this.formData.user = sessionStorage.getItem("uname");
                this.currUserLevel = level;
                this.currUserName = name;
            }
        },
    },
};
</script>

<style lang="less" scoped>
</style>