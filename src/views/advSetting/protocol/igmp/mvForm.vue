<template>
    <el-form label-width="200px" :model="form" :rules="rules" ref="mv-form">
        <el-form-item :label="$lang('mvlan')" prop="mvlan">
            <template v-if="type === 'add'">
                <el-input v-model.number="form.mvlan"></el-input>
            </template>
            <template v-else>{{ form.mvlan }}</template>
        </el-form-item>
        <template v-if="type === 'desc' || type === 'add'">
            <el-form-item :label="$lang('mvlan_desc')" prop="mvlan_desc">
                <el-input type="textarea" v-model.trim="form.mvlan_desc"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'add_router' || type === 'del_router'">
            <el-form-item :label="$lang('router_portlist')" prop="router_portlist">
                <el-checkbox-group v-model="form.router_portlist">
                    <template v-for="item in port">
                        <template v-if="item.port_id > system.ponports">
                            <el-checkbox
                                :label="item.port_id"
                                :disabled="disabledItem(item)"
                            >{{ getPortName(item.port_id) }}</el-checkbox>
                        </template>
                    </template>
                </el-checkbox-group>
            </el-form-item>
        </template>
        <template v-if="type === 'policy'">
            <el-form-item :label="$lang('mc_unknown_policy')" prop="mc_unknown_policy">
                <el-select v-model.number="form.mc_unknown_policy">
                    <template v-for="(item, index) in MULTICAST_UNKNOWN_POLICYS">
                        <el-option :value="index" :label="$lang(item)"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'program'">
            <el-form-item :label="$lang('program_s')" prop="program_s">
                <el-input v-model.trim="form.program_s"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('program_e')" prop="program_e">
                <el-input v-model.trim="form.program_e"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('program_desc')" prop="program_desc">
                <el-input v-model.trim="form.program_desc"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { MULTICAST_UNKNOWN_POLICYS } from "@/utils/commonData";
import { regLength } from "@/utils/validator";
import { parseStringAsList, isFunction } from "@/utils/common";
export default {
    name: "mvForm",
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["port", "system"])
    },
    data() {
        return {
            MULTICAST_UNKNOWN_POLICYS,
            type: "",
            row: {},
            item: {},
            router: [],
            form: {
                mvlan: "",
                router_portlist: [],
                mvlan_desc: "",
                mc_unknown_policy: 0,
                program_s: "",
                program_e: "",
                program_desc: ""
            },
            rules: {
                mvlan: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                mvlan_desc: [
                    {
                        validator: this.validateDesc,
                        trigger: ["change", "blur"]
                    }
                ],
                program_s: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                program_e: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                program_desc: [
                    {
                        validator: this.validateDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    inject: ["validateIp", "validateVlan"],
    methods: {
        init(type, row, item) {
            this.$refs["mv-form"].resetFields();
            this.type = type;
            if (type !== "add") {
                this.row = row;
                this.item = item;
                this.form.mvlan = row.mvlan;
                if (type === "desc") {
                    this.form.mvlan_desc = row.mvlan_desc;
                }
                if (type === "add_router" || type === "del_router") {
                    this.form.router_portlist = parseStringAsList(
                        row.router_portlist
                    );
                    this.router = parseStringAsList(row.router_portlist);
                }
                if (type === "policy") {
                    this.form.mc_unknown_policy = item.mc_unknown_policy;
                }
                if (type === "program") {
                    this.form.program_s = item.program_s;
                    this.form.program_e = item.program_e;
                    this.form.program_desc = item.program_desc;
                }
            }
        },
        disabledItem(item) {
            if (this.type === "add_router") {
                return this.router.includes(item.port_id);
            }
            return !this.router.includes(item.port_id);
        },
        validateDesc(rule, val, cb) {
            if (!regLength(val, 0, 128)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 128)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["mv-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        const ACTIONS = {
                            add() {
                                return true;
                            },
                            add_router() {
                                const res = this.form.router_portlist;
                                res.sort((a, b) => a - b);
                                if (this.router.join(",") === res.join(",")) {
                                    this.$message.info(
                                        this.$lang("modify_tips")
                                    );
                                    return false;
                                }
                                return true;
                            },
                            del_router() {
                                const res = this.form.router_portlist;
                                res.sort((a, b) => a - b);
                                if (!res.join(",")) {
                                    this.$message.info(
                                        this.$lang("modify_tips")
                                    );
                                    return false;
                                }
                                return true;
                            },
                            policy() {
                                if (
                                    this.item.mc_unknown_policy ===
                                    this.form.mc_unknown_policy
                                ) {
                                    this.$message.info(
                                        this.$lang("modify_tips")
                                    );
                                    return false;
                                }
                                return true;
                            },
                            desc() {
                                if (
                                    this.form.mvlan_desc === this.row.mvlan_desc
                                ) {
                                    this.$message.info(
                                        this.$lang("modify_tips")
                                    );
                                    return false;
                                }
                                return true;
                            },
                            program() {
                                return true;
                            }
                        };
                        if (isFunction(ACTIONS[this.type])) {
                            const flag = ACTIONS[this.type].call(this);
                            flag && fn.call(this, this.type, this.form);
                        }
                    } else {
                        fn.call(this, this.type, valid);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>