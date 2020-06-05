<template>
    <el-form inline ref="query-method" :model="form" :rules="rules">
        <el-form-item :label="$lang('query_method')"></el-form-item>
        <el-form-item prop="flags">
            <el-select v-model.number="form.flags">
                <template v-for="(item, index) in MAC_FLAGS_MAP">
                    <el-option :label="$lang(item)" :value="index >>> 0"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="form.flags === 1">
            <el-form-item prop="mac_type">
                <el-select v-model.number="form.mac_type">
                    <template v-for="(item, index) in MAC_TYPE_MAP">
                        <el-option :label="$lang(item)" :value="index"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="form.flags === 2">
            <el-form-item prop="port_id">
                <el-select v-model.number="form.port_id">
                    <template v-for="item in portName">
                        <el-option :label="item.name" :value="item.port_id"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="form.flags === 4">
            <el-form-item :label="$lang('start_vlan_id')" prop="vlan_id" key="vlan_id">
                <el-input v-model.number="form.vlan_id" style="width: 120px;"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('end_vlan_id')" prop="vlan_id_e" key="vlan_id_e">
                <el-input v-model.number="form.vlan_id_e" style="width: 120px;"></el-input>
            </el-form-item>
        </template>
        <template v-if="form.flags === 8">
            <el-form-item :label="$lang('macaddr')" prop="macaddr">
                <el-input
                    v-model.trim="form.macaddr"
                    style="width: 160px;"
                    placeholder="e.x. 00:00:00:00:00:00"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$lang('macmask')" prop="macmask">
                <el-input
                    v-model.trim="form.macmask"
                    style="width: 160px;"
                    placeholder="e.x. 00:00:00:00:00:00"
                ></el-input>
            </el-form-item>
        </template>
        <el-form-item prop="action">
            <el-button
                type="primary"
                size="mini"
                @click="refreshData('query-method')"
            >{{ $lang('apply') }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { MAC_FLAGS_MAP, MAC_TYPE_MAP } from "@/utils/commonData";
export default {
    name: "queryForm",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["portName"])
    },
    data() {
        return {
            MAC_FLAGS_MAP,
            MAC_TYPE_MAP,
            form: {
                flags: 1,
                count: 0,
                mac_type: 3,
                port_id: 1,
                vlan_id: "",
                vlan_id_e: "",
                macaddr: "",
                macmask: ""
            },
            rules: {
                vlan_id: [
                    {
                        validator: this.validateSvlan,
                        trigger: ["change", "blur"]
                    }
                ],
                vlan_id_e: [
                    {
                        validator: this.validateEvlan,
                        trigger: ["change", "blur"]
                    }
                ],
                macaddr: [
                    {
                        validator: this.validateMacaddr,
                        trigger: ["change", "blur"]
                    }
                ],
                macmask: [
                    {
                        validator: this.validateMacmask,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    inject: ["validateVlan", "validateMac"],
    created() {
        this.getList();
    },
    methods: {
        refreshData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.form.flags === 4) {
                        if (!this.form.vlan_id_e) {
                            this.form.vlan_id_e = this.form.vlan_id;
                        }
                        if (this.form.vlan_id_e < this.form.vlan_id) {
                            const ev = this.form.vlan_id_e;
                            this.form.vlan_id_e = this.form.vlan_id;
                            this.form.vlan_id = ev;
                        }
                    }
                    this.form.count = 0;
                    this.getList();
                }
            });
        },
        validateSvlan(rule, val, cb) {
            if (this.form.flags !== 4) {
                return cb();
            }
            this.validateVlan(rule, val, cb);
        },
        validateEvlan(rule, val, cb) {
            if (this.form.flags !== 4 || !this.form.vlan_id_e) {
                return cb();
            }
            this.validateVlan(rule, val, cb);
        },
        validateMacaddr(rule, val, cb) {
            if (this.form.flags !== 8) {
                return cb();
            }
            this.validateMac(rule, val, cb);
        },
        validateMacmask(rule, val, cb) {
            if (this.form.flags !== 8) {
                return cb();
            }
            this.validateMac(rule, val, cb);
        },
        getList() {
            this.$emit("refresh-data", this.form);
        },
        loadMore() {
            const count = this.form.count;
            this.form.count = count + 1;
            this.getList();
        },
        getData() {
            this.form.flags = 1;
            this.form.count = 0;
            this.form.mac_type = 3;
            this.getList();
        }
    },
    watch: {
        "form.flags"(val, oldVal) {
            this.$refs["query-method"].clearValidate();
            if (oldVal === 4) {
                this.form.vlan_id = "";
                this.form.vlan_id_e = "";
            }
            if (oldVal === 8) {
                this.form.macaddr = "";
                this.form.macmask = "";
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>