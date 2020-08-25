<template>
    <el-form label-width="200px">
        <el-form-item :label="label">
            <nms-port-checkbox :type="type" v-model="portlist" :disabled="disabled"></nms-port-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isFunction } from "@/utils/common";
export default {
    name: "portIsolationForm",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["port", "system"]),
        label() {
            return this.type === "pon"
                ? this.$lang("pon_isolate_portlist")
                : this.$lang("uplink_isolate_portlist");
        },
        ports() {
            const ponports = this.system.ponports >>> 0;
            return this.type === "pon"
                ? this.port.slice(0, ponports)
                : this.port.slice(ponports);
        }
    },
    props: {
        type: {
            type: String
        },
        action: {
            type: String
        },
        list: {
            type: Array
        }
    },
    data() {
        return {
            portlist: []
        };
    },
    methods: {
        init() {
            this.portlist = this.list;
        },
        disabled(port_id) {
            return this.action === "add"
                ? this.list.includes(port_id)
                : !this.list.includes(port_id);
        },
        validate(fn) {
            const ol = this.list.length,
                nl = this.portlist.length;
            let str = "";
            if (this.action === "add") {
                if (ol < nl) {
                    str = this.portlist
                        .filter(item => !this.list.includes(item))
                        .sort((a, b) => a - b)
                        .join(",");
                }
            }
            if (this.action === "delete") {
                if (nl > 0) {
                    str = this.portlist.sort((a, b) => a - b).join(",");
                }
            }
            if (isFunction(fn)) {
                return fn.call(this, str);
            }
            return Promise.resolve(str);
        }
    }
};
</script>

<style lang="less" scoped>
</style>