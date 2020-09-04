<template>
    <div>
        <el-form label-width="140px" :model="form" :rules="rules" ref="srv-form">
            <el-form-item :label="$lang('profname')" prop="profname" key="profname">
                <el-input style="width: 200px;" v-model="form.profname"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('profid')" prop="profid" key="profid">
                <el-input
                    style="width: 200px;"
                    v-model.number="form.profid"
                    :disabled="disabledItem('profid')"
                ></el-input>
                <el-checkbox
                    v-model="autoAssignID"
                    style="margin-left: 30px;"
                    :disabled="type === 'set'"
                >{{ $lang('auto_assign') }}</el-checkbox>
            </el-form-item>
            <el-form-item :label="$lang('ont_ethport')" prop="ont_ethport" key="ont_ethport">
                <el-input
                    style="width: 200px;"
                    v-model.number="form.ont_ethport"
                    :disabled="disabledItem('ont_ethport')"
                ></el-input>
                <el-checkbox
                    v-model="autoAssignEth"
                    style="margin-left: 30px;"
                >{{ $lang('auto_assign') }}</el-checkbox>
            </el-form-item>
            <el-form-item :label="$lang('ont_potsport')" prop="ont_potsport" key="ont_potsport">
                <el-input
                    style="width: 200px;"
                    v-model.number="form.ont_potsport"
                    :disabled="disabledItem('ont_potsport')"
                ></el-input>
                <el-checkbox
                    v-model="autoAssignPots"
                    style="margin-left: 30px;"
                >{{ $lang('auto_assign') }}</el-checkbox>
            </el-form-item>
            <el-form-item :label="$lang('ont_catvport')" prop="ont_catvport" key="ont_catvport">
                <el-input style="width: 200px;" v-model.number="form.ont_catvport"></el-input>
            </el-form-item>
            <el-form-item
                :label="$lang('native_vlan_flag')"
                prop="native_vlan_flag"
                key="native_vlan_flag"
            >
                <el-select v-model.number="form.native_vlan_flag">
                    <el-option :value="0" :label="$lang('need')"></el-option>
                    <el-option :value="1" :label="$lang('not_need')"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="type === 'add'">
                <el-form-item :label="$lang('portvlan')" prop="portvlan" key="portvlan">
                    <el-popover placement="right" width="660" trigger="click">
                        <el-table :data="portvlan" border>
                            <el-table-column :label="$lang('uniport')" prop="uniport">
                                <template
                                    slot-scope="scope"
                                >{{ scope.row.unitype === 0 ? scope.row.uniport : '-' }}</template>
                            </el-table-column>
                            <el-table-column :label="$lang('unitype')" prop="unitype">
                                <template slot-scope="scope">{{ UNI_TYPES[scope.row.unitype] }}</template>
                            </el-table-column>
                            <el-table-column :label="$lang('mode')">
                                <template slot-scope="scope">{{ VLAN_MODES[scope.row.mode] }}</template>
                            </el-table-column>
                            <el-table-column :label="$lang('svlanid')" prop="svlanid" width="70"></el-table-column>
                            <el-table-column :label="$lang('svlanpri')" prop="svlanpri" width="70">
                                <template
                                    slot-scope="scope"
                                >{{ scope.row.svlanpri === 8 ? '-' : scope.row.svlanpri }}</template>
                            </el-table-column>
                            <el-table-column :label="$lang('cvlanid')" prop="cvlanid" width="70">
                                <template
                                    slot-scope="scope"
                                >{{ scope.row.cvlanid === 4096 ? 'untag' : scope.row.cvlanid }}</template>
                            </el-table-column>
                            <el-table-column :label="$lang('cvlanpri')" prop="cvlanpri" width="70">
                                <template
                                    slot-scope="scope"
                                >{{ scope.row.cvlanpri === 8 ? '-' : scope.row.cvlanpri }}</template>
                            </el-table-column>
                            <el-table-column :label="$lang('config')">
                                <template slot-scope="scope">
                                    <el-popconfirm
                                        :confirmButtonText="$lang('apply')"
                                        :cancelButtonText="$lang('cancel')"
                                        :title="$lang('if_sure', 'delete')"
                                        @onConfirm="deleteItem(scope.row)"
                                    >
                                        <el-button
                                            slot="reference"
                                            type="text"
                                        >{{ $lang('delete') }}</el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button slot="reference" size="small">{{ $lang('show', 'is_exists') }}</el-button>
                    </el-popover>
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 30px;"
                        @click="openDialog"
                    >{{ $lang('add') }}</el-button>
                </el-form-item>
            </template>
        </el-form>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="500px">
            <portvlan-form :data="portvlan" ref="portvlan-form"></portvlan-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('portvlan-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { UNI_TYPES, VLAN_MODES } from "@/utils/commonData";
import portvlanForm from "./portvlanForm";
import { isFunction, removeItem } from "@/utils/common";
import { regRange, regLength } from "@/utils/validator";
export default {
    name: "srvForm",
    components: { portvlanForm },
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    props: {
        type: {
            type: String
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
            UNI_TYPES,
            VLAN_MODES,
            portvlan: [], // 0-64
            form: {
                profname: "", // 1-32 length
                profid: "", // 0-2048, 0xfffe
                ont_ethport: "", // 0-8, 0xff
                ont_potsport: "", // 0-2, 0xff
                ont_catvport: "", // 0-1
                native_vlan_flag: 0
            },
            rules: {
                profname: [
                    {
                        validator: this.validateProfname,
                        trigger: ["change", "blur"]
                    }
                ],
                profid: [
                    {
                        validator: this.validateProfid,
                        trigger: ["change", "blur"]
                    }
                ],
                ont_ethport: [
                    { validator: this.validateEth, trigger: ["change", "blur"] }
                ],
                ont_potsport: [
                    {
                        validator: this.validatePots,
                        trigger: ["change", "blur"]
                    }
                ],
                ont_catvport: [
                    {
                        validator: this.validateCatv,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            dialogVisible: false,
            autoAssignID: false,
            autoAssignEth: false,
            autoAssignPots: false
        };
    },
    methods: {
        init() {
            this.autoAssignID = false;
            this.autoAssignEth = false;
            this.autoAssignPots = false;
            this.$refs["srv-form"].resetFields();
            this.portvlan = [];
            if (this.type === "set") {
                Object.keys(this.form).forEach(key => {
                    this.form[key] = this.data[key];
                });
                if (this.form.ont_ethport === 0xff) {
                    this.form.ont_ethport = "";
                    this.autoAssignEth = true;
                }
                if (this.form.ont_potsport === 0xff) {
                    this.form.ont_potsport = "";
                    this.autoAssignPots = true;
                }
                this.portvlan = JSON.parse(
                    JSON.stringify(this.data.portvlan || [])
                );
            }
        },
        openDialog() {
            if (this.portvlan.length >= 64) {
                return this.$message.info("Portvlan have reached the limit");
            }
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["portvlan-form"].init();
            });
        },
        disabledItem(item) {
            const FLAGS = {
                profid() {
                    if (this.type === "set") {
                        return true;
                    }
                    return this.autoAssignID;
                },
                ont_ethport() {
                    return this.autoAssignEth;
                },
                ont_potsport() {
                    return this.autoAssignPots;
                }
            };
            if (isFunction(FLAGS[item])) {
                return FLAGS[item].call(this);
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    this.portvlan.push(formData);
                    this.dialogVisible = false;
                }
            });
        },
        validate(fn) {
            this.$refs["srv-form"].validate(valid => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, {
                            profname: this.form.profname,
                            profid: this.autoAssignID
                                ? 0xfffe
                                : this.form.profid >>> 0,
                            ont_ethport: this.autoAssignEth
                                ? 0xff
                                : this.form.ont_ethport >>> 0,
                            ont_potsport: this.autoAssignPots
                                ? 0xff
                                : this.form.ont_potsport >>> 0,
                            ont_catvport: this.form.ont_catvport >>> 0,
                            native_vlan_flag: this.form.native_vlan_flag,
                            portvlan: this.portvlan
                        });
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
        validateProfname(rule, val, cb) {
            if (!regLength(val, 1, 32)) {
                return cb(new Error(this.validateMsg("inputLength", 1, 32)));
            }
            cb();
        },
        validateProfid(rule, val, cb) {
            if (this.autoAssignID) {
                return cb();
            }
            if (!regRange(val, 0, 2048)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 2048)));
            }
            cb();
        },
        validateEth(rule, val, cb) {
            if (this.autoAssignEth) {
                return cb();
            }
            if (!regRange(val, 0, 8)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 8)));
            }
            cb();
        },
        validatePots(rule, val, cb) {
            if (this.autoAssignPots) {
                return cb();
            }
            if (!regRange(val, 0, 2)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 2)));
            }
            cb();
        },
        validateCatv(rule, val, cb) {
            if (!regRange(val, 0, 1)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 1)));
            }
            cb();
        },
        deleteItem(row) {
            removeItem(this.portvlan, row);
        }
    },
    watch: {
        autoAssignID() {
            if (this.autoAssignID) {
                this.form.profid = "";
            } else {
                this.form.profid = this.data.profid || "";
            }
        },
        autoAssignEth() {
            if (this.autoAssignEth) {
                this.form.ont_ethport = "";
            } else {
                this.form.ont_ethport = this.data.ont_ethport || "";
            }
        },
        autoAssignPots() {
            if (this.autoAssignPots) {
                this.form.ont_potsport = "";
            } else {
                this.form.ont_potsport = this.data.ont_potsport || "";
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>