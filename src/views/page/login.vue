<template>
    <div id="login">
        <div class="login-form">
            <h3>{{ $lang('login_user') }}</h3>
            <div>{{ $lang('login_page_login_hit') }}</div>
            <el-form label-width="150px" :model="form" :rules="rules" ref="loginForm">
                <el-form-item :label="$lang('user_name')" prop="uname" style="margin-bottom: 30px;">
                    <el-input v-model="form.uname"></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('password')"
                    prop="password"
                    style="margin-bottom: 30px;"
                >
                    <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('lang')">
                    <el-radio-group v-model="language">
                        <el-radio label="zh">简体中文</el-radio>
                        <el-radio label="en">English</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button
                        style="width: 220px;"
                        type="primary"
                        @click="submitForm('loginForm')"
                    >{{ $lang('login_user') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters } from "vuex";
import { regName, regPwd } from "@/utils/validator";
import md5 from "md5";
export default {
    name: "login",
    data() {
        return {
            form: {
                uname: "",
                password: ""
            },
            language: "",
            rules: {
                uname: [
                    {
                        validator: this.validUserName,
                        trigger: ["change", "blur"]
                    }
                ],
                password: [
                    {
                        validator: this.validPassword,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["lang"])
    },
    created() {
        this.language = this.lang;
    },
    methods: {
        ...mapMutations(["updateLang"]),
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const data = {
                        method: "set",
                        param: {
                            name: this.form.uname,
                            key: md5(`${this.form.uname}:${this.form.password}`)
                        }
                    };
                    this.$http
                        .post("/userlogin", data, {
                            timeout: 5000,
                            params: {
                                form: "login"
                            }
                        })
                        .then(res => {
                            if (res.data.code === 1) {
                                const token = res.headers["x-token"];
                                sessionStorage.setItem("x-token", token);
                                sessionStorage.setItem(
                                    "uname",
                                    this.form.uname
                                );
                                this.$message.success(
                                    `${this.$lang("login_success")}, ${
                                        this.form.uname
                                    }`
                                );
                                this.$router.push("/main");
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {
                            this.$message.error(
                                this.$lang("http_login_timeout")
                            );
                        });
                } else {
                    return false;
                }
            });
        },
        validUserName(rule, val, cb) {
            if (!regName(val)) {
                return cb(new Error(this.$lang("username_length_fail")));
            }
            cb();
        },
        validPassword(rule, val, cb) {
            if (!regPwd(val)) {
                return cb(new Error(this.$lang("password_length_fail")));
            }
            cb();
        }
    },
    watch: {
        lang() {
            if (this.language === this.lang) return;
            this.language = this.lang;
        },
        language() {
            this.updateLang(this.language);
        }
    }
};
</script>

<style lang="less" scoped>
.login-form {
    border: 1px solid #ddd;
    h3 {
        text-align: center;
        & + div {
            text-align: center;
            color: @tipsColor;
            margin: 30px 0;
            font-size: 14px;
        }
    }
    width: 500px;
    padding: 30px;
    background: @dialogBg;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
}
</style>
