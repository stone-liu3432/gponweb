<template>
    <div>
        <el-checkbox-group v-model="checkList">
            <template v-for="item in portName">
                <template v-if="showItem(item)">
                    <el-checkbox
                        :label="item.port_id"
                        :disabled="disabledItem(item.port_id)"
                    >{{ item.name }}</el-checkbox>
                </template>
            </template>
        </el-checkbox-group>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { removeItem, isArray, isFunction, distinctArray } from "@/utils/common";
export default {
    name: "nmsPortCheckbox",
    computed: {
        ...mapState(["portName", "port", "system"]),
        ...mapGetters(["$lang"]),
        //  lag 组里存在的 port_id
        lagMap() {
            return this.port.reduce((pre, item) => {
                if (item.link_aggregation) {
                    if (!pre[item.link_aggregation]) {
                        pre[item.link_aggregation] = [];
                    }
                    pre[item.link_aggregation].push(item.port_id);
                }
                return pre;
            }, {});
        },
        // port id 对应的 lag组
        portLagMap() {
            return this.port.reduce((pre, item) => {
                if (item.link_aggregation) {
                    pre[item.port_id] = item.link_aggregation;
                }
                return pre;
            }, {});
        }
    },
    model: {
        prop: "list",
        event: "change"
    },
    props: {
        type: {
            type: String,
            default: "port",
            validator: val => ["port", "pon", "uplink"].includes(val)
        },
        list: {
            type: Array,
            default: _ => []
        },
        disabled: {
            type: Function
        }
    },
    data() {
        return {
            checkList: []
        };
    },
    created() {
        this.checkList = this.list;
    },
    methods: {
        showItem(item) {
            return this.type === "pon"
                ? item.port_id <= this.system.ponports
                : this.type === "uplink"
                ? item.port_id > this.system.ponports
                : true;
        },
        disabledItem(port_id) {
            return isFunction(this.disabled) ? !!this.disabled(port_id) : false;
        }
    },
    watch: {
        list() {
            if (this.checkList !== this.list) {
                this.checkList = this.list;
            }
        },
        checkList(nv, ov) {
            const ports = distinctArray(nv, ov);
            if (!ports.length) {
                return;
            }
            ports.forEach(port => {
                if (this.portLagMap[port]) {
                    const lag = this.lagMap[this.portLagMap[port]];
                    if (isArray(lag)) {
                        lag.forEach(item => {
                            if (nv.length > ov.length) {
                                if (item !== port) {
                                    this.checkList.push(item);
                                }
                            } else {
                                removeItem(this.checkList, item);
                            }
                        });
                    }
                }
            });
            this.checkList.sort((a, b) => a - b);
            this.$emit("change", this.checkList);
        }
    }
};
</script>

<style lang="less" scoped>
</style>