<template>
    <el-form :model="form" ref="msti-form" label-width="150px" :rules="rules">
        <el-form-item :label="`${$lang('instance')} ID`" prop="mstid">
            <span v-if="type !== 'create'">{{ form.mstid }}</span>
            <template v-else>
                <el-select v-model="form.mstid">
                    <template v-for="i in 15">
                        <el-option :value="i"></el-option>
                    </template>
                </el-select>
            </template>
        </el-form-item>
        <template v-if="type === 'add' || type === 'delete' || type === 'create'">
            <el-form-item :label="$lang('vlan_list')" prop="vlan_list">
                <el-input v-model.trim="form.vlan_list"></el-input>
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
            <el-form-item :label="$lang('port_id')" prop="port_id">{{ getPortName(form.port_id) }}</el-form-item>
            <el-form-item :label="$lang('admin_internal_cost')" prop="admin_internal_cost">
                <el-input v-model.number="form.admin_internal_cost"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('port_priority')" prop="port_priority">
                <el-select v-model.number="form.port_priority">
                    <el-option :value="0"></el-option>
                    <template v-for="i in 15">
                        <el-option :value="i" :label="i * 16"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "mstiForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"])
    },
    data() {
        return {
            type: "",
            form: {
                vlan_list: "",
                bridge_prio: "",
                port_id: 0,
                mstid: 0,
                admin_internal_cost: "",
                port_priority: 0
            },
            rules: {
                vlan_list: [
                    {
                        validator: this.validateVlanlist,
                        trigger: ["change", "blur"]
                    }
                ],
                admin_internal_cost: [
                    {
                        validator: this.validateCost,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            cacheData: {}
        };
    },
    methods: {
        init(type, row, data) {
            this.$refs["msti-form"].resetFields();
            this.type = type;
            if (type === "create") {
                this.form.mstid = 1;
            }
            if (isDef(row)) {
                this.form.mstid = row.mstid;
                if (type === "add") {
                    this.form.vlan_list = "";
                }
                if (type === "delete") {
                    this.form.vlan_list = row.msti_vlanlist;
                }
                if (type === "prio") {
                    this.form.bridge_prio = Math.floor(row.bridge_prio / 4096);
                }
                if (type === "port") {
                    this.cacheData = JSON.parse(JSON.stringify(data));
                    Object.keys(this.form).forEach(key => {
                        if (isDef(data[key])) {
                            this.form[key] = data[key];
                        }
                    });
                    this.form.port_priority = data.port_priority / 16 || 0;
                }
            }
        },
        validateCost(rule, val, cb) {
            if (!regRange(val, 0, 200000000)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 0, 200000000))
                );
            }
            cb();
        },
        validateVlanlist(rule, val, cb) {
            const reg = /^\d+[-\d,]*$/;
            if (!reg.test(val)) {
                return cb(new Error("ex: 1,3-5,8"));
            }
            cb();
        },
        validate(fn) {
            this.$refs["msti-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        if (this.type === "port") {
                            if (
                                this.form.admin_internal_cost ===
                                    this.cacheData.admin_internal_cost &&
                                this.form.port_priority ===
                                    this.cacheData.port_priority / 16
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                        }
                        fn.call(this, this.type, {
                            ...this.form,
                            set_admin_internal_cost:
                                this.form.admin_internal_cost ===
                                this.cacheData.admin_internal_cost
                                    ? 0
                                    : 1,
                            set_port_priority:
                                this.form.port_priority ===
                                this.cacheData.port_priority / 16
                                    ? 0
                                    : 1
                        });
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>