<template>
    <el-form label-width="150px" ref="mstp-port-form" :model="form">
        <template v-if="type === 'bpdu_guard_port'">
            <el-form-item :label="$lang('bpdu_guard_port')" prop="bpdu_guard_port">
                <el-select v-model.number="form.bpdu_guard_port">
                    <el-option :value="0" :label="$lang('disable')"></el-option>
                    <el-option :value="1" :label="$lang('enable')"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'loop_detect_guard'">
            <el-form-item :label="$lang('loop_detect_guard')" prop="loop_detect_guard">
                <el-select v-model.number="form.loop_detect_guard">
                    <el-option :value="0" :label="$lang('disable')"></el-option>
                    <el-option :value="1" :label="$lang('enable')"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'admin_edge_port'">
            <el-form-item :label="$lang('admin_edge_port')" prop="admin_edge_port">
                <el-select v-model.number="form.admin_edge_port">
                    <el-option :value="0" label="Auto"></el-option>
                    <el-option :value="1" label="True"></el-option>
                    <el-option :value="2" label="False"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'admin_p2p'">
            <el-form-item :label="$lang('admin_p2p')" prop="admin_p2p">
                <el-select v-model.number="form.admin_p2p">
                    <el-option :value="0" label="Auto"></el-option>
                    <el-option :value="1" label="True"></el-option>
                    <el-option :value="2" label="False"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
export default {
    name: "mstpPortForm",
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            form: {
                bpdu_guard_port: 0,
                loop_detect_guard: 0,
                admin_edge_port: 0,
                admin_p2p: 0,
                port_id: 0
            },
            type: "",
            cacheData: {}
        };
    },
    methods: {
        init(type, data) {
            this.$refs["mstp-port-form"].resetFields();
            this.type = type;
            this.cacheData = JSON.parse(JSON.stringify(data));
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                }
            });
        },
        validate(fn) {
            if (isFunction(fn)) {
                const TYPES = [
                    "bpdu_guard_port",
                    "loop_detect_guard",
                    "admin_edge_port",
                    "admin_p2p"
                ];
                const flag = TYPES.every(
                    key => this.form[key] === this.cacheData[key]
                );
                if (flag) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
                fn.call(this, this.type, this.form);
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>