<template>
    <div class="page-header" :style="{ margin: type === 'none' ? '20px 0' : '' }">
        <h2>
            <slot name="title">{{ title }}</slot>
        </h2>
        <el-form inline :model="portData">
            <template v-if="type !== 'none'">
                <el-form-item :label="$lang('port_id')">
                    <el-select v-model.number="portData.port_id" size="small" style="width: 150px;">
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
                            <el-select
                                v-model.number="portData.onu_id"
                                filterable
                                size="small"
                                style="width: 150px;"
                            >
                                <template v-for="item in onuResource">
                                    <el-option :label="onuName(item)" :value="item"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item :label="$lang('no_onu_info')" style="margin-left: 30px;"></el-form-item>
                    </template>
                </template>
            </template>
            <template>
                <el-form-item>
                    <slot name="content"></slot>
                </el-form-item>
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
            default: 0xffff
        },
        title: {
            type: String
        }
    },
    data() {
        return {
            portData: {
                port_id: 0,
                onu_id: 0xffff
            }
        };
    },
    mounted() {
        if (this.portid) {
            this.portData.port_id = this.portid;
        } else {
            if (this.type === "uplink") {
                this.portData.port_id = this.ponports + 1;
            } else {
                this.portData.port_id = this.port[0] ? this.port[0].port_id : 1;
            }
        }
    },
    methods: {
        ...mapActions(["getOnuResource"]),
        onuName(onu_id) {
            // return `ONT${this.portData.port_id}/${onu_id}`;
            return onu_id;
        }
    },
    watch: {
        onuResource() {
            if (this.onuResource.length) {
                if (this.onuid !== 0xffff) {
                    this.portData.onu_id = this.onuid;
                } else {
                    // 没有传入onu id时，取onu列表第一项
                    this.portData.onu_id = this.onuResource[0];
                }
            } else {
                // onuResource无值时，表明当前pon口下没有onu，将onu id置 0xffff
                // GPON 规则不一致，ont_id 起始为 0
                this.$emit("port-change", this.portData.port_id, 0xffff);
            }
        },
        "portData.port_id"(nv, ov) {
            if (nv === ov) return;
            if (!this.hasOnu) {
                this.$emit("port-change", this.portData.port_id);
            } else {
                this.portData.onu_id = 0xffff;
                this.getOnuResource(this.portData.port_id);
            }
        },
        "portData.onu_id"() {
            if (this.portData.onu_id === 0xffff) {
                return;
            }
            this.$emit(
                "port-change",
                this.portData.port_id,
                this.portData.onu_id
            );
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