<template>
    <el-form :model="form" :rules="rules" label-width="160px" ref="lag-form">
        <el-form-item :label="$lang('trunk_id')" prop="trunk_id">
            <template v-if="type !== 'create'">{{ form.trunk_id }}</template>
            <template v-else>
                <el-input v-model.number="form.trunk_id"></el-input>
            </template>
        </el-form-item>
        <template v-if="type === 'psc'">
            <el-form-item :label="$lang('psc')" prop="psc">
                <el-select v-model.number="form.psc">
                    <template v-for="(item, index) in PSC_MAP">
                        <el-option :label="item" :value="Number(index)"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type !== 'psc'">
            <el-form-item :label="$lang('member_portlist')" prop="member_portlist">
                <el-checkbox-group v-model="form.member_portlist">
                    <template v-for="item in portName">
                        <template v-if="item.port_id > system.ponports">
                            <el-checkbox
                                :label="item.port_id"
                                :disabled="disabledItem(item)"
                            >{{ item.name }}</el-checkbox>
                        </template>
                    </template>
                </el-checkbox-group>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isFunction, isDef, parseStringAsList } from "@/utils/common";
import { PSC_MAP } from "@/utils/commonData";
import { regRange } from "@/utils/validator";
export default {
    name: "lagForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["system", "portName"])
    },
    data() {
        return {
            PSC_MAP,
            form: {
                trunk_id: "",
                psc: 1,
                member_portlist: []
            },
            cachePortlist: [],
            cachePsc: 0,
            rules: {
                trunk_id: [
                    {
                        validator: this.validateTrunkid,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            type: ""
        };
    },
    methods: {
        init(type, row) {
            this.$refs["lag-form"].resetFields();
            this.type = type;
            if (isDef(row)) {
                this.form.trunk_id = row.trunk_id;
                this.cachePortlist = parseStringAsList(row.member_portlist);
                if (type === "add") {
                    this.form.member_portlist = parseStringAsList(
                        row.member_portlist
                    );
                }
                if (type === "psc") {
                    this.form.psc = row.psc;
                    this.cachePsc = row.psc;
                }
            }
        },
        validateTrunkid(rule, val, cb) {
            if (!regRange(val, 1, 8)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 8)));
            }
            cb();
        },
        disabledItem(item) {
            if (this.type === "add") {
                return this.cachePortlist.includes(item.port_id);
            }
            if (this.type === "delete") {
                return !this.cachePortlist.includes(item.port_id);
            }
            return false;
        },
        validate(fn) {
            this.$refs["lag-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        if (
                            this.type === "add" ||
                            this.type === "delete" ||
                            this.type === "create"
                        ) {
                            if (
                                this.form.member_portlist.length ===
                                    this.cachePortlist.length ||
                                !this.form.member_portlist.length
                            ) {
                                return this.$message.info(
                                    this.$lang("modify_tips")
                                );
                            }
                        }
                        if (this.type === "psc") {
                            if (this.form.psc === this.cachePsc) {
                                return this.$message.info(
                                    this.$lang("modify_tips")
                                );
                            }
                        }
                        fn.call(this, this.type, this.form);
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