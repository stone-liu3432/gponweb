<template>
    <el-form :model="form" :rules="rules" label-width="140px" ref="mac-form">
        <template v-if="type === 'add'">
            <el-form-item :label="$lang('mac_type')" prop="mac_type">
                <el-select v-model.number="form.mac_type">
                    <el-option :label="$lang('static')" :value="1"></el-option>
                    <el-option :label="$lang('blackhole')" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('macaddr')" prop="macaddr">
                <el-input v-model.trim="form.macaddr"></el-input>
            </el-form-item>
            <template v-if="form.mac_type === 1">
                <el-form-item :label="$lang('port_type')" prop="port_type">
                    <el-select v-model.number="form.port_type">
                        <el-option :label="$lang('port')" :value="0"></el-option>
                        <el-option :label="$lang('virtual_port')" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="form.port_type === 0">
                    <el-form-item :label="$lang('port_id')" prop="port_id">
                        <el-select v-model.number="form.port_id" key="port_id">
                            <template v-for="item in portName">
                                <el-option :label="item.name" :value="item.port_id"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-if="form.port_type === 1">
                    <el-form-item :label="$lang('svp_id')" prop="svp_id" key="svp_id">
                        <el-input v-model.number="form.svp_id"></el-input>
                    </el-form-item>
                </template>
            </template>
            <template v-if="form.mac_type === 2 || (form.mac_type === 1 && form.port_type === 0)">
                <el-form-item :label="$lang('vlan_id')" prop="vlan_id" key="vlan_id">
                    <el-input v-model.number="form.vlan_id"></el-input>
                </el-form-item>
            </template>
        </template>
        <template v-if="type === 'flush'">
            <el-form-item :label="$lang('flush_way')" prop="flags">
                <el-select v-model.number="form.flags">
                    <template v-for="(item, index) in MAC_FLAGS_MAP">
                        <el-option :label="$lang(item)" :value="Number(index)"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('mac_type')" prop="mac_type">
                <el-select v-model.number="form.mac_type">
                    <template v-for="(item, index) in MAC_TYPE_MAP">
                        <template v-if="!(form.flags === 2 && index === 2)">
                            <el-option :label="$lang(item)" :value="index"></el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="form.flags === 4">
                <el-form-item :label="$lang('vlan_id')" prop="vlan_id">
                    <el-input v-model.number="form.vlan_id"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.flags === 2">
                <el-form-item :label="$lang('port_list')" prop="port_list">
                    <el-checkbox-group v-model="form.port_list">
                        <template v-for="item in portName">
                            <el-checkbox :label="item.port_id">{{ item.name }}</el-checkbox>
                        </template>
                    </el-checkbox-group>
                </el-form-item>
            </template>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { MAC_TYPE_MAP, MAC_FLAGS_MAP } from "@/utils/commonData";
import { isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "macForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["portName"])
    },
    inject: ["validateMac", "validateVlan"],
    data() {
        // 清除 mac 地址时，无需 mac 地址输入项
        delete MAC_FLAGS_MAP[8];
        return {
            MAC_TYPE_MAP,
            MAC_FLAGS_MAP,
            form: {
                flags: 1,
                mac_type: 3,
                vlan_id: "",
                port_list: [],
                macaddr: "",
                port_id: 1,
                svp_id: "",
                port_type: 0 // 0: port_id, 1: virtual_port
            },
            rules: {
                vlan_id: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                macaddr: [
                    { validator: this.validateMac, trigger: ["change", "blur"] }
                ],
                svp_id: [
                    {
                        validator: this.validateSvpid,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            type: ""
        };
    },
    methods: {
        init(type) {
            this.$refs["mac-form"].resetFields();
            this.type = type;
            if (type === "add") {
                this.form.mac_type = 1;
            } else {
                this.form.flags = 1;
                this.form.mac_type = 3;
            }
        },
        validateSvpid(rule, val, cb) {
            if (this.type !== "add" || this.form.mac_type !== 1) {
                return cb();
            }
            if (!regRange(val, 0, 8190)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 8190)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["mac-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        if (
                            this.type === "flush" &&
                            this.form.flags === 2 &&
                            !this.form.port_list.length
                        ) {
                            return this.$message.error(
                                `${this.$lang("required")}: ${this.$lang(
                                    "port_list"
                                )}`
                            );
                        }
                        fn.call(this, this.type, this.form);
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        }
    },
    watch: {
        "form.flags"(val, oldVal) {
            this.$refs["mac-form"].clearValidate();
            if (oldVal === 4) {
                this.form.vlan_id = "";
            }
            if (oldVal === 2) {
                this.form.port_list = [];
            }
        },
        "form.mac_type"() {
            if (this.type === "add") {
                this.$refs["mac-form"].clearValidate();
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>