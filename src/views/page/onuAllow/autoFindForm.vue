<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="auto-find-form">
        <el-form-item :label="$lang('ont_lineprofid')" prop="ont_lineprofid">
            <el-select v-model.number="form.ont_lineprofid">
                <template v-for="item in lineProfs">
                    <el-option :value="item.profid" :label="item.profname"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('ont_srvprofid')" prop="ont_srvprofid">
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
import { isFunction } from "@/utils/common";
export default {
    name: "autoFindForm",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["lineProfs", "srvProfs"])
    },
    data() {
        return {
            form: {
                ont_lineprofid: 0,
                ont_srvprofid: 0
            },
            rules: {}
        };
    },
    methods: {
        init() {
            this.form.ont_lineprofid = this.lineProfs[0].profid;
            this.form.ont_srvprofid = this.srvProfs[0].profid;
        },
        validate(fn) {
            if (isFunction(fn)) {
                fn.call(this, this.form);
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>