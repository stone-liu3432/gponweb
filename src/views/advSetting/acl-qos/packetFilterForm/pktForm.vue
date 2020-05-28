<template>
    <el-form :model="form" :rules="rules" label-width="100px" ref="pkt-form">
        <el-form-item label="ACL ID" prop="acl_id">
            <el-input v-model.number="form.acl_id" :disabled="type === 'config'"></el-input>
        </el-form-item>
        <el-form-item label="Rule ID" prop="rule_id">
            <el-input v-model.number="form.rule_id" :disabled="type === 'config'"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('port_list')" prop="port_list">
            <template slot-scope="scope">
                <el-checkbox-group v-model="form.port_list">
                    <template v-for="item in portName">
                        <el-checkbox :label="item.port_id">{{ item.name }}</el-checkbox>
                    </template>
                </el-checkbox-group>
            </template>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isFunction, parseStringAsList } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "pktForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["portName"])
    },
    data() {
        return {
            type: "",
            form: {
                acl_id: "",
                rule_id: "",
                port_list: []
            },
            rules: {
                acl_id: [
                    { validator: this.validateAcl, trigger: ["change", "blur"] }
                ],
                rule_id: [
                    {
                        validator: this.validateRule,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init(type, data) {
            this.$refs["pkt-form"].resetFields();
            this.type = type;
            if (type === "config") {
                this.form.acl_id = data.acl_id;
                this.form.rule_id = data.rule_id;
                this.form.port_list = parseStringAsList(data.port_list);
            }
        },
        validateAcl(rule, val, cb) {
            if (!regRange(val, 2000, 5999)) {
                return cb(
                    new Error(this.validateMsg("inputRange", 2000, 5999))
                );
            }
            cb();
        },
        validateRule(rule, val, cb) {
            if (!regRange(val, 0, 16)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 16)));
            }
            cb();
        },
        validate(fn) {
            this.$refs["pkt-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        const plist = this.form.port_list;
                        plist.sort((a, b) => a - b);
                        if (!plist.length) {
                            return this.$message.error(
                                `${this.$lang("params_error")}: ${this.$lang(
                                    "port_list"
                                )})`
                            );
                        }
                        fn.call(this, this.type, {
                            ...this.form,
                            port_list: plist
                        });
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