<template>
    <div>
        <el-form
            :model="form"
            label-width="120px"
            :rules="rules"
            ref="add-line-form"
        >
            <el-form-item
                :label="$lang('profname')"
                prop="profname"
                key="profname"
            >
                <el-input v-model="form.profname"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('profid')" prop="profid" key="profid">
                <el-input
                    v-model.number="form.profid"
                    style="width: 200px"
                    :disabled="autoAssignProfid || type === 'set'"
                ></el-input>
                <el-checkbox
                    v-model="autoAssignProfid"
                    :disabled="type === 'set'"
                    style="margin-left: 30px"
                    >{{ $lang("auto_assign") }}</el-checkbox
                >
            </el-form-item>
            <el-form-item :label="$lang('type')" prop="type" key="type">
                <el-select v-model.number="form.type">
                    <el-option label="EPON" :value="1"></el-option>
                    <el-option label="GPON" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                :label="$lang('mappingmode')"
                prop="mappingmode"
                key="mapping-mode"
            >
                <el-select v-model.number="form.mappingmode">
                    <template v-for="(item, index) in MAPPING_MODES">
                        <el-option
                            :label="item"
                            :value="Number(index)"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="type !== 'set'">
                <el-form-item :label="$lang('tcont')" prop="tcont" key="tcont">
                    <el-popover
                        placement="right"
                        width="500"
                        trigger="manual"
                        v-model="tcontPopVisible"
                    >
                        <el-table
                            :data="tconts"
                            border
                            size="small"
                            max-height="500px"
                        >
                            <el-table-column
                                width="89"
                                prop="tcid"
                                :label="$lang('tcid')"
                            ></el-table-column>
                            <el-table-column
                                width="110"
                                prop="dba_profid"
                                :label="$lang('dba_profid')"
                            ></el-table-column>
                            <el-table-column
                                width="200"
                                prop="dba_profname"
                                :label="$lang('dba_profname')"
                            ></el-table-column>
                            <el-table-column
                                :label="$lang('action')"
                                width="100"
                            >
                                <template slot-scope="scope">
                                    <el-popconfirm
                                        :confirmButtonText="$lang('apply')"
                                        :cancelButtonText="$lang('cancel')"
                                        icon="el-icon-info"
                                        iconColor="red"
                                        :title="$lang('if_sure', 'delete')"
                                        @onConfirm="
                                            deleteItem('tconts', scope.row)
                                        "
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
                        <el-button
                            slot="reference"
                            @click="changePopVisible('tcont')"
                            >{{
                                tcontPopVisible
                                    ? $lang("hidden", "is_exists")
                                    : $lang("show", "is_exists")
                            }}</el-button
                        >
                    </el-popover>
                    <el-button
                        style="margin-left: 20px"
                        type="primary"
                        @click="openAddDialog('tcont')"
                        >{{ $lang("add") }}</el-button
                    >
                </el-form-item>
                <el-form-item :label="$lang('gem')" prop="gem" key="gem">
                    <el-popover
                        placement="right"
                        width="680"
                        trigger="manual"
                        v-model="gemPopVisible"
                    >
                        <el-table
                            :data="gems"
                            border
                            size="small"
                            max-height="500px"
                        >
                            <el-table-column
                                width="79"
                                prop="gemindex"
                                :label="$lang('gemindex')"
                            ></el-table-column>
                            <el-table-column
                                width="80"
                                prop="tcontid"
                                :label="$lang('tcontid')"
                            ></el-table-column>
                            <el-table-column
                                width="420"
                                prop="mapping"
                                :label="$lang('mapping')"
                            >
                                <template slot-scope="scope">
                                    <!-- 无key时，vue无法实时更新数据变化 -->
                                    <el-table
                                        :data="scope.row.mapping"
                                        size="small"
                                        max-height="500px"
                                        :key="scope.row.gemindex"
                                    >
                                        <el-table-column
                                            :label="$lang('mid')"
                                            width="70"
                                            prop="mid"
                                        ></el-table-column>
                                        <el-table-column
                                            width="79"
                                            :label="$lang('mode')"
                                        >
                                            <template slot-scope="sub">{{
                                                MAPPING_MODES[sub.row.mode]
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column
                                            width="80"
                                            :label="$lang('vlan_id')"
                                        >
                                            <template slot-scope="sub">{{
                                                sub.row.mode !== 2
                                                    ? sub.row.vlan_id === 0xffff
                                                        ? "untag"
                                                        : sub.row.vlan_id ===
                                                          0xfffe
                                                        ? "transparent"
                                                        : sub.row.vlan_id
                                                    : "-"
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column
                                            width="80"
                                            prop="vlan_pri"
                                            :label="$lang('vlan_pri')"
                                        >
                                            <template slot-scope="sub">{{
                                                sub.row.mode !== 1
                                                    ? sub.row.vlan_pri
                                                    : "-"
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column width="90">
                                            <template slot="header">
                                                <el-button
                                                    type="primary"
                                                    size="small"
                                                    @click="
                                                        openAddDialog(
                                                            'mapping',
                                                            scope.row
                                                        )
                                                    "
                                                    >{{
                                                        $lang("add")
                                                    }}</el-button
                                                >
                                            </template>
                                            <template slot-scope="sub">
                                                <el-popconfirm
                                                    :confirmButtonText="
                                                        $lang('apply')
                                                    "
                                                    :cancelButtonText="
                                                        $lang('cancel')
                                                    "
                                                    icon="el-icon-info"
                                                    iconColor="red"
                                                    :title="
                                                        $lang(
                                                            'if_sure',
                                                            'delete'
                                                        )
                                                    "
                                                    @onConfirm="
                                                        deleteItem(
                                                            'mappings',
                                                            scope.row,
                                                            sub.row
                                                        )
                                                    "
                                                >
                                                    <el-button
                                                        slot="reference"
                                                        type="text"
                                                        >{{
                                                            $lang("delete")
                                                        }}</el-button
                                                    >
                                                </el-popconfirm>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$lang('action')"
                                width="100"
                            >
                                <template slot-scope="scope">
                                    <el-popconfirm
                                        :confirmButtonText="$lang('apply')"
                                        :cancelButtonText="$lang('cancel')"
                                        icon="el-icon-info"
                                        iconColor="red"
                                        :title="$lang('if_sure', 'delete')"
                                        @onConfirm="
                                            deleteItem('gems', scope.row)
                                        "
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
                        <el-button
                            slot="reference"
                            @click="changePopVisible('gem')"
                            >{{
                                gemPopVisible
                                    ? $lang("hidden", "is_exists")
                                    : $lang("show", "is_exists")
                            }}</el-button
                        >
                    </el-popover>
                    <el-button
                        style="margin-left: 20px"
                        type="primary"
                        @click="openAddDialog('gem')"
                        >{{ $lang("add") }}</el-button
                    >
                    <!-- <el-button
                        style="margin-left: 30px;"
                        type="primary"
                        @click="openAddDialog('addMapping')"
                        :disabled="diaabledAddMapping"
                    >{{ $lang('add', 'mapping') }}</el-button>-->
                </el-form-item>
            </template>
        </el-form>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            width="650px"
            destroy-on-close
        >
            <template slot="title">{{ $lang(dialogType) }}</template>
            <add-or-set-form
                :type="dialogType"
                :dbaData="dbaData"
                :tconts="tconts"
                :existsData="existsData"
                ref="add-or-set-form"
            ></add-or-set-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('add-or-set-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import addOrSetForm from "./addOrSetForm";
import { MAPPING_MODES } from "@/utils/commonData";
import { isFunction, removeItem } from "@/utils/common";
import { regRange, regLength } from "@/utils/validator";
export default {
    name: "lineForm",
    components: { addOrSetForm },
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        // 防止重复的index 或 id
        existsData() {
            const TYPES = {
                tcont() {
                    return this.tconts;
                },
                gem() {
                    return this.gems;
                },
                mapping() {
                    return this.gems;
                },
            };
            if (isFunction(TYPES[this.dialogType])) {
                return TYPES[this.dialogType].call(this);
            }
            return [];
        },
        diaabledAddMapping() {
            // gems为空，或者所有gem下的mapping的vlan模式全都为untag时，无法添加mapping
            return (
                !this.gems.length ||
                this.gems.every((item) => {
                    if (item.mapping && item.mapping.length) {
                        return item.mapping[0].vlan_id === 0xffff;
                    }
                    return false;
                })
            );
        },
    },
    props: {
        lineData: {
            type: Object,
        },
        dbaData: {
            type: Array,
        },
        lineTable: {
            type: Array,
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            MAPPING_MODES,
            form: {
                profname: "",
                profid: "",
                type: 2,
                mappingmode: 1,
            },
            tconts: [],
            gems: [],
            mappings: [],
            dialogVisible: false,
            dialogType: "",
            gemPopVisible: false,
            tcontPopVisible: false,
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
            },
            // 自动分配ID时，profid值为 0xfffe
            autoAssignProfid: false,
        };
    },
    methods: {
        init() {
            this.$refs["add-line-form"].resetFields();
            this.autoAssignProfid = false;
            this.tconts = [];
            this.gems = [];
            if (this.type === "set") {
                Object.keys(this.form).forEach((key) => {
                    this.form[key] = this.lineData[key];
                });
                // magic code: deep clone
                this.tconts = JSON.parse(
                    JSON.stringify(this.lineData.tcont || [])
                );
                this.gems = JSON.parse(JSON.stringify(this.lineData.gem || []));
            }
        },
        openAddDialog(type, data) {
            this.dialogType = type;
            // 添加tcont并且无dba模板
            if (type === "tcont" && !this.dbaData.length) {
                return this.$message.error(this.$lang("no_dba_prf"));
            }
            // 添加gem并且无tcont模板
            if (type === "gem" && !this.tconts.length) {
                return this.$message.error(this.$lang("no_tcont_info"));
            }
            if (type === "mapping") {
                this.mappings = data.mapping || [];
                if (this.mappings.length) {
                    const map = this.mappings[0];
                    if (map.vlan_id === 0xffff || map.vlan_id === 0xfffe) {
                        return this.$message.error(this.$lang("untag_tips"));
                    }
                }
            }
            this.dialogVisible = true;
            this.$nextTick((_) => {
                this.$refs["add-or-set-form"].init(data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((formData) => {
                if (formData) {
                    const ACTIONS = {
                        tcont(data) {
                            this.tconts.push({
                                tcid: data.tcid,
                                dba_profid: data.dba_profid,
                                dba_profname: data.dba_profname,
                            });
                        },
                        gem(data) {
                            this.gems.push({
                                gemindex: data.gemindex,
                                tcontid: data.tcontid,
                                mapping: [
                                    {
                                        mid: data.mid,
                                        mode: data.mode,
                                        vlan_id: data.vlan_id,
                                        vlan_pri: data.vlan_pri,
                                    },
                                ],
                            });
                        },
                        mapping(data) {
                            this.mappings.push({
                                mid: data.mid,
                                mode: data.mode,
                                vlan_id: data.vlan_id,
                                vlan_pri: data.vlan_pri,
                            });
                        },
                    };
                    if (isFunction(ACTIONS[this.dialogType])) {
                        ACTIONS[this.dialogType].call(this, formData);
                        this.dialogVisible = false;
                    }
                }
            });
        },
        validate(fn) {
            this.$refs["add-line-form"].validate((valid) => {
                if (valid) {
                    if (isFunction(fn)) {
                        if (
                            this.type !== "set" &&
                            this.lineTable.some(
                                (item) => item.profid === this.form.profid
                            )
                        ) {
                            return this.$message.error(
                                `${this.$lang("duplicate_param")}: ${this.$lang(
                                    "profid"
                                )}`
                            );
                        }
                        if (!this.tconts.length) {
                            this.$message.error(this.$lang("no_tcont_info"));
                            fn.call(this, this.type, false);
                        } else {
                            fn.call(
                                this,
                                this.type,
                                Object.assign(this.form, {
                                    tcont: this.tconts,
                                    gem: this.gems || [],
                                    profid: this.autoAssignProfid
                                        ? 0xfffe
                                        : this.form.profid,
                                })
                            );
                            this.gemPopVisible = false;
                            this.tcontPopVisible = false;
                        }
                    }
                } else {
                    fn.call(this, valid);
                }
            });
        },
        validateProfname(rule, val, cb) {
            if (
                this.type !== "set" &&
                this.lineTable.some((item) => item.profname === val)
            ) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "profname"
                        )}`
                    )
                );
            }
            if (!/^[\w-]{0,32}$/i.test(val)) {
                return cb(new Error(this.validateMsg("inputName", 0, 32)));
            }
            cb();
        },
        validateProfid(rule, val, cb) {
            if (this.type === "set") {
                return cb();
            }
            if (val === "" && !this.autoAssignProfid) {
                this.form.profid = 0;
            }
            if (val === 0xfffe) {
                return cb();
            }
            if (!regRange(val, 0, 2047)) {
                return cb(new Error(this.validateMsg("inputRange", 0, 2047)));
            }
            if (this.lineTable.some((item) => item.profid === val)) {
                return cb(
                    new Error(
                        `${this.$lang("duplicate_param")}: ${this.$lang(
                            "profid"
                        )}`
                    )
                );
            } else {
                cb();
            }
        },
        changePopVisible(type) {
            if (type === "tcont") {
                this.tcontPopVisible = !this.tcontPopVisible;
                this.gemPopVisible = false;
            }
            if (type === "gem") {
                this.gemPopVisible = !this.gemPopVisible;
                this.tcontPopVisible = false;
            }
        },
        destroy() {
            this.gemPopVisible = false;
            this.tcontPopVisible = false;
        },
        deleteItem(type, node, sub) {
            if (type === "mappings") {
                return removeItem(node.mapping, sub);
            }
            removeItem(this[type], node);
        },
    },
    watch: {
        autoAssignProfid() {
            if (this.autoAssignProfid) {
                this.form.profid = "";
            } else {
                this.form.profid = "";
                this.type === "set" &&
                    (this.form.profid = this.lineData.profid);
            }
        },
    },
};
</script>

<style lang="less" scoped>
</style>