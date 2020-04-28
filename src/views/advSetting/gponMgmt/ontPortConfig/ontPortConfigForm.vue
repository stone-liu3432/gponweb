<template>
    <el-form :model="form" label-width="140px" ref="ont-port-config-form">
        <el-form-item :label="$lang('uniport')" prop="uniport">{{ form.uniport }}</el-form-item>
        <el-form-item :label="$lang('epspeed')" prop="epspeed">
            <el-select v-model.number="form.epspeed">
                <el-option label="10" :value="10"></el-option>
                <el-option label="100" :value="100"></el-option>
                <el-option label="1000" :value="1000"></el-option>
                <el-option label="Auto-neg" :value="0xffff"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('epduplex')" prop="epduplex">
            <el-select v-model.number="form.epduplex">
                <el-option :label="$lang('full')" :value="0"></el-option>
                <el-option :label="$lang('half')" :value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('epautoneg')" prop="epautoneg">
            <el-select v-model.number="form.epautoneg">
                <el-option :label="$lang('enable')" :value="0"></el-option>
                <el-option :label="$lang('disable')" :value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('adminstate')" prop="adminstate">
            <el-select v-model.number="form.adminstate">
                <el-option :label="$lang('enable')" :value="0"></el-option>
                <el-option :label="$lang('disable')" :value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('flow_ctrl')" prop="flow_ctrl">
            <el-select v-model.number="form.flow_ctrl">
                <el-option :label="$lang('enable')" :value="0"></el-option>
                <el-option :label="$lang('disable')" :value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('ring')" prop="ring">
            <el-select v-model.number="form.ring">
                <el-option :label="$lang('on')" :value="1"></el-option>
                <el-option :label="$lang('off')" :value="2"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
export default {
    name: "ontPortConfigForm",
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            form: {
                uniport: "",
                epspeed: 1000,
                epduplex: 0,
                epautoneg: 1,
                adminstate: 1,
                flow_ctrl: 1,
                ring: 1
            },
            flags: 0,
            cacheData: null
        };
    },
    methods: {
        init(data) {
            this.$refs["ont-port-config-form"].resetFields();
            this.flags = 0;
            this.cacheData = JSON.parse(JSON.stringify(data));
            Object.keys(this.form).forEach(key => {
                if (isDef(data[key])) {
                    this.form[key] = data[key];
                }
            });
        },
        validate(fn) {
            if (isFunction(fn)) {
                if (
                    Object.keys(this.form).every(
                        key => this.form[key] === this.cacheData[key]
                    )
                ) {
                    this.$message.info(this.$lang("modify_tips"));
                    return fn.call(this);
                }
                const FLAGS = {
                    epspeed: 0x1,
                    epduplex: 0x1,
                    flow_ctrl: 0x2,
                    epautoneg: 0x4,
                    adminstate: 0x8,
                    ring: 0x10
                };
                const flags = Object.keys(FLAGS).reduce((prev, key) => {
                    if (this.form[key] !== this.cacheData[key]) {
                        if ((prev & FLAGS[key]) !== FLAGS[key]) {
                            return prev | FLAGS[key];
                        }
                    }
                    return prev;
                }, 0);
                fn.call(this, {
                    flags,
                    unitype: this.cacheData.unitype,
                    ...this.form
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>