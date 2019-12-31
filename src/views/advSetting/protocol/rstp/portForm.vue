<template>
    <el-form label-width="150px" :model="form" :rules="rules" ref="rstp-port-form">
        <el-form-item :label="$lang('port_id')">
            <span style="margin-left: 12px;">{{ getPortName(formData.port_id) }}</span>
        </el-form-item>
        <el-form-item :label="$lang('port_priority')">
            <el-select v-model.number="form.port_priority">
                <template v-for="item in pris">
                    <el-option :value="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('port_path_cost')" prop="port_path_cost">
            <el-input v-model="form.port_path_cost"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('edge_status')">
            <el-select v-model.number="form.edge_status">
                <el-option :value="0" label="NEdge"></el-option>
                <el-option :value="1" label="Edge"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('admin_link_type')">
            <el-select v-model.number="form.admin_link_type">
                <el-option value="auto" label="Auto"></el-option>
                <el-option value="force_true" label="P2P"></el-option>
                <el-option value="force_false" label="Shared"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
export default {
    name: "portForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"])
    },
    props: {
        formData: {
            type: Object
        }
    },
    data() {
        return {
            pris: [
                0,
                16,
                32,
                48,
                64,
                80,
                96,
                112,
                128,
                144,
                160,
                176,
                192,
                208,
                224,
                240
            ],
            form: {
                port_id: 0,
                port_priority: 0,
                port_path_cost: "",
                edge_status: 0,
                admin_link_type: 0
            },
            rules: {
                port_path_cost: [
                    {
                        validator: this.validatePortPathCost,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init() {
            Object.keys(this.form).forEach(key => {
                if (isDef(this.formData[key])) {
                    this.form[key] = this.formData[key];
                }
            });
        },
        validatePortPathCost(rule, val, cb) {
            const v = val >>> 0;
            if (v < 0 || v > 200000000 || isNaN(val)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 0, 200000000))
                );
            }
            cb();
        },
        validate(fn) {
            const cb = this.$refs["rstp-port-form"].validate;
            if (isFunction(fn)) {
                cb(valid => {
                    if (valid) {
                        fn.call(this, this.form);
                    } else {
                        fn.call(this, valid);
                    }
                });
            } else {
                return cb();
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>