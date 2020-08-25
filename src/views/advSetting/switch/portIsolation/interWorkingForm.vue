<template>
    <el-form label-width="120px">
        <el-form-item :label="$lang('ingress')">
            <el-select v-model.number="port_id">
                <template v-for="item in portName">
                    <el-option :value="item.port_id" :label="item.name"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="$lang('egress')">
            <nms-port-checkbox v-model="portlist" :disabled="disabled"></nms-port-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { parseStringAsList } from "@/utils/common";
export default {
    name: "interWorkingForm",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        ...mapState(["portName"])
    },
    data() {
        return {
            row: [],
            port_id: 0,
            portlist: []
        };
    },
    methods: {
        init(row) {
            this.row = row;
            this.port_id = row[0].port_id || 1;
        },
        disabled(port_id) {
            return port_id === this.port_id;
        },
        validate(fn) {
            fn.call(this, { portlist: this.portlist, port_id: this.port_id });
        }
    },
    watch: {
        port_id() {
            const str = this.row.filter(
                item => item.port_id === this.port_id
            )[0];
            if (str) {
                this.portlist = parseStringAsList(str.inter_working_portlist);
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>