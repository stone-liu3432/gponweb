<template>
    <div>
        <el-row class="srv-detail-item">
            <el-col :span="4" class="srv-detail-title">{{ $lang('profname') }}:</el-col>
            <el-col :span="8">{{ data.profname }}</el-col>
            <el-col :span="4" class="srv-detail-title">{{ $lang('profid') }}:</el-col>
            <el-col :span="4">{{ data.profid }}</el-col>
            <el-col :span="4">
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('set')"
                >{{ $lang('config') }}</el-button>
            </el-col>
        </el-row>
        <el-row class="srv-detail-item">
            <el-col :span="4" class="srv-detail-title">{{ $lang('ont_ethport') }}:</el-col>
            <el-col :span="8">{{ data.ont_ethport === 0xff ? 'adaptive' : data.ont_ethport }}</el-col>
            <el-col :span="4" class="srv-detail-title">{{ $lang('ont_potsport') }}:</el-col>
            <el-col :span="8">{{ data.ont_potsport === 0xff ? 'adaptive' : data.ont_potsport }}</el-col>
        </el-row>
        <el-row class="srv-detail-item">
            <el-col :span="4" class="srv-detail-title">{{ $lang('ont_catvport') }}:</el-col>
            <el-col :span="8">{{ data.ont_catvport }}</el-col>
            <el-col :span="4" class="srv-detail-title">{{ $lang('native_vlan_flag') }}:</el-col>
            <el-col
                :span="8"
                class="srv-detail-value"
            >{{ data.native_vlan_flag ? $lang('not_need') : $lang('need') }}</el-col>
        </el-row>
        <h3 class="srv-detail-portvlan">
            <span>{{ $lang('portvlan') }}:</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('add')"
            >{{ $lang('add') }}</el-button>
            <template v-if="modifyFlags">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="saveAllChanges"
                >{{ $lang('save_all_changes') }}</el-button>
            </template>
        </h3>
        <el-table :data="data.portvlan" border>
            <el-table-column :label="$lang('uniport')" prop="uniport">
                <template slot-scope="scope">{{ scope.row.unitype === 0 ? scope.row.uniport : '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('unitype')" prop="unitype">
                <template slot-scope="scope">{{ UNI_TYPES[scope.row.unitype] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('mode')">
                <template slot-scope="scope">{{ VLAN_MODES[scope.row.mode] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('svlanid')" prop="svlanid"></el-table-column>
            <el-table-column :label="$lang('svlanpri')" prop="svlanpri">
                <template
                    slot-scope="scope"
                >{{ scope.row.svlanpri === 8 ? '-' : scope.row.svlanpri }}</template>
            </el-table-column>
            <el-table-column :label="$lang('cvlanid')" prop="cvlanid">
                <template
                    slot-scope="scope"
                >{{ scope.row.cvlanid === 4096 ? 'untag' : scope.row.cvlanid }}</template>
            </el-table-column>
            <el-table-column :label="$lang('cvlanpri')" prop="cvlanpri">
                <template
                    slot-scope="scope"
                >{{ scope.row.cvlanpri === 8 ? '-' : scope.row.cvlanpri }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="80px">
                <template slot-scope="scope">
                    <el-popconfirm
                        :title="$lang('if_sure', 'delete') + ' ?'"
                        hideIcon
                        :confirmButtonText="$lang('apply')"
                        :cancelButtonText="$lang('cancel')"
                        @onConfirm="deleteItem(scope.row)"
                    >
                        <el-button slot="reference" type="text">{{ $lang('delete') }}</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            :width="dialogType === 'set' ? '640px' : '500px'"
        >
            <div slot="title">{{ $lang('add') }}</div>
            <template v-if="dialogType === 'add'">
                <portvlan-form :data="portvlan" ref="portvlan-form"></portvlan-form>
            </template>
            <template v-if="dialogType === 'set'">
                <srv-form :type="dialogType" :data="dialogData" ref="srv-form"></srv-form>
            </template>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm(dialogType === 'add' ? 'portvlan-form' : 'srv-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { VLAN_MODES, UNI_TYPES } from "@/utils/commonData";
import { removeItem, isDef } from "@/utils/common";
import portvlanForm from "./portvlanForm";
import srvForm from "./srvForm";
export default {
    name: "srvDetail",
    computed: {
        ...mapGetters(["$lang"])
    },
    components: { portvlanForm, srvForm },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            VLAN_MODES,
            UNI_TYPES,
            dialogVisible: false,
            dialogType: "",
            portvlan: [],
            dialogData: {},
            modifyFlags: false
        };
    },
    methods: {
        openDialog(type) {
            this.dialogType = type;
            this.dialogVisible = true;
            if (type === "add") {
                if (this.portvlan.length >= 64) {
                    return this.$message.info(
                        "Portvlan have reached the limit"
                    );
                }
                if (!this.data.portvlan) {
                    this.data.portvlan = [];
                }
                this.portvlan = JSON.parse(JSON.stringify(this.data.portvlan));
                this.$nextTick(_ => {
                    this.$refs["portvlan-form"].init();
                });
            } else if (type === "set") {
                this.dialogData = this.data;
                this.$nextTick(_ => {
                    this.$refs["srv-form"].init();
                });
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(form => {
                if (form) {
                    if (this.dialogType === "add") {
                        if (form.mode === 2) {
                            const row = this.data.portvlan.filter(
                                item =>
                                    item.mode === form.mode &&
                                    item.uniport === form.uniport &&
                                    item.unitype === form.unitype
                            )[0];
                            if (row) {
                                row.svlanid = form.svlanid;
                                row.svlanpri = form.svlanpri;
                                this.dialogVisible = false;
                                this.modifyFlags = true;
                                return;
                            }
                        }
                        this.data.portvlan.push({ ...form });
                        this.modifyFlags = true;
                    }
                    if (this.dialogType === "set") {
                        this.diffObj(this.data, form);
                    }
                    this.dialogVisible = false;
                }
            });
        },
        deleteItem(row) {
            removeItem(this.data.portvlan, row);
            this.modifyFlags = true;
        },
        diffObj(obj1, obj2) {
            const PROTS_MAP = [
                "profname",
                "profid",
                "ont_ethport",
                "ont_potsport",
                "ont_catvport",
                "native_vlan_flag"
            ];
            PROTS_MAP.forEach(key => {
                if (obj1[key] !== obj2[key]) {
                    obj1[key] = obj2[key];
                    this.modifyFlags = true;
                }
            });
        },
        saveAllChanges() {
            this.$emit("set-profile", {
                method: "set",
                param: this.data
            });
            this.modifyFlags = false;
        }
    }
};
</script>

<style lang="less" scoped>
.srv-detail-item {
    margin: 20px 0;
    line-height: 28px;
    > div:first-child {
        text-align: right;
        padding-right: 20px;
    }
    .srv-detail-title {
        font-weight: bold;
        font-size: 12px;
        color: #909399;
        & + div {
            color: @titleColor;
        }
    }
}
.srv-detail-portvlan {
    color: @titleColor;
}
</style>