<template>
    <el-form
        label-width="150px"
        :model="formData"
        :rules="rules"
        ref="port-vlan-config-form"
    >
        <el-form-item :label="$lang('port_id')">{{
            getPortName(data.port_id)
        }}</el-form-item>
        <template v-if="type === 'port_type'">
            <el-form-item :label="$lang('port_type')">
                <el-select v-model.number="formData.port_type">
                    <template v-for="(item, index) in PORT_TYPE_MAP">
                        <el-option
                            :label="item"
                            :value="Number(index)"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-else>
            <el-form-item :label="$lang('port_type')" v-if="type !== 'pvid'">
                {{ PORT_TYPE_MAP[data.port_type] }}
            </el-form-item>
            <el-form-item :label="$lang('pvid')" prop="pvid">
                <template v-if="type === 'pvid'">
                    <el-input v-model.number="formData.pvid"></el-input>
                </template>
                <template v-else>{{ data.pvid }}</template>
            </el-form-item>
            <el-form-item :label="$lang('priority')" prop="priority">
                <template v-if="type === 'pvid'">
                    <el-select v-model.number="formData.priority">
                        <el-option :value="0"></el-option>
                        <template v-for="i in 7">
                            <el-option :value="i"></el-option>
                        </template>
                        <el-option label="-" :value="8"></el-option>
                    </el-select>
                </template>
                <template v-else>{{ data.priority }}</template>
            </el-form-item>
            <el-form-item
                :label="$lang('vlan_list')"
                prop="vlanlist"
                v-if="type !== 'pvid'"
            >
                <el-input v-model="formData.vlanlist"></el-input>
            </el-form-item>
            <el-form-item
                :label="$lang('vlan_mode')"
                v-if="type !== 'pvid' && data.port_type !== 2"
            >
                <el-select
                    v-model.number="formData.vlan_mode"
                    :disabled="data.port_type === 2"
                >
                    <el-option :label="$lang('tagged')" :value="1"></el-option>
                    <el-option
                        :label="$lang('untagged')"
                        :value="2"
                    ></el-option>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { PORT_TYPE_MAP } from "@/utils/commonData";
export default {
    name: "vlanConfigForm",
    props: {
        type: {
            type: String,
        },
        data: {
            type: Object,
        },
    },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
    },
    inject: ["validateVlan"],
    data() {
        return {
            PORT_TYPE_MAP,
            formData: {
                port_id: 0,
                port_type: 1,
                pvid: "",
                vlanlist: "",
                vlan_mode: 1,
                priority: 8,
            },
            rules: {
                pvid: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"],
                    },
                ],
                vlanlist: [
                    {
                        validator: this.validateVlanList,
                        trigger: ["change", "blur"],
                    },
                ],
            },
        };
    },
    methods: {
        validateVlanList(rule, val, cb) {
            val = val.replace(/(,|\-)+/g, "$1");
            if (val !== this.formData.vlanlist) {
                this.formData.vlanlist = val;
            }
            const reg = /^(\d[\d,\-]+)?\d+$/;
            if (!reg.test(val)) {
                return cb(new Error("ex. 1 or 1-3 or 1,3-6,11"));
            }
            cb();
        },
        init() {
            Object.keys(this.formData).forEach((key) => {
                if (isDef(this.data[key])) {
                    this.formData[key] = this.data[key];
                }
            });
            if (this.data.port_type === 2) {
                this.formData.vlan_mode = 1;
            }
            this.formData.vlanlist = "";
            this.$nextTick((_) => {
                this.$refs["port-vlan-config-form"].clearValidate("vlanlist");
            });
        },
        validate(fn) {
            const cb = this.$refs["port-vlan-config-form"].validate;
            if (isFunction(fn)) {
                cb((valid) => {
                    if (valid) {
                        fn.call(this, this.formData);
                    } else {
                        fn.call(this, valid);
                    }
                });
            } else {
                return cb();
            }
        },
    },
};
</script>

<style lang="less" scoped>
</style>