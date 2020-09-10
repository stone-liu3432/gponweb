<template>
    <el-form :model="form" label-width="140px" ref="add-ont-form" :rules="rules">
        <el-form-item :label="$lang('port_id')" prop="port_id">
            <span>{{ getPortName(port_id) }}</span>
        </el-form-item>
        <el-form-item :label="$lang('ont_id')" prop="ont_id">
            <el-input v-model.number="form.ont_id" :disabled="checked" style="width: 200px;"></el-input>
            <el-checkbox v-model="checked" style="margin-left: 20px;">{{ $lang('auto_assign') }}</el-checkbox>
        </el-form-item>
        <el-form-item :label="$lang('auth_mode')" prop="auth_mode">
            <el-select v-model.number="form.auth_mode">
                <template v-for="(item, index) in ONT_AUTH_MODES">
                    <el-option :label="item" :value="index >>> 0"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="form.auth_mode === 0">
            <el-form-item :label="$lang('ont_sn')" prop="ont_sn" key="ont_sn">
                <el-input v-model.trim="form.ont_sn"></el-input>
            </el-form-item>
        </template>
        <template v-else>
            <el-form-item :label="$lang('loid')" prop="loid" key="loid">
                <el-input v-model.trim="form.loid"></el-input>
            </el-form-item>
            <template v-if="form.auth_mode === 2">
                <el-form-item
                    :label="$lang('loid_password')"
                    prop="loid_password"
                    key="loid_password"
                >
                    <el-input v-model.trim="form.loid_password"></el-input>
                </el-form-item>
            </template>
        </template>
        <el-form-item :label="$lang('ont_lineprofid')" prop="ont_lineprofid" key="ont-lineprofid">
            <el-select v-model.number="form.ont_lineprofid">
                <template v-for="item in lineProfs">
                    <el-option :value="item.profid" :label="item.profname"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('ont_srvprofid')" prop="ont_srvprofid" key="ont-srvprofid">
            <el-select v-model.number="form.ont_srvprofid">
                <template v-for="item in srvProfs">
                    <el-option :value="item.profid" :label="item.profname"></el-option>
                </template>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { ONT_AUTH_MODES } from "@/utils/commonData";
import { regLength, regRange } from "@/utils/validator";
export default {
    name: "addOntForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["lineProfs", "srvProfs"])
    },
    props: {
        port_id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            ONT_AUTH_MODES,
            checked: false,
            form: {
                ont_id: 0,
                auth_mode: 0,
                ont_sn: "",
                loid: "",
                loid_password: "",
                ont_lineprofid: "",
                ont_srvprofid: ""
            },
            rules: {
                ont_id: [
                    {
                        validator: this.validateOntID,
                        trigger: ["change", "blur"]
                    }
                ],
                ont_sn: [
                    { validator: this.validateSn, trigger: ["change", "blur"] }
                ],
                loid: [
                    {
                        validator: this.validateLoid,
                        trigger: ["change", "blur"]
                    }
                ],
                loid_password: [
                    {
                        validator: this.validateLoidPass,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init(data) {
            this.$refs["add-ont-form"].resetFields();
            this.form.ont_lineprofid = this.lineProfs[0].profid;
            this.form.ont_srvprofid = this.srvProfs[0].profid;
            if (isDef(data)) {
                Object.keys(this.form).forEach(key => {
                    if (isDef(data[key])) {
                        this.form[key] = data[key];
                    }
                });
                this.form.ont_id = "";
                this.form.ont_sn = this.form.ont_sn.slice(
                    0,
                    this.form.ont_sn.indexOf("(")
                );
            }
        },
        validateOntID(rule, val, cb) {
            if (this.checked) {
                return cb();
            }
            if (!regRange(val, 0, 127)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 127)));
            }
            cb();
        },
        validateSn(rule, val, cb) {
            if (this.form.auth_mode !== 0) {
                return cb();
            }
            if (
                this.form.ont_sn.length !== 12 &&
                this.form.ont_sn.length !== 16
            ) {
                return cb(new Error("invalid sn"));
            }
            cb();
        },
        validateLoid(rule, val, cb) {
            if (this.form.auth_mode === 0) {
                return cb();
            }
            if (!regLength(val, 1, 24)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 24)));
            }
            cb();
        },
        validateLoidPass(rule, val, cb) {
            if (this.form.auth_mode !== 2) {
                return cb();
            }
            if (!regLength(val, 1, 12)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 12)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["add-ont-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, {
                            ...this.form,
                            identifier:
                                (this.port_id << 8) |
                                (this.checked ? 0xff : this.form.ont_id)
                        });
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        }
    },
    watch: {
        checked() {
            if (this.checked) {
                this.form.ont_id = "";
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>