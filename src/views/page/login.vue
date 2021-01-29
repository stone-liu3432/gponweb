<template>
    <div id="login" @keyup.enter="submitForm('loginForm')">
        <canvas ref="login-canvas"></canvas>
        <el-row class="login-form">
            <el-col class="login-logo" style="width: 300px">
                <template v-if="hasLogo">
                    <div class="login-logo-img">
                        <img src="/login_logo.png" />
                    </div>
                </template>
                <p v-else>GPON-OLT</p>
                <template v-if="custom.hsgq">
                    <div class="copyright-design-info">
                        Copyright 2017-2020. Design by HSGQ.
                    </div>
                </template>
                <template v-if="system.product_name">
                    <div class="product-name">
                        <span>{{ system.product_name }}</span>
                        <span>{{ `(${system.ponports} PON Ports)` }}</span>
                    </div>
                </template>
            </el-col>
            <el-col class="login-content" style="width: 400px">
                <!-- <h3>{{ $lang("login_user") }}</h3> -->
                <div class="login-title">
                    {{ $lang("login_page_login_hit") }}
                </div>
                <el-form
                    label-width="100px"
                    :model="form"
                    :rules="rules"
                    ref="loginForm"
                >
                    <el-form-item
                        :label="$lang('user_name')"
                        prop="uname"
                        style="margin-bottom: 30px"
                    >
                        <el-input v-model="form.uname"></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="$lang('password')"
                        prop="password"
                        style="margin-bottom: 30px"
                    >
                        <el-input
                            :type="inputType"
                            v-model="form.password"
                            autocomplete="off"
                        >
                            <i
                                slot="suffix"
                                class="el-input__icon el-icon-view"
                                @click="changeInputType"
                            ></i>
                        </el-input>
                    </el-form-item>
                    <template v-if="custom.captcha">
                        <el-form-item
                            :label="$lang('verification_code')"
                            prop="captcha"
                        >
                            <img
                                @click="getCaptcha"
                                class="captcha-img"
                                ref="captcha-img"
                            />
                            <el-input
                                style="width: 120px; margin-left: 12px"
                                v-model="form.captcha"
                            ></el-input>
                        </el-form-item>
                    </template>
                    <template v-if="custom.fix_lang === 0">
                        <el-form-item :label="$lang('lang')">
                            <el-radio-group v-model="language">
                                <el-radio label="zh">简体中文</el-radio>
                                <el-radio label="en">English</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <el-form-item>
                        <el-button
                            style="width: 220px"
                            type="primary"
                            @click="submitForm('loginForm')"
                        >
                            {{ $lang("login_user") }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters } from "vuex";
import { regName, regPwd } from "@/utils/validator";
import { isDef } from "@/utils/common";
import md5 from "md5";
import starMap from "@/views/common/stellar/star";
export default {
    name: "login",
    data() {
        return {
            form: {
                uname: "",
                password: "",
                captcha: "",
            },
            language: "",
            inputType: "password",
            captchaSrc: "",
            hasLogo: false,
            rules: {
                uname: [
                    {
                        validator: this.validUserName,
                        trigger: ["change", "blur"],
                    },
                ],
                password: [
                    {
                        validator: this.validPassword,
                        trigger: ["change", "blur"],
                    },
                ],
                captcha: [
                    {
                        validator: this.validateCaptcha,
                        trigger: ["change", "blur"],
                    },
                ],
            },
            system: {},
        };
    },
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["lang", "custom"]),
    },
    created() {
        if (this.lang) {
            this.language = this.lang;
        }
        this.$http
            .get("/login_logo.png")
            .then((res) => {
                this.hasLogo = true;
            })
            .catch((err) => {
                this.hasLogo = false;
            });
        this.getSystem();
    },
    mounted() {
        document.body.style.overflow = "hidden";
        const star = starMap(this.$refs["login-canvas"]);
        this.$once("hook:beforeDestroy", () => {
            document.body.style.overflow = "";
            star.destroy();
        });
    },
    methods: {
        ...mapMutations(["updateLang"]),
        ...mapActions(["setLanguage"]),
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const data = {
                        method: "set",
                        param: {
                            name: this.form.uname,
                            key: md5(
                                `${this.form.uname}:${this.form.password}`
                            ),
                            captcha_v: this.form.captcha,
                            captcha_f: this.captchaSrc,
                        },
                    };
                    this.$http
                        .post("/userlogin", data, {
                            timeout: 5000,
                            params: {
                                form: "login",
                            },
                        })
                        .then((res) => {
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
                        .catch((err) => {
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
        },
        changeInputType() {
            if (this.inputType === "password") {
                this.inputType = "text";
            } else {
                this.inputType = "password";
            }
        },
        validateCaptcha(rule, val, cb) {
            const reg = /^\w{4,8}$/;
            if (!reg.test(val)) {
                return cb(new Error(this.validateMsg("inputLength", 4, 8)));
            }
            cb();
        },
        getCaptcha() {
            this.captchaSrc = "";
            this.$http
                .get("/system_captcha")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            const fname = res.data.data.filename;
                            this.$refs["captcha-img"].src = fname;
                            this.captchaSrc = fname;
                        }
                    }
                })
                .catch((err) => {});
        },
        getSystem() {
            this.$http
                .get("/board_info")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.system = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
    },
    watch: {
        lang() {
            if (this.language === this.lang) return;
            this.language = this.lang;
        },
        language(nv, ov) {
            if (this.custom.fix_lang || ov === "") {
                return;
            }
            this.updateLang(this.language);
            this.$i18n.locale = this.language;
            this.setLanguage(this.language);
        },
        custom() {
            if (this.custom.captcha) {
                this.getCaptcha();
            }
        },
    },
};
</script>

<style lang="less" scoped>
#login {
    background-image: radial-gradient(
        ellipse farthest-corner at center top,
        #000d4d 0%,
        #000105 100%
    );
    // IE9
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#000d4d, endColorstr=#000105);
}
.login-form {
    border: 1px solid @borderColor;
    h3 {
        text-align: center;
    }
    div.login-title {
        text-align: center;
        color: @tipsColor;
        margin: 30px 0;
        font-size: 14px;
    }
    width: 703px;
    height: 400px;
    background: @bodyBg;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
}
.login-logo {
    position: relative;
    height: 100%;
    width: 300px;
    text-align: center;
    line-height: 320px;
    > p {
        font-size: 42px;
        font-weight: 600;
        text-align: center;
        color: @titleColor;
        line-height: 320px;
        margin: 0;
    }
    > div.login-logo-img {
        height: 320px;
        line-height: 320px;
        overflow: hidden;
    }
    > div.product-name {
        height: auto;
        line-height: normal;
        width: 100%;
        color: @titleColor;
        font-weight: bold;
        margin-top: 12px;
        height: 21px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        word-break: break-all;
        padding: 0 6px;
        box-sizing: border-box;
    }
    img {
        max-width: 300px;
        vertical-align: middle;
    }
}
.login-content {
    width: 400px;
    height: 100%;
    padding: 0 20px 0 0;
    box-sizing: border-box;
    border-left: @border-style;
}
.el-input__icon {
    &:hover {
        cursor: pointer;
    }
}
.copyright-design-info {
    position: absolute;
    bottom: 6px;
    left: 0;
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: @titleColor;
}
.captcha-img {
    width: 120px;
    height: 40px;
    vertical-align: middle;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
}
</style>
