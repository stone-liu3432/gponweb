<template>
    <div class="system-setting">
        <page-header type="none" class="page-header-style">
            <template slot="title">{{ $lang('sysinfo_set') }}</template>
            <template slot="content">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px; width: 200px;"
                    @click="goBack"
                >{{ $lang('goback_devmgmt') }}</el-button>
                <el-form-item :label="$lang('lang') + ':'" style="margin-left: 30px;">
                    <el-select v-model="language" size="small">
                        <el-option value="en"></el-option>
                        <el-option value="zh"></el-option>
                    </el-select>
                </el-form-item>
            </template>
        </page-header>
        <div class="system-setting-item">
            <h3>Login logo</h3>
            <div>
                <el-upload
                    ref="upload"
                    action="hsgq.com"
                    :file-list="loginFilelist"
                    :auto-upload="false"
                    :multiple="false"
                    :limit="1"
                    accept="image/png, image/jpg, image/jpeg"
                    :on-change="loginLogoChange"
                >
                    <el-button slot="trigger" size="small" type="primary">{{ $lang('file_click') }}</el-button>
                    <el-button
                        style="margin-left: 10px;"
                        size="small"
                        type="success"
                        @click="uploadImage('loginLogo')"
                    >{{ $lang('commit') }}</el-button>
                    <div slot="tip" class="el-upload__tip">{{ $lang('imagesize_tips') }}</div>
                </el-upload>
            </div>
        </div>
        <div class="system-setting-item">
            <h3>Logo</h3>
            <div>
                <el-upload
                    ref="upload"
                    action="hsgq.com"
                    :file-list="logoFilelist"
                    :auto-upload="false"
                    :multiple="false"
                    :limit="1"
                    accept="image/png, image/jpg, image/jpeg"
                    :on-change="logoChange"
                >
                    <el-button slot="trigger" size="small" type="primary">{{ $lang('file_click') }}</el-button>
                    <el-button
                        style="margin-left: 10px;"
                        size="small"
                        type="success"
                        @click="uploadImage('logo')"
                    >{{ $lang('commit') }}</el-button>
                    <div slot="tip" class="el-upload__tip">{{ $lang('logosize_tips') }}</div>
                </el-upload>
            </div>
        </div>
        <div class="system-setting-item system-setting-company-info">
            <h3>{{ $lang('company_info') }}</h3>
            <el-form
                :model="form"
                :rules="rules"
                ref="company-info"
                label-width="160px"
                size="small"
            >
                <el-form-item :label="$lang('company_name')" prop="company_name">
                    <el-input v-model="form.company_name"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('company_addr')" prop="company_addr">
                    <el-input v-model="form.company_addr"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('company_email')" prop="company_email">
                    <el-input v-model="form.company_email"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('company_phone')" prop="company_phone">
                    <el-input v-model="form.company_phone"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('supplier_info')" prop="supplier_info">
                    <el-input v-model="form.supplier_info"></el-input>
                </el-form-item>
            </el-form>
            <div>
                <el-button
                    style="width: 200px; margin-left: 160px;"
                    type="primary"
                    size="small"
                    @click="submitCompanyInfo"
                >{{ $lang('commit') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { isFunction, isDef } from "@/utils/common";
import { regLength } from "@/utils/validator";
import uploadFile from "@/mixin/uploadFile";
import postData from "@/mixin/postData";
export default {
    name: "sysSetting",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["lang"])
    },
    mixins: [uploadFile, postData],
    created() {
        this.language = this.lang;
        const uname = sessionStorage.getItem("uname");
        if (uname !== "devol") {
            this.goBack();
        }
    },
    data() {
        return {
            language: "",
            loginFilelist: [],
            logoFilelist: [],
            form: {
                company_name: "",
                company_addr: "",
                company_email: "",
                company_phone: "",
                supplier_info: ""
            },
            rules: {
                company_name: [
                    {
                        validator: this.validateCname,
                        trigger: ["change", "blur"]
                    }
                ],
                company_addr: [
                    {
                        validator: this.vlaidateCaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                company_email: [
                    {
                        validator: this.validateCemail,
                        trigger: ["change", "blur"]
                    }
                ],
                company_phone: [
                    {
                        validator: this.validateCphone,
                        trigger: ["change", "blur"]
                    }
                ],
                supplier_info: [
                    {
                        validator: this.validateSupplierinfo,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        ...mapMutations(["updateLang"]),
        goBack() {
            this.$router.back();
        },
        logoChange(f, flist) {
            this.logoFilelist = flist;
            if (f && flist.length === 1) {
                const _this = this;
                const src = URL.createObjectURL(f.raw);
                const img = new Image();
                img.src = src;
                img.onload = function() {
                    if (img.width > 240 || img.height > 70) {
                        _this.$message.error(_this.$lang("logosize_tips"));
                        _this.logoFilelist = [];
                    }
                };
            }
        },
        loginLogoChange(f, flist) {
            this.loginFilelist = flist;
        },
        uploadImage(type) {
            const ACTIONS = {
                loginLogo() {
                    if (!this.loginFilelist.length) {
                        this.$message.error(this.$lang("file_not_select"));
                        return;
                    }
                    const file = this.loginFilelist[0].raw;
                    if (file.size > 50 * 1024) {
                        this.$message.error(this.$lang("imagesize_tips"));
                        return;
                    }
                    return {
                        url: "/upgrade?type=login_logo",
                        file
                    };
                },
                logo() {
                    if (!this.logoFilelist.length) {
                        this.$message.error(this.$lang("file_not_select"));
                        return;
                    }
                    const file = this.logoFilelist[0].raw;
                    if (file.size > 50 * 1024) {
                        this.$message.error(this.$lang("imagesize_tips"));
                        return;
                    }
                    return {
                        url: "/upgrade?type=logo",
                        file
                    };
                }
            };
            if (isFunction(ACTIONS[type])) {
                const res = ACTIONS[type].call(this);
                if (isDef(res)) {
                    const { url, file } = res;
                    url &&
                        file &&
                        this.uploadFile(url, file)
                            .then(res => {
                                if (res.data.code === 1) {
                                    this.$message.success(
                                        this.$lang("setting_ok")
                                    );
                                } else {
                                    this.$message.error(
                                        `(${res.data.code}) ${res.data.message}`
                                    );
                                }
                            })
                            .catch(err => {});
                }
            }
        },
        // /board?info=setting_board  set/get company information
        submitCompanyInfo() {
            this.$refs["company-info"].validate(valid => {
                if (valid) {
                    this.postData("/board?info=setting_board", {
                        param: {
                            name: this.form.company_name,
                            addr: this.form.company_addr,
                            email: this.form.company_email,
                            phone: this.form.company_phone,
                            supplier_info: this.form.supplier_info
                        }
                    })
                        .then(res => {})
                        .catch(err => {});
                }
            });
        },
        validateCname(rule, val, cb) {
            if (!regLength(val, 0, 128)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 128)));
            }
            cb();
        },
        vlaidateCaddr(rule, val, cb) {
            if (!regLength(val, 0, 256)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 256)));
            }
            cb();
        },
        validateCemail(rule, val, cb) {
            if (!regLength(val, 0, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 32)));
            }
            cb();
        },
        validateCphone(rule, val, cb) {
            if (!regLength(val, 0, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 32)));
            }
            cb();
        },
        validateSupplierinfo(rule, val, cb) {
            if (!regLength(val, 0, 128)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 128)));
            }
            cb();
        }
    },
    watch: {
        lang() {
            this.language = this.lang;
        },
        language() {
            if (this.language === this.lang) {
                return;
            }
            this.updateLang(this.language);
        }
    }
};
</script>

<style lang="less" scoped>
.system-setting {
    padding: 20px;
}
.page-header-style /deep/ h2 {
    width: 600px;
}
.system-setting-item {
    width: 300px;
    margin: 20px;
    h3 {
        color: @titleColor;
    }
}
.system-setting-company-info {
    width: auto;
    margin-top: 30px;
}
</style>