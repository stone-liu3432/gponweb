<template>
    <div class="page-header">
        <h2>
            <slot name="title">{{ title }}</slot>
        </h2>
        <el-form inline :model="portData" v-if="type !== 'none'">
            <el-form-item :label="$lang('port_id')">
                <el-select v-model.number="portData.port_id">
                    <template v-if="type === 'pon' || type === 'port'">
                        <template v-for="item in ponData">
                            <el-option :value="item.port_id" :label="getPortName(item.port_id)"></el-option>
                        </template>
                    </template>
                    <template v-if="type === 'uplink' || type === 'port'">
                        <template v-for="item in uplinkData">
                            <el-option :value="item.port_id" :label="getPortName(item.port_id)"></el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="hasOnu">
                <template v-if="!!onuResource.length">
                    <el-form-item :label="$lang('onu_id')" style="margin-left: 30px;">
                        <el-select v-model.number="portData.onu_id">
                            <template v-for="item in onuResource">
                                <el-option :label="composeOnuName(item)" :value="item"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item :label="$lang('no_onu_info')" style="margin-left: 30px;"></el-form-item>
                </template>
            </template>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "page-header",
    computed: {
        ...mapState(["system", "port", "onuResource"]),
        ...mapGetters(["getPortName", "$lang"]),
        ponports() {
            return this.system.ponports >>> 0;
        },
        ponData() {
            return this.port.slice(0, this.ponports);
        },
        uplinkData() {
            return this.port.slice(this.ponports);
        }
    },
    props: {
        type: {
            type: String,
            default: "port",
            validator: val => ["none", "pon", "uplink", "port"].includes(val)
        },
        hasOnu: {
            type: Boolean,
            default: false
        },
        portid: {
            type: Number,
            default: 0
        },
        onuid: {
            type: Number,
            default: 0
        },
        title: {
            type: String
        }
    },
    data() {
        return {
            portData: {
                port_id: "",
                onu_id: ""
            }
        };
    },
    mounted() {
        if (this.portid) {
            this.portData.port_id = this.portid;
        } else {
            this.portData.port_id = this.port[0] ? this.port[0].port_id : 1;
        }
    },
    methods: {
        ...mapActions(["getOnuResource"]),
        composeOnuName(onu_id) {
            return `ONU${this.portData.port_id}/${onu_id}`;
        }
    },
    watch: {
        onuResource() {
            if (this.onuResource.length) {
                if (!this.onuid) {
                    // 没有传入onu id时，取onu列表第一项
                    this.portData.onu_id = this.onuResource[0];
                } else {
                    if (!this.portData.onu_id) {
                        // 传入onu id，并且当前不存在onu id时，取传入的onu id
                        this.portData.onu_id = this.onuid;
                    } else {
                        // 当前存在onu id时，表明是切换pon口，此时忽略传入的onu id
                        this.portData.onu_id = this.onuResource[0];
                    }
                }
                this.$emit(
                    "port-change",
                    this.portData.port_id,
                    this.portData.onu_id
                );
            } else {
                // onuResource无值时，表明当前pon口下没有onu，将onu id置0
                this.$emit("port-change", this.portData.port_id, 0);
            }
        },
        "portData.port_id"(nv, ov) {
            if (nv === ov) return;
            if (!this.hasOnu) {
                this.$emit("port-change", this.portData.port_id);
            } else {
                this.getOnuResource(this.portData.port_id);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.page-header {
    margin: 10px 0;
    h2 {
        color: @titleColor;
        float: left;
        min-width: 300px;
        margin: 0;
    }
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}
</style>