<template>
    <el-form
        :model="form"
        ref="auto-temp-form"
        :rules="rules"
        label-width="140px"
    >
        <el-form-item :label="$lang('port_id')" prop="port_id">
            <el-select
                v-model.number="form.port_id"
                :disabled="selectAllPort || type === 'set'"
            >
                <el-option
                    :value="0"
                    :label="$lang('select_all')"
                    :disabled="!selectAllPort"
                ></el-option>
                <template v-for="i in system.ponports">
                    <el-option :value="i" :label="getPortName(i)"></el-option>
                </template>
            </el-select>
            <el-checkbox
                v-model="selectAllPort"
                v-if="type === 'add'"
                style="margin-left: 30px"
            >
                {{ $lang("select_all") }}
            </el-checkbox>
        </el-form-item>
        <el-form-item :label="$lang('gemport')" prop="gemport">
            <el-input
                v-model.number="form.gemport"
                style="width: 222px"
                :disabled="gemportFlag"
            ></el-input>
            <el-checkbox v-model="gemportFlag" style="margin-left: 30px">
                {{ $lang("not_concerned") }}
            </el-checkbox>
        </el-form-item>
        <el-form-item :label="$lang('new_svlan')" prop="new_svlan">
            <el-input v-model.number="form.new_svlan"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('tag_action')" prop="tag_action">
            <el-select v-model.number="form.tag_action">
                <el-option :value="0" label="-"></el-option>
                <template v-for="(item, index) in TAG_ACTIONS">
                    <el-option :value="Number(index)" :label="item"></el-option>
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
import { mapGetters, mapState } from "vuex";
import { TAG_ACTIONS } from "@/utils/commonData";
import { isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "autoTempForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["system"]),
        disabledInnervlan() {
            if (this.form.tag_action === 5 || this.form.tag_action === 4) {
                return false;
            }
            this.form.inner_vlan = "";
            return true;
        },
    },
    props: {
        type: {
            type: String,
        },
        data: {
            type: Object,
        },
        tempList: {
            type: Array,
        },
    },
    inject: ["validateVlan"],
    data() {
        return {
            TAG_ACTIONS,
            form: {
                port_id: 1,
                gemport: "",
                new_svlan: "",
                tag_action: 0,
                inner_vlan: "",
            },
            rules: {
                new_svlan: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"],
                    },
                ],
                inner_vlan: [
                    {
                        validator: this.validateInnervlan,
                        trigger: ["change", "blur"],
                    },
                ],
                gemport: [
                    {
                        validator: this.validGemport,
                        trigger: ["change", "blur"],
                    },
                ],
            },
            selectAllPort: false,
            cachePort: 0,
            gemportFlag: false,
        };
    },
    methods: {
        init() {
            this.$refs["auto-temp-form"].resetFields();
            this.selectAllPort = false;
            if (this.type === "add") {
                this.gemportFlag = true;
                this.form.port_id = 0;
                this.cachePort = 0;
            }
            if (this.type === "set") {
                Object.keys(this.form).forEach((key) => {
                    this.form[key] = this.data[key];
                });
                if (this.form.gemport) {
                    this.gemportFlag = false;
                } else {
                    this.gemportFlag = true;
                }
            }
        },
        validateInnervlan(rule, val, cb) {
            if (this.form.tag_action !== 4 && this.form.tag_action !== 5) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validate(fn) {
            this.$refs["auto-temp-form"].validate((valid) => {
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
            if (this.gemportFlag) {
                this.form.gemport = 0;
                return cb();
            }
            if (!regRange(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 32)));
            }
            cb();
        },
    },
    watch: {
        selectAllPort() {
            if (this.selectAllPort) {
                this.form.port_id = 0;
            } else {
                this.form.port_id = this.data.port_id || this.cachePort;
            }
        },
        "form.tag_action"() {
            this.$refs["auto-temp-form"].clearValidate("inner_vlan");
        },
    },
};
</script>

<style lang="less" scoped>
</style>