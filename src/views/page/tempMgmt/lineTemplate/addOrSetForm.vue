<template>
    <div>
        <el-form :model="form" label-width="140px" :rules="rules" ref="add-line-profile-form">
            <!-- add tcont -->
            <template v-if="type === 'tcont'">
                <el-form-item :label="$lang('tcid')" prop="tcid" key="tcid">
                    <el-input v-model.number="form.tcid"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('dba_profname')" prop="dba_profname" key="dbaprofname">
                    <el-select v-model.number="form.dba_profid">
                        <template v-for="item in dbaData">
                            <el-option :label="item.profname" :value="item.profid"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <!-- add gem -->
            <template v-if="type === 'gem'">
                <el-form-item :label="$lang('gemindex')" prop="gemindex" key="gemindex">
                    <el-input v-model.number="form.gemindex"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('tcontid')" prop="tcontid" key="tcontid">
                    <el-select v-model.number="form.tcontid">
                        <template v-for="item in tconts">
                            <el-option :value="item.tcid"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <!-- add mapping -->
            <template v-if="type === 'addMapping'">
                <el-form-item :label="$lang('gem')" key="add-mapping">
                    <el-select v-model="form.gemindex">
                        <template v-for="item in existsData">
                            <!-- gem 下的 mapping 为 untag 模式时，禁止选取此 gem -->
                            <el-option
                                :value="item.gemindex"
                                :disabled="diabledOption(item.mapping || [])"
                            ></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="type === 'mapping' || type === 'gem' || type === 'addMapping' ">
                <el-form-item :label="$lang('mode')" prop="mode" key="mode">
                    <el-select v-model.number="form.mode" :disabled="disabledMode">
                        <template v-for="(item, index) in MAPPING_MODES">
                            <el-option :value="index >>> 0" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$lang('mid')" prop="mid" key="mid">
                    <el-input v-model.number="form.mid" style="width: 216px;"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('vlan_id')" prop="vlan_id" key="vlan-id">
                    <el-input
                        v-model.number="form.vlan_id"
                        style="width: 216px;"
                        :disabled="disabledItem('vlan_id')"
                    ></el-input>
                    <el-checkbox
                        v-model="autoAssignVlan"
                        style="margin-left: 30px;"
                        :disabled="disabledItem('untag')"
                    >untag</el-checkbox>
                </el-form-item>
                <el-form-item :label="$lang('vlan_pri')" prop="vlan_pri" key="vlan-pri">
                    <el-select v-model.number="form.vlan_pri" :disabled="disabledItem('vlan_pri')">
                        <el-option :value="0"></el-option>
                        <template v-for="i in 7">
                            <el-option :value="i"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { MAPPING_MODES } from "@/utils/commonData";
import { isFunction, isArray } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "addForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    inject: ["validateVlan"],
    props: {
        type: {
            type: String
        },
        data: {
            type: Object
        },
        dbaData: {
            type: Array
        },
        tconts: {
            type: Array
        },
        existsData: {
            type: Array
        }
    },
    data() {
        return {
            MAPPING_MODES,
            form: {
                tcid: "",
                dba_profid: 0,
                dba_profname: "",
                gemindex: "",
                tcontid: "",
                mid: "",
                mode: 1,
                vlan_id: "",
                vlan_pri: 0
            },
            rules: {
                tcid: [
                    {
                        validator: this.validateTcid,
                        trigger: ["change", "blur"]
                    }
                ],
                gemindex: [
                    {
                        validator: this.validateGemindex,
                        trigger: ["change", "blur"]
                    }
                ],
                vlan_id: [
                    {
                        validator: this.validateVlanid,
                        trigger: ["change", "blur"]
                    }
                ],
                mid: [
                    { validator: this.validateMid, trigger: ["change", "blur"] }
                ]
            },
            disabledMode: false,
            autoAssignVlan: false
        };
    },
    methods: {
        init(row) {
            this.$refs["add-line-profile-form"].resetFields();
            this.autoAssignVlan = false;
            if (this.type === "tcont") {
                // dbaData无项时，无法打开此dialog
                this.form.dba_profid = this.dbaData[0]["profid"];
                this.form.dba_profname = this.dbaData["0"]["profname"];
            }
            if (this.type === "gem") {
                // tconts为空时，无法打开此dialog
                this.form.tcontid = this.tconts[0].tcid;
                this.disabledMode = false;
            }
            if (this.type === "mapping") {
                this.lockMode(this.existsData);
            }
            if (this.type === "addMapping") {
                const data = this.existsData.filter(item => {
                    if (item.mapping.length) {
                        return item.mapping[0].vlan_id !== 0xffff;
                    }
                    return true;
                })[0];
                this.form.gemindex = row ? row.gemindex : data.gemindex;
                this.lockMode(data.mapping);
            }
        },
        lockMode(data) {
            if (data && data.length) {
                const map = data[0];
                this.form.mode = map.mode;
                this.disabledMode = true;
            } else {
                this.disabledMode = false;
            }
        },
        validate(fn) {
            this.$refs["add-line-profile-form"].validate(valid => {
                if (valid) {
                    if (isFunction(fn)) {
                        fn.call(this, this.form);
                    }
                } else {
                    fn.call(this, valid);
                }
            });
        },
        validateTcid(rule, val, cb) {
            if (this.existsData.some(item => item.tcid === val)) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "tcid"
                        )}`
                    )
                );
            }
            if (!regRange(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 32)));
            }
            cb();
        },
        validateGemindex(rule, val, cb) {
            if (this.existsData.some(item => item.gemindex === val)) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "gemindex"
                        )}`
                    )
                );
            }
            if (!regRange(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 32)));
            }
            cb();
        },
        validateVlanid(rule, val, cb) {
            if (this.form.mode === 2) {
                return cb();
            }
            if (
                val !== "" &&
                this.existsData.some(item => item.vlan_id === val)
            ) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "vlan_id"
                        )}`
                    )
                );
            }
            // untag
            if (val === 0xffff) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        disabledItem(prop) {
            if (this.form.mode === 1) {
                if (prop === "vlan_pri") {
                    return true;
                } else if (prop === "vlan_id") {
                    return this.autoAssignVlan;
                }
                return this.type === "mapping";
            }
            if (this.form.mode === 2) {
                if (prop === "untag") {
                    return true;
                } else {
                    return prop === "vlan_id";
                }
            }
            if (this.form.mode === 3) {
                if (prop === "vlan_id") {
                    return this.autoAssignVlan;
                } else if (prop === "vlan_pri") {
                    return this.autoAssignVlan;
                } else {
                    return this.type === "mapping";
                }
            }
            return false;
        },
        // untag模式下，不允许多次添加 mapping
        diabledOption(node) {
            if (node && node.length) {
                const data = node[0];
                return data.vlan_id === 0xffff;
            }
            return false;
        },
        validateMid(rule, val, cb) {
            if (!regRange(val, 0, 7)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 7)));
            }
            const data = this.existsData.filter(
                item => item.gemindex === this.form.gemindex
            )[0];
            if (data && isArray(data.mapping)) {
                const flag = data.mapping.some(item => val === item.mid);
                if (flag) {
                    return cb(
                        new Error(
                            `${this.$lang("duplicate_param")}: ${this.$lang(
                                "mid"
                            )}`
                        )
                    );
                }
            }
            cb();
        }
    },
    watch: {
        "form.dba_profid"() {
            this.form.dba_profname = this.dbaData.filter(item => {
                if (item.profid === this.form.dba_profid) {
                    return true;
                }
                return false;
            })[0]["profname"];
        },
        autoAssignVlan() {
            if (this.autoAssignVlan) {
                this.form.vlan_id = 0xffff;
                this.form.vlan_pri = "";
            } else {
                this.form.vlan_id = "";
                this.form.vlan_pri = 0;
            }
        },
        "form.mode"() {
            if (this.form.mode === 2) {
                this.$refs["add-line-profile-form"].clearValidate("vlan_id");
            }
        },
        "form.gemindex"() {
            if (this.type === "addMapping") {
                const data = this.existsData.filter(
                    item => item.gemindex === this.form.gemindex
                )[0];
                if (data) {
                    this.lockMode(data.mapping);
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>