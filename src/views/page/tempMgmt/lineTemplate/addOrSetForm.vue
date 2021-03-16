<template>
    <div>
        <el-form
            :model="form"
            label-width="140px"
            :rules="rules"
            ref="add-line-profile-form"
        >
            <!-- add tcont -->
            <template v-if="type === 'tcont'">
                <el-form-item :label="$lang('tcid')" prop="tcid" key="tcid">
                    <el-input v-model.number="form.tcid"></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('dba_profname')"
                    prop="dba_profname"
                    key="dbaprofname"
                >
                    <el-select v-model.number="form.dba_profid">
                        <template v-for="item in dbaData">
                            <el-option
                                :label="item.profname"
                                :value="item.profid"
                            ></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <!-- add gem -->
            <template v-if="type === 'gem'">
                <el-form-item
                    :label="$lang('gemindex')"
                    prop="gemindex"
                    key="gemindex"
                >
                    <el-input v-model.number="form.gemindex"></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('tcontid')"
                    prop="tcontid"
                    key="tcontid"
                >
                    <el-select v-model.number="form.tcontid">
                        <template v-for="item in tconts">
                            <el-option :value="item.tcid"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <!-- add mapping -->
            <template v-if="type === 'mapping' || type === 'gem'">
                <template v-if="type === 'mapping'">
                    <el-form-item
                        :label="$lang('gem')"
                        prop="gemindex"
                        key="add-mapping"
                        >{{ form.gemindex }}</el-form-item
                    >
                </template>
                <el-form-item :label="$lang('mode')" prop="mode" key="mode">
                    <el-select
                        v-model.number="form.mode"
                        :disabled="disabledMode"
                    >
                        <template v-for="(item, index) in MAPPING_MODES">
                            <!-- gem 下的 mapping_mode 有且只有 vlan, priority, tci三种模式-->
                            <template v-if="index != 4">
                                <el-option
                                    :value="Number(index)"
                                    :label="item"
                                    :disabled="disabledModeItem(Number(index))"
                                ></el-option>
                            </template>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$lang('mid')" prop="mid" key="mid">
                    <el-input
                        v-model.number="form.mid"
                        style="width: 216px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('vlan_id')"
                    prop="vlan_id"
                    key="vlan-id"
                >
                    <el-input
                        v-model.number="form.vlan_id"
                        style="width: 216px"
                        :disabled="disabledItem('vlan_id')"
                    ></el-input>
                    <el-checkbox
                        v-model="autoAssignVlan"
                        style="margin-left: 30px"
                        :disabled="disabledItem('untag')"
                    >
                        untag
                    </el-checkbox>
                    <el-checkbox
                        v-model="transparent"
                        :disabled="disabledItem('transparent')"
                    >
                        transparent
                    </el-checkbox>
                </el-form-item>
                <el-form-item
                    :label="$lang('vlan_pri')"
                    prop="vlan_pri"
                    key="vlan-pri"
                >
                    <el-select
                        v-model.number="form.vlan_pri"
                        :disabled="disabledItem('vlan_pri')"
                    >
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
import { isFunction, isArray, isUndef } from "@/utils/common";
import { regRange } from "@/utils/validator";
export default {
    name: "addForm",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
    },
    inject: ["validateVlan"],
    props: {
        type: {
            type: String,
        },
        data: {
            type: Object,
        },
        dbaData: {
            type: Array,
        },
        tconts: {
            type: Array,
        },
        existsData: {
            type: Array,
            default: () => [],
        },
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
                vlan_pri: 0,
            },
            rules: {
                tcid: [
                    {
                        validator: this.validateTcid,
                        trigger: ["change", "blur"],
                    },
                ],
                gemindex: [
                    {
                        validator: this.validateGemindex,
                        trigger: ["change", "blur"],
                    },
                ],
                vlan_id: [
                    {
                        validator: this.validateVlanid,
                        trigger: ["change", "blur"],
                    },
                ],
                mid: [
                    {
                        validator: this.validateMid,
                        trigger: ["change", "blur"],
                    },
                ],
                vlan_pri: [
                    {
                        validator: this.validatePri,
                        trigger: ["change", "blur"],
                    },
                ],
            },
            disabledMode: false,
            autoAssignVlan: false,
            transparent: false,
            gemCache: {},
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
                this.form.tcid = "";
            }
            if (this.type === "gem") {
                // tconts为空时，无法打开此dialog
                this.form.tcontid = this.tconts[0].tcid;
                this.disabledMode = false;
                this.form.gemindex = "";
                if (this.existsData.length) {
                    this.existsData.forEach((item) => {
                        if (item.mapping && item.mapping.length) {
                            const mapping = item.mapping[0];
                            this.form.mode = mapping.mode;
                        }
                    });
                }
            }
            if (this.type === "mapping") {
                this.gemCache = row;
                this.form.gemindex = row.gemindex;
                this.lockMode(row.mapping);
            }
        },
        // 1-VLAN,2-Priority,3-TCI
        disabledModeItem(val) {
            if (this.existsData && this.existsData.length) {
                return this.existsData.some((item) => {
                    if (item.mapping && item.mapping.length) {
                        const mode = item.mapping[0].mode;
                        if (mode === 2) {
                            return val !== mode;
                        } else {
                            return val === 2;
                        }
                    }
                });
            } else {
                return false;
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
            this.$refs["add-line-profile-form"].validate((valid) => {
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
            if (this.existsData.some((item) => item.tcid === val)) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "tcid"
                        )}`
                    )
                );
            }
            if (!regRange(val, 1, 4)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 4)));
            }
            cb();
        },
        validateGemindex(rule, val, cb) {
            if (
                this.type !== "mapping" &&
                this.existsData.some((item) => item.gemindex === val)
            ) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "gemindex"
                        )}`
                    )
                );
            }
            if (!regRange(val, 1, 30)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 30)));
            }
            cb();
        },
        disabledItem(prop) {
            // gem下无mapping时，模式为vlan或tci时，允许配置untag
            if (
                this.type === "mapping" &&
                (prop === "untag" || prop === "transparent") &&
                ((this.gemCache.mapping && !this.gemCache.mapping.length) ||
                    isUndef(this.gemCache.mapping)) &&
                this.form.mode !== 2
            ) {
                return false;
            }
            if (this.form.mode === 1) {
                if (prop === "vlan_pri") {
                    return true;
                } else if (prop === "vlan_id") {
                    return this.autoAssignVlan || this.transparent;
                }
                return this.type === "mapping";
            }
            if (this.form.mode === 2) {
                if (prop === "untag" || prop === "transparent") {
                    return true;
                } else {
                    return prop === "vlan_id";
                }
            }
            if (this.form.mode === 3) {
                if (prop === "vlan_id") {
                    return this.autoAssignVlan || this.transparent;
                } else if (prop === "vlan_pri") {
                    return this.autoAssignVlan || this.transparent;
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
        /**
         *  在设置时，untagged也是一个vlan id
         *  同一个gemport下，只能有一种mapping模式
         *  同一个gemport下，正常vlanid范围和untagged，互斥
         *  不同的gemport下，mapping mode+vlanid+pri不能有重复
         *  不同的gemport下，priority和其他mapping mode，互斥
         *  不同的gemport下，模式为vlan或者vlan+pri时，vlan id一致不被允许，提示流已经存在
         */
        validateMid(rule, val, cb) {
            if (!regRange(val, 0, 7)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 7)));
            }
            const mapping = this.gemCache.mapping || [];
            if (mapping.some((item) => val === item.mid)) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang("mid")}`
                    )
                );
            }
            cb();
        },
        validatePri(rule, val, cb) {
            if (this.form.mode === 1) {
                return cb();
            }
            if (
                (this.type === "mapping" || this.type === "gem") &&
                this.form.mode === 2
            ) {
                const sameGemFlag = (this.gemCache.mapping || []).some(
                        (item) => item.vlan_pri === val
                    ),
                    disparityGemFlag = this.existsData.some((item) => {
                        if (item.mapping && item.mapping.length) {
                            return item.mapping.some(
                                (_item) => _item.vlan_pri === val
                            );
                        }
                    });
                if (sameGemFlag || disparityGemFlag) {
                    return cb(
                        new Error(
                            `${this.$lang("duplicate_param")}: ${this.$lang(
                                "vlan_pri"
                            )}`
                        )
                    );
                }
            }
            cb();
        },
        validateVlanid(rule, val, cb) {
            if (this.form.mode === 2) {
                return cb();
            }
            // untag
            if (val === 0xffff || val === 0xfffe) {
                return cb();
            }
            if (
                (this.type === "mapping" || this.type === "gem") &&
                this.form.mode !== 2
            ) {
                const sameGemFlag = (this.gemCache.mapping || []).some(
                        (item) => item.vlan_id === val
                    ),
                    disparityGemFlag = this.existsData.some((item) => {
                        if (item.mapping && item.mapping.length) {
                            return item.mapping.some(
                                (_item) => _item.vlan_id === val
                            );
                        }
                    });
                if (sameGemFlag || disparityGemFlag) {
                    return cb(
                        new Error(
                            `${this.$lang("duplicate_param")}: ${this.$lang(
                                "vlan_id"
                            )}`
                        )
                    );
                }
            }
            return this.validateVlan(rule, val, cb);
        },
    },
    watch: {
        "form.dba_profid"() {
            this.form.dba_profname = this.dbaData.filter((item) => {
                if (item.profid === this.form.dba_profid) {
                    return true;
                }
                return false;
            })[0]["profname"];
        },
        autoAssignVlan() {
            if (this.autoAssignVlan) {
                this.transparent = false;
                this.form.vlan_id = 0xffff;
            } else {
                if (!this.transparent) {
                    this.form.vlan_id = "";
                }
            }
            this.form.vlan_pri = 0;
        },
        transparent() {
            if (this.transparent) {
                this.autoAssignVlan = false;
                this.form.vlan_id = 0xfffe;
            } else {
                if (!this.autoAssignVlan) {
                    this.form.vlan_id = "";
                }
            }
            this.form.vlan_pri = 0;
        },
        "form.mode"() {
            if (this.form.mode === 2) {
                this.$refs["add-line-profile-form"].clearValidate([
                    "vlan_id",
                    "vlan_pri",
                ]);
            }
        },
        "form.gemindex"() {
            if (this.type === "addMapping") {
                const data = this.existsData.filter(
                    (item) => item.gemindex === this.form.gemindex
                )[0];
                if (data) {
                    this.lockMode(data.mapping);
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
</style>