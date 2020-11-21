<template>
    <el-form inline ref="query-method">
        <el-form-item :label="$lang('query_method')"></el-form-item>
        <el-form-item>
            <el-select size="small" v-model.number="flags">
                <template v-for="(item, index) in MAC_FLAGS_MAP">
                    <el-option
                        :label="$lang(item)"
                        :value="Number(index)"
                    ></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="flags === 1">
            <el-form-item prop="mac_type">
                <el-select size="small" v-model.number="form.mac_type">
                    <template v-for="(item, index) in MAC_TYPE_MAP">
                        <el-option
                            :label="$lang(item)"
                            :value="index"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="flags === 2 || flags === 0x10">
            <el-form-item prop="port_id">
                <el-select size="small" v-model.number="form.port_id">
                    <el-option :value="0" :label="$lang('all')"></el-option>
                    <template v-for="item in portName">
                        <el-option
                            :label="item.name"
                            :value="item.port_id"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="flags === 0x10">
                <el-form-item :label="$lang('ont_id')">
                    <el-input v-model="form.ont_id" size="small"></el-input>
                </el-form-item>
            </template>
        </template>
        <template v-if="flags === 0x4">
            <el-form-item
                :label="$lang('start_vlan_id')"
                prop="vlan_id"
                key="vlan_id"
            >
                <el-input
                    size="small"
                    v-model.number="form.vlan_id"
                    style="width: 120px"
                ></el-input>
            </el-form-item>
            <el-form-item
                :label="$lang('end_vlan_id')"
                prop="vlan_id_e"
                key="vlan_id_e"
            >
                <el-input
                    size="small"
                    v-model.number="form.vlan_id_e"
                    style="width: 120px"
                ></el-input>
            </el-form-item>
        </template>
        <template v-if="flags === 0x8">
            <el-form-item :label="$lang('macaddr')" prop="macaddr">
                <el-input
                    size="small"
                    v-model.trim="form.macaddr"
                    style="width: 160px"
                    placeholder="e.x. 00:00:00:00:00:00"
                ></el-input>
            </el-form-item>
        </template>
        <template v-if="flags === 0x20">
            <el-form-item :label="$lang('svp_id')">
                <el-input v-model="form.svp_id"></el-input>
            </el-form-item>
        </template>
        <template v-if="flags === 0x40">
            <el-form-item :label="$lang('gemport')">
                <el-input v-model="form.gemport"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { MAC_FLAGS_MAP, MAC_TYPE_MAP } from "@/utils/commonData";
export default {
    name: "queryForm",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["portName"]),
    },
    props: {
        macList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            MAC_FLAGS_MAP: {
                0x1: "mac_type",
                0x2: "port_id",
                0x4: "vlan_id",
                0x8: "macaddr",
                0x10: "ont_id",
                0x20: "svp_id",
                0x40: "gemport",
            },
            MAC_TYPE_MAP,
            flags: 1,
            form: {
                mac_type: 3,
                port_id: 0,
                vlan_id: "",
                vlan_id_e: "",
                macaddr: "",
                ont_id: "",
                svp_id: "",
                gemport: "",
            },
        };
    },
    methods: {
        resetForm() {
            this.form = {
                mac_type: 3,
                port_id: 0,
                vlan_id: "",
                vlan_id_e: "",
                macaddr: "",
                ont_id: "",
                svp_id: "",
                gemport: "",
            };
        },
        filterable() {
            switch (this.flags) {
                case 0x1:
                    this.$emit(
                        "data-change",
                        this.macList.filter((item) => {
                            if (this.form.mac_type === 3) {
                                return true;
                            }
                            return item.mac_type === this.form.mac_type;
                        })
                    );
                    break;
                case 0x2:
                    this.$emit(
                        "data-change",
                        this.macList.filter((item) => {
                            if (this.form.port_id === 0) {
                                return true;
                            }
                            return item.port_id === this.form.port_id;
                        })
                    );
                    break;
                case 0x4:
                    this.$emit(
                        "data-change",
                        this.macList.filter((item) => {
                            // 只存在 vlan_id 时，返回包含当前输入的 vlan_id的项
                            // vlan_id 和 vlan_id_e 同时存在时，返回 vlan_id 在输入范围之内的项
                            return this.form.vlan_id
                                ? this.form.vlan_id_e
                                    ? item.vlan_id >= this.form.vlan_id &&
                                      item.vlan_id <= this.form.vlan_id_e
                                    : String(item.vlan_id).indexOf(
                                          this.form.vlan_id
                                      ) > -1
                                : true;
                        })
                    );
                    break;
                case 0x8:
                    this.$emit(
                        "data-change",
                        this.macList.filter(
                            (item) =>
                                item.macaddr.indexOf(this.form.macaddr) > -1
                        )
                    );
                    break;
                case 0x10:
                    this.$emit(
                        "data-change",
                        this.macList.filter((item) => {
                            if (this.form.port_id === 0) {
                                return true;
                            }
                            return (
                                item.port_id === this.form.port_id &&
                                String(item.ont_id).indexOf(this.form.ont_id) >
                                    -1
                            );
                        })
                    );
                    break;
                case 0x20:
                    this.$emit(
                        "data-change",
                        this.macList.filter(
                            (item) =>
                                String(item.svp_id).indexOf(this.form.svp_id) >
                                -1
                        )
                    );
                    break;
                case 0x40:
                    this.$emit(
                        "data-change",
                        this.macList.filter(
                            (item) =>
                                String(item.gemport).indexOf(
                                    this.form.gemport
                                ) > -1
                        )
                    );
                    break;
            }
        },
        refresh() {
            this.flags = 1;
            this.resetForm();
            this.filterable();
        },
    },
    watch: {
        flags() {
            this.resetForm();
            this.filterable();
        },
        form: {
            handler() {
                this.filterable();
            },
            deep: true,
        },
    },
};
</script>

<style lang="less" scoped>
</style>