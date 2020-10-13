<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="vlan-form">
        <el-form-item :label="$lang('vlan_id')" prop="vlan_id">
            <template
                v-if="
                    type !== 'config' &&
                        type !== 'port_default_vlan' &&
                        type !== 'name' &&
                        type !== 'desc'
                "
            >
                <el-input
                    size="small"
                    v-model.number="form.vlanid_s"
                    v-validator="form.vlanid_s"
                    style="width: 120px;"
                ></el-input>
                <span style="margin: 0 6px;">-</span>
                <el-input
                    size="small"
                    v-model.number="form.vlanid_e"
                    v-validator="form.vlanid_e"
                    style="width: 120px;"
                ></el-input>
                <span class="vlan-form-tips">{{
                    $lang("vlanid_range_hit")
                }}</span>
            </template>
            <template v-else>
                <span style="margin-left: 12px;">{{ form.vlanid_s }}</span>
            </template>
        </el-form-item>
        <template
            v-if="
                type !== 'delete' &&
                    type !== 'port_default_vlan' &&
                    type !== 'name' &&
                    type !== 'desc'
            "
        >
            <el-form-item
                :label="$lang('tagged_portlist') + ':'"
                prop="tagged_portlist"
            >
                <nms-port-checkbox
                    v-model="form.tagged_portlist"
                    type="uplink"
                    :disabled="disabledItem"
                ></nms-port-checkbox>
            </el-form-item>
            <el-form-item
                :label="$lang('untagged_portlist') + ':'"
                prop="untagged_portlist"
            >
                <nms-port-checkbox
                    v-model="form.untagged_portlist"
                    type="uplink"
                    :disabled="disabledItem"
                ></nms-port-checkbox>
            </el-form-item>
        </template>
        <template v-if="type === 'port_default_vlan'">
            <el-form-item
                :label="$lang('default_vlan_portlist') + ':'"
                prop="default_vlan_portlist"
                label-width="160px"
            >
                <nms-port-checkbox
                    type="uplink"
                    v-model="form.default_vlan_portlist"
                ></nms-port-checkbox>
            </el-form-item>
        </template>
        <template v-if="type === 'name'">
            <el-form-item :label="$lang('name')" prop="vlan_name" key="name">
                <el-input v-model="form.vlan_name"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'desc'">
            <el-form-item :label="$lang('desc')" prop="vlan_desc" key="desc">
                <el-input v-model="form.vlan_desc" type="textarea"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import {
    isFunction,
    parseStringAsList,
    removeItem,
    distinctArray
} from "@/utils/common";
import { regRange, regLength } from "@/utils/validator";
export default {
    name: "vlanForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    directives: {
        validator: {
            update(el, { value }) {
                if (value === "") {
                    return;
                }
                if (!regRange(value, 1, 4094)) {
                    el.className += " input-validate-error";
                } else {
                    el.className = "el-input el-input--small";
                }
            }
        }
    },
    data() {
        return {
            form: {
                vlanid_s: "",
                vlanid_e: "",
                tagged_portlist: [],
                untagged_portlist: [],
                default_vlan_portlist: [],
                vlan_name: "",
                vlan_desc: ""
            },
            rules: {
                vlan_name: [
                    {
                        validator: this.validateName,
                        trigger: ["change", "blur"]
                    }
                ],
                vlan_desc: [
                    {
                        validator: this.validateDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            type: ""
        };
    },
    methods: {
        init(type, data) {
            this.$refs["vlan-form"].resetFields();
            // template里未有对应的prop项时，resetFields无法重置项，需手动重置
            this.form.default_vlan_portlist = [];
            this.form.vlanid_s = "";
            this.form.vlanid_e = "";
            this.type = type;
            if (type === "config" || type === "port_default_vlan") {
                this.form.vlanid_s = data.vlan_id;
                this.form.tagged_portlist = parseStringAsList(
                    data.tagged_portlist
                );
                this.form.untagged_portlist = parseStringAsList(
                    data.untagged_portlist
                );
                this.form.default_vlan_portlist = parseStringAsList(
                    data.default_vlan_portlist
                );
            }
            if (type === "name" || type === "desc") {
                this.form.vlanid_s = data.vlan_id;
                this.form.vlan_name = data.vlan_name;
                this.form.vlan_desc = data.vlan_desc;
            }
        },
        disabledItem(vid) {
            return this.form.default_vlan_portlist.includes(vid);
        },
        validate(fn) {
            if (this.type === "name" || this.type === "desc") {
                this.$refs["vlan-form"].validate(valid => {
                    if (valid) {
                        fn.call(this, this.type, this.form);
                    } else {
                        fn.call(this, this.type, valid);
                    }
                });
                return;
            }
            if (isFunction(fn)) {
                if (!regRange(this.form.vlanid_s, 1, 4094)) {
                    return this.$message.error(
                        `${this.$lang("param_error")}: ${this.$lang(
                            "start_vlan_id"
                        )}`
                    );
                }
                if (
                    this.form.vlanid_e &&
                    !regRange(this.form.vlanid_e, 1, 4094)
                ) {
                    return this.$message.error(
                        `${this.$lang("param_error")}: ${this.$lang(
                            "end_vlan_id"
                        )}`
                    );
                }
                const { vlanid_s, vlanid_e } = this.form;
                if (!vlanid_e) {
                    this.form.vlanid_e = vlanid_s;
                }
                if (this.form.vlanid_s > this.form.vlanid_e) {
                    this.form.vlanid_s = vlanid_e;
                    this.form.vlanid_e = vlanid_s;
                }
                fn.call(this, this.type, this.form);
            }
        },
        validateName(rule, val, cb) {
            if (!regLength(val, 0, 16)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 16)));
            }
            return cb();
        },
        validateDesc(rule, val, cb) {
            if (!regLength(val, 0, 64)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 64)));
            }
            return cb();
        }
    },
    watch: {
        "form.tagged_portlist"(nv, ov) {
            if (nv.length > ov.length) {
                const diff = distinctArray(nv, ov);
                if (diff.length) {
                    diff.forEach(item => {
                        removeItem(this.form.untagged_portlist, item);
                    });
                }
            }
        },
        "form.untagged_portlist"(nv, ov) {
            if (nv.length > ov.length) {
                const diff = distinctArray(nv, ov);
                if (diff.length) {
                    diff.forEach(item => {
                        removeItem(this.form.tagged_portlist, item);
                    });
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
.vlan-form-tips {
    font-size: 12px;
    color: @titleColor;
    margin-left: 12px;
}
.input-validate-error /deep/ .el-input__inner {
    border-color: red;
}
</style>