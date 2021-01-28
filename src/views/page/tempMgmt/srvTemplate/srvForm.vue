<template>
    <div>
        <el-form
            label-width="220px"
            :model="form"
            :rules="rules"
            ref="srv-form"
        >
            <el-form-item
                :label="$lang('profname')"
                prop="profname"
                key="profname"
            >
                <el-input
                    style="width: 200px"
                    v-model="form.profname"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$lang('profid')" prop="profid" key="profid">
                <el-input
                    style="width: 200px"
                    v-model.number="form.profid"
                    :disabled="disabledItem('profid')"
                ></el-input>
                <el-checkbox
                    v-model="autoAssignID"
                    style="margin-left: 30px"
                    :disabled="type === 'set'"
                    >{{ $lang("auto_assign") }}</el-checkbox
                >
            </el-form-item>
            <el-form-item
                :label="$lang('ont_ethport')"
                prop="ont_ethport"
                key="ont_ethport"
            >
                <el-input
                    style="width: 200px"
                    v-model.number="form.ont_ethport"
                    :disabled="disabledItem('ont_ethport')"
                ></el-input>
                <el-checkbox
                    v-model="autoAssignEth"
                    style="margin-left: 30px"
                    >{{ $lang("auto_assign") }}</el-checkbox
                >
            </el-form-item>
            <el-form-item
                :label="$lang('ont_potsport')"
                prop="ont_potsport"
                key="ont_potsport"
            >
                <el-input
                    style="width: 200px"
                    v-model.number="form.ont_potsport"
                    :disabled="disabledItem('ont_potsport')"
                ></el-input>
                <el-checkbox
                    v-model="autoAssignPots"
                    style="margin-left: 30px"
                    >{{ $lang("auto_assign") }}</el-checkbox
                >
            </el-form-item>
            <el-form-item
                :label="$lang('ont_catvport')"
                prop="ont_catvport"
                key="ont_catvport"
            >
                <el-input
                    style="width: 200px"
                    v-model.number="form.ont_catvport"
                ></el-input>
            </el-form-item>
            <el-form-item
                :label="$lang('veip_port')"
                prop="ont_veipport"
                key="ont_veipport"
            >
                <el-select v-model.number="form.ont_veipport">
                    <template v-for="(item, index) in ONT_VEIPPORT_MAP">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item
                :label="$lang('native_vlan_flag')"
                prop="native_vlan_flag"
                key="native_vlan_flag"
            >
                <el-select v-model.number="form.native_vlan_flag">
                    <el-option :value="0" :label="$lang('need')"></el-option>
                    <el-option
                        :value="1"
                        :label="$lang('not_need')"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('igmp_version')" prop="igmp_version">
                <el-select v-model.number="form.igmp_version">
                    <template v-for="(item, index) in IGMP_VERSION_MAP">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('igmp_function')" prop="igmp_function">
                <el-select v-model.number="form.igmp_function">
                    <template v-for="(item, index) in IGMP_FUNCTION_MAP">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item
                :label="$lang('immediate_leave')"
                prop="immediate_leave"
            >
                <el-select v-model.number="form.immediate_leave">
                    <template v-for="(item, index) in SWITCH_MAP">
                        <el-option
                            :value="index"
                            :label="$lang(item)"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('igmp_upstream')" prop="igmp_upstream">
                <el-select v-model.number="form.igmp_upstream">
                    <template v-for="(item, index) in IGMP_UPSTREAM_MAP">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="form.igmp_upstream !== 0">
                <el-form-item :label="$lang('igmp_up_vid')" prop="igmp_up_vid">
                    <el-input
                        style="width: 220px"
                        v-model.number="form.igmp_up_vid"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$lang('igmp_up_pri')" prop="igmp_up_pri">
                    <el-select v-model="form.igmp_up_pri">
                        <el-option :value="0"></el-option>
                        <template v-for="i in 7">
                            <el-option :value="i"></el-option>
                        </template>
                        <el-option :value="8" label="-"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item
                :label="$lang('mcast_downstream')"
                prop="mcast_downstream"
            >
                <el-select v-model.number="form.mcast_downstream">
                    <template v-for="(item, index) in IGMP_DOWNSTREAM_MAP">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template
                v-if="
                    form.mcast_downstream === 2 || form.mcast_downstream === 3
                "
            >
                <el-form-item
                    :label="$lang('mcast_down_vid')"
                    prop="mcast_down_vid"
                >
                    <el-input
                        style="width: 220px"
                        v-model.number="form.mcast_down_vid"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :label="$lang('mcast_down_pri')"
                    prop="mcast_down_pri"
                >
                    <el-select v-model.number="form.mcast_down_pri">
                        <el-option :value="0"></el-option>
                        <template v-for="i in 7">
                            <el-option :value="i"></el-option>
                        </template>
                        <el-option :value="8" label="-"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="type === 'add'">
                <el-form-item
                    :label="$lang('portvlan')"
                    prop="portvlan"
                    key="portvlan"
                >
                    <el-popover
                        placement="right"
                        width="660"
                        trigger="click"
                        @after-enter="showFlag = true"
                        @after-leave="showFlag = false"
                    >
                        <el-table :data="portvlan" border>
                            <el-table-column
                                :label="$lang('uniport')"
                                prop="uniport"
                            >
                                <template slot-scope="scope">{{
                                    scope.row.unitype === 0
                                        ? scope.row.uniport
                                        : "-"
                                }}</template>
                            </el-table-column>
                            <el-table-column
                                :label="$lang('unitype')"
                                prop="unitype"
                            >
                                <template slot-scope="scope">{{
                                    UNI_TYPES[scope.row.unitype]
                                }}</template>
                            </el-table-column>
                            <el-table-column :label="$lang('mode')">
                                <template slot-scope="scope">{{
                                    VLAN_MODES[scope.row.mode]
                                }}</template>
                            </el-table-column>
                            <el-table-column
                                :label="$lang('svlanid')"
                                prop="svlanid"
                                width="70"
                            ></el-table-column>
                            <el-table-column
                                :label="$lang('svlanpri')"
                                prop="svlanpri"
                                width="70"
                            >
                                <template slot-scope="scope">{{
                                    scope.row.svlanpri === 8
                                        ? "-"
                                        : scope.row.svlanpri
                                }}</template>
                            </el-table-column>
                            <el-table-column
                                :label="$lang('cvlanid')"
                                prop="cvlanid"
                                width="70"
                            >
                                <template slot-scope="scope">{{
                                    scope.row.cvlanid === 4096
                                        ? "untag"
                                        : scope.row.cvlanid
                                }}</template>
                            </el-table-column>
                            <el-table-column
                                :label="$lang('cvlanpri')"
                                prop="cvlanpri"
                                width="70"
                            >
                                <template slot-scope="scope">{{
                                    scope.row.cvlanpri === 8
                                        ? "-"
                                        : scope.row.cvlanpri
                                }}</template>
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
                                            >{{ $lang("delete") }}</el-button
                                        >
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button slot="reference" size="small">{{
                            btnText
                        }}</el-button>
                    </el-popover>
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 30px"
                        @click="openDialog"
                        >{{ $lang("add") }}</el-button
                    >
                </el-form-item>
            </template>
        </el-form>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            width="500px"
            destroy-on-close
        >
            <portvlan-form :data="portvlan" ref="portvlan-form"></portvlan-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('portvlan-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    SWITCH_MAP,
    UNI_TYPES,
    VLAN_MODES,
    ONT_VEIPPORT_MAP,
    IGMP_VERSION_MAP,
    IGMP_UPSTREAM_MAP,
    IGMP_DOWNSTREAM_MAP,
    IGMP_FUNCTION_MAP,
} from "@/utils/commonData";
import portvlanForm from "./portvlanForm";
import { isFunction, removeItem } from "@/utils/common";
import { regRange, regLength } from "@/utils/validator";
export default {
    name: "srvForm",
    components: { portvlanForm },
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        btnText() {
            return this.$lang(this.showFlag ? "hidden" : "show", "is_exists");
        },
    },
    props: {
        type: {
            type: String,
        },
        data: {
            type: Object,
        },
    },
    inject: ["validateVlan"],
    data() {
        return {
            SWITCH_MAP,
            UNI_TYPES,
            VLAN_MODES,
            ONT_VEIPPORT_MAP,
            IGMP_VERSION_MAP,
            IGMP_UPSTREAM_MAP,
            IGMP_DOWNSTREAM_MAP,
            IGMP_FUNCTION_MAP,
            portvlan: [], // 0-64
            form: {
                profname: "", // 1-32 length
                profid: "", // 0-2048, 0xfffe
                ont_ethport: "", // 0-8, 0xff
                ont_potsport: "", // 0-2, 0xff
                ont_catvport: "", // 0-1
                native_vlan_flag: 0,
                ont_veipport: 0,
                igmp_version: 1,
                igmp_function: 0, //  0-igmp-snooping,1-spr, 2-proxy
                immediate_leave: 0, //	0-关闭,1-使能
                igmp_upstream: 0,
                igmp_up_vid: "",
                igmp_up_pri: 8,
                mcast_downstream: 0,
                mcast_down_vid: "",
                mcast_down_pri: 8,
            },
            rules: {
                profname: [
                    {
                        validator: this.validateProfname,
                        trigger: ["change", "blur"],
                    },
                ],
                profid: [
                    {
                        validator: this.validateProfid,
                        trigger: ["change", "blur"],
                    },
                ],
                ont_ethport: [
                    {
                        validator: this.validateEth,
                        trigger: ["change", "blur"],
                    },
                ],
                ont_potsport: [
                    {
                        validator: this.validatePots,
                        trigger: ["change", "blur"],
                    },
                ],
                ont_catvport: [
                    {
                        validator: this.validateCatv,
                        trigger: ["change", "blur"],
                    },
                ],
                igmp_up_vid: [
                    {
                        validator: this.validateUpVid,
                        trigger: ["change", "blur"],
                    },
                ],
                mcast_down_vid: [
                    {
                        validator: this.validateDownVid,
                        trigger: ["change", "blur"],
                    },
                ],
            },
            dialogVisible: false,
            autoAssignID: false,
            autoAssignEth: false,
            autoAssignPots: false,
            showFlag: "",
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
                Object.keys(this.form).forEach((key) => {
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
            this.$nextTick((_) => {
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
                },
            };
            if (isFunction(FLAGS[item])) {
                return FLAGS[item].call(this);
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((formData) => {
                if (formData) {
                    this.portvlan.push({
                        uniport: formData.uniport,
                        unitype: formData.unitype,
                        mode: formData.mode,
                        svlanid: formData.svlanid,
                        svlanpri: formData.svlanpri,
                        cvlanid: formData.cvlanid,
                        cvlanpri: formData.cvlanpri,
                    });
                    this.dialogVisible = false;
                }
            });
        },
        validate(fn) {
            this.$refs["srv-form"].validate((valid) => {
                if (isFunction(fn)) {
                    if (valid) {
                        fn.call(this, {
                            profname: this.form.profname,
                            profid: this.autoAssignID
                                ? 0xfffe
                                : Number(this.form.profid),
                            ont_ethport: this.autoAssignEth
                                ? 0xff
                                : Number(this.form.ont_ethport),
                            ont_potsport: this.autoAssignPots
                                ? 0xff
                                : Number(this.form.ont_potsport),
                            ont_catvport: Number(this.form.ont_catvport),
                            native_vlan_flag: this.form.native_vlan_flag,
                            portvlan: this.portvlan,
                            ont_veipport: this.form.ont_veipport,
                            igmp_version: this.form.igmp_version,
                            igmp_function: this.form.igmp_function,
                            immediate_leave: this.form.immediate_leave,
                            igmp_upstream: this.form.igmp_upstream,
                            igmp_up_vid: this.form.igmp_up_vid || 0,
                            igmp_up_pri: this.form.igmp_up_pri,
                            mcast_downstream: this.form.mcast_downstream,
                            mcast_down_vid: this.form.mcast_down_vid || 0,
                            mcast_down_pri: this.form.mcast_down_pri,
                        });
                    } else {
                        fn.call(this, valid);
                    }
                }
            });
        },
        validateProfname(rule, val, cb) {
            if (!/^[\w-]{0,32}$/i.test(val)) {
                return cb(new Error(this.validateMsg("inputName", 0, 32)));
            }
            cb();
        },
        validateProfid(rule, val, cb) {
            if (this.autoAssignID) {
                return cb();
            }
            if (!regRange(val, 0, 2047)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 2047)));
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
        },
        validateUpVid(rule, val, cb) {
            if (this.form.igmp_upstream === 0) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
        validateDownVid(rule, val, cb) {
            if (
                this.form.mcast_downstream === 0 ||
                this.form.mcast_downstream === 1
            ) {
                return cb();
            }
            return this.validateVlan(rule, val, cb);
        },
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
        },
    },
};
</script>

<style lang="less" scoped>
</style>