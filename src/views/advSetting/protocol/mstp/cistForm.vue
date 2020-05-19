<template>
    <el-form label-width="150px" :model="form" ref="cist-form" :rules="rules">
        <template v-if="type === 'info'">
            <el-form-item :label="$lang('bridge_max_age')" prop="bridge_max_age">
                <el-input v-model.number="form.bridge_max_age"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('bridge_hello_time')" prop="bridge_hello_time">
                <el-input v-model.number="form.bridge_hello_time"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('max_hops')" prop="max_hops">
                <el-input v-model.number="form.max_hops"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('bridge_forward_delay')" prop="bridge_forward_delay">
                <el-input v-model.number="form.bridge_forward_delay"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'prio'">
            <el-form-item :label="$lang('bridge_prio')" prop="bridge_prio">
                <el-select v-model.number="form.bridge_prio">
                    <el-option :value="0"></el-option>
                    <template v-for="i in 15">
                        <el-option :value="i" :label="i * 4096"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'port'">
            <el-form-item :label="$lang('cist')" prop="mstid">
                <span>0</span>
            </el-form-item>
            <el-form-item :label="$lang('port_id')" prop="port_id">
                <span>{{ getPortName(form.port_id) }}</span>
            </el-form-item>
            <el-form-item :label="$lang('config')" prop="configFlag">
                <el-select v-model.number="configFlag">
                    <el-option :label="$lang('admin_external_cost')" :value="0"></el-option>
                    <el-option :label="$lang('port_priority')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="configFlag === 0">
                <el-form-item :label="$lang('admin_external_cost')" prop="admin_external_cost">
                    <el-input v-model.number="form.admin_external_cost"></el-input>
                </el-form-item>
            </template>
            <template v-if="configFlag === 1">
                <el-form-item :label="$lang('port_priority')" prop="port_priority">
                    <el-select v-model.number="form.port_priority">
                        <el-option :value="0"></el-option>
                        <template v-for="i in 15">
                            <el-option :value="i" :label="i * 16"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "mstpCist",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"])
    },
    data() {
        return {
            form: {
                bridge_max_age: "",
                bridge_hello_time: "",
                max_hops: "",
                bridge_forward_delay: "",
                port_id: 0,
                mstid: 0,
                admin_external_cost: "",
                port_priority: "",
                bridge_prio: 0
            },
            rules: {
                bridge_max_age: [
                    {
                        validator: this.validateMaxAge,
                        trigger: ["change", "blur"]
                    }
                ],
                bridge_hello_time: [
                    {
                        validator: this.validateHelloTime,
                        trigger: ["change", "blur"]
                    }
                ],
                max_hops: [
                    {
                        validator: this.validateMaxHops,
                        trigger: ["change", "blur"]
                    }
                ],
                bridge_forward_delay: [
                    {
                        validator: this.validateDelay,
                        trigger: ["change", "blur"]
                    }
                ],
                admin_external_cost: [
                    {
                        validator: this.validateCost,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            type: "",
            configFlag: 0,
            cacheData: {}
        };
    },
    methods: {
        init(type, data, row) {
            this.$refs["cist-form"].resetFields();
            this.configFlag = 0;
            this.type = type;
            if (type === "prio") {
                this.form.bridge_prio = Math.floor(data.bridge_prio / 4096);
                return;
            } else if (type === "port") {
                this.cacheData = JSON.parse(JSON.stringify(row));
            }
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                } else if (isDef(row) && isDef(row[key])) {
                    this.form[key] = row[key];
                    if (key === "port_priority") {
                        this.form[key] = row[key] || 0;
                    }
                }
            });
        },
        validateMaxAge(rule, val, cb) {
            if (!regRange(val, 6, 40)) {
                return cb(new Error(this.validateMsg("inputRange", 6, 40)));
            }
            cb();
        },
        validateHelloTime(rule, val, cb) {
            if (val === 20) return cb();
            if (!regRange(val, 1, 10)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 10)));
            }
            cb();
        },
        validateMaxHops(rule, val, cb) {
            if (!regRange(val, 1, 40)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 40)));
            }
            cb();
        },
        validateDelay(rule, val, cb) {
            if (!regRange(val, 4, 30)) {
                return cb(new Error(this.validateMsg("inputRange", 4, 30)));
            }
            cb();
        },
        validateCost(rule, val, cb) {
            if (!regRange(val, 0, 200000000)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 0, 200000000))
                );
            }
            cb();
        },
        validate(fn) {
            this.$refs["cist-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        if (this.type === "port") {
                            if (
                                (this.configFlag === 0 &&
                                    this.cacheData.admin_external_cost ===
                                        this.form.admin_external_cost) ||
                                (this.configFlag === 1 &&
                                    this.form.port_priority ===
                                        this.cacheData.port_priority)
                            ) {
                                return this.$message.info(
                                    this.$lang("modify_tips")
                                );
                            }
                        }
                        fn.call(this, this.type, {
                            ...this.form,
                            flag: this.configFlag
                        });
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        }
    },
    watch: {
        configFlag() {
            this.$refs["cist-form"].clearValidate("admin_external_cost");
        }
    }
};
</script>

<style lang="less" scoped>
</style>