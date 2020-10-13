<template>
    <div>
        <el-row style="margin: 0 10px 20px 10px;">
            <el-col :span="12">
                <span class="line-detail-title">{{ $lang("profname") }}:</span>
                <span>{{ data.profname }}</span>
            </el-col>
            <el-col :span="12">
                <span class="line-detail-title">{{ $lang("profid") }}:</span>
                <span>{{ data.profid }}</span>
            </el-col>
        </el-row>
        <el-row style="margin: 0 10px 20px 10px;">
            <el-col :span="12">
                <span class="line-detail-title">{{ $lang("type") }}:</span>
                <span>{{ types[data.type] }}</span>
            </el-col>
            <el-col :span="12">
                <span class="line-detail-title"
                    >{{ $lang("mappingmode") }}:</span
                >
                <span>{{ MAPPING_MODES[data.mappingmode] }}</span>
            </el-col>
        </el-row>
        <el-row style="margin: 0 10px 20px 10px;">
            <el-col :span="12">
                <span class="line-detail-title" style="margin-right: 20px;">{{
                    $lang("pagination_display")
                }}</span>
                <el-switch
                    v-model="showPagination"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                ></el-switch>
            </el-col>
            <el-col :span="12">
                <el-button
                    type="primary"
                    size="small"
                    @click="setProfile(data)"
                    >{{ $lang("config") }}</el-button
                >
            </el-col>
        </el-row>
        <div style="margin: 20px 0;">
            <el-button
                type="primary"
                size="small"
                @click="openDialog('tcont')"
                >{{ $lang("add", "tcont") }}</el-button
            >
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('gem')"
                >{{ $lang("add", "gem") }}</el-button
            >
            <template v-if="modifyFlags">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="submitModify"
                    >{{ $lang("save_all_changes") }}</el-button
                >
            </template>
        </div>
        <template v-if="showPagination">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane :label="$lang('tcont')" name="tcont">
                    <line-tcont-table
                        :tcont="tcont"
                        :gem="gem"
                        @change-data="dataChange"
                    ></line-tcont-table>
                </el-tab-pane>
                <el-tab-pane :label="$lang('gem')" name="gem">
                    <line-gem-table
                        :data="gem"
                        @add-mapping="addMapping"
                        @change-data="dataChange"
                    ></line-gem-table>
                </el-tab-pane>
            </el-tabs>
        </template>
        <template v-else>
            <h3>{{ $lang("tcont") }}</h3>
            <line-tcont-table
                :tcont="tcont"
                :gem="gem"
                @change-data="dataChange"
            ></line-tcont-table>
            <h3>{{ $lang("gem") }}</h3>
            <line-gem-table
                :data="gem"
                @add-mapping="addMapping"
                @change-data="dataChange"
            ></line-gem-table>
        </template>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            width="650px"
            destroy-on-close
        >
            <div slot="title">{{ $lang(dialogType) }}</div>
            <template v-if="dialogType === 'set'">
                <line-form
                    :lineData="data"
                    :dbaData="dbaData"
                    :lineTable="lineTable"
                    :type="dialogType"
                    ref="line-form"
                ></line-form>
            </template>
            <template v-else>
                <add-or-set-form
                    :type="dialogType"
                    :dbaData="dbaData"
                    :tconts="tcont"
                    :existsData="existsData"
                    ref="add-or-set-form"
                ></add-or-set-form>
            </template>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="
                        submitForm(
                            dialogType === 'set'
                                ? 'line-form'
                                : 'add-or-set-form'
                        )
                    "
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isFunction } from "@/utils/common";
import { MAPPING_MODES } from "@/utils/commonData";
import addOrSetForm from "./addOrSetForm";
import lineTcontTable from "./lineTcontTable";
import lineGemTable from "./lineGemTable";
import lineForm from "./lineForm";
export default {
    name: "lineDetail",
    components: { lineGemTable, lineTcontTable, addOrSetForm, lineForm },
    computed: {
        ...mapGetters(["$lang"]),
        tcont() {
            return this.data.tcont;
        },
        gem() {
            return this.data.gem;
        },
        // 防止重复的index 或 id
        existsData() {
            const TYPES = {
                tcont() {
                    return this.tcont;
                },
                gem() {
                    return this.gem;
                },
                mapping() {
                    return this.gem;
                },
                addMapping() {
                    return this.gem;
                }
            };
            if (isFunction(TYPES[this.dialogType])) {
                return TYPES[this.dialogType].call(this);
            }
            return [];
        }
    },
    props: {
        data: {
            type: Object
        },
        dbaData: {
            type: Array
        },
        lineTable: {
            type: Array
        }
    },
    data() {
        return {
            MAPPING_MODES,
            showPagination: false,
            activeName: "tcont",
            types: { 1: "EPON", 2: "GPON" },
            dialogVisible: false,
            dialogType: "",
            parentGem: {},
            modifyFlags: false
        };
    },
    methods: {
        setProfile(data) {
            // this.$emit("set-profile", data);
            this.dialogType = "set";
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["line-form"].init();
            });
        },
        openDialog(type, data) {
            this.dialogType = type;
            // 添加tcont并且无dba模板
            if (type === "tcont" && !this.dbaData.length) {
                return this.$message.error(this.$lang("no_dba_prf"));
            }
            // 添加gem并且无tcont模板
            if (type === "gem" && !this.tcont.length) {
                return this.$message.error(this.$lang("no_tcont_info"));
            }
            if (type === "mapping") {
                this.parentGem = data;
                const mappings = data.mapping || [];
                if (mappings.length) {
                    const map = mappings[0];
                    if (map.vlan_id === 0xffff) {
                        return this.$message.error(this.$lang("untag_tips"));
                    }
                }
            }
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["add-or-set-form"].init(data);
            });
        },
        addMapping(type, data) {
            this.openDialog("mapping", data);
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, form) => {
                if (type || form) {
                    const ACTIONS = {
                        tcont(data) {
                            this.data.tcont.push({
                                tcid: data.tcid,
                                dba_profid: data.dba_profid,
                                dba_profname: data.dba_profname
                            });
                            this.modifyFlags = true;
                        },
                        gem(data) {
                            this.data.gem.push({
                                gemindex: data.gemindex,
                                tcontid: data.tcontid,
                                mapping: [
                                    {
                                        mid: data.mid,
                                        mode: data.mode,
                                        vlan_id: Number(data.vlan_id),
                                        vlan_pri: data.vlan_pri
                                    }
                                ]
                            });
                            this.modifyFlags = true;
                        },
                        mapping(data) {
                            if (!this.parentGem.mapping) {
                                this.parentGem.mapping = [];
                            }
                            this.parentGem.mapping.push({
                                mid: data.mid,
                                mode: data.mode,
                                vlan_id: Number(data.vlan_id),
                                vlan_pri: data.vlan_pri
                            });
                            this.modifyFlags = true;
                        },
                        set(data) {
                            const KEYS_MAP = [
                                "profname",
                                "type",
                                "mappingmode"
                            ];
                            KEYS_MAP.forEach(key => {
                                if (this.data[key] !== data[key]) {
                                    this.data[key] = data[key];
                                    this.modifyFlags = true;
                                }
                            });
                        }
                    };
                    if (isFunction(ACTIONS[this.dialogType])) {
                        ACTIONS[this.dialogType].call(
                            this,
                            type === "set" ? form : type
                        );
                        this.dialogVisible = false;
                    }
                }
            });
        },
        dataChange() {
            this.modifyFlags = true;
        },
        resetFlags() {
            this.modifyFlags = false;
        },
        submitModify() {
            if (this.data.tcont && !this.data.tcont.length) {
                return this.$message.error(this.$lang("least_tcont_tips"));
            }
            if (this.data.gem && !this.data.gem.length) {
                return this.$message.error(this.$lang("least_gem_tips"));
            }
            this.$emit("submit-modify", this.data);
            this.modifyFlags = false;
        }
    },
    watch: {
        showPagination() {
            if (!this.showPagination) {
                this.activeName = "tcont";
            }
        }
    }
};
</script>

<style lang="less" scoped>
span + span {
    margin-left: 20px;
    color: @titleColor;
}
.line-detail-title {
    font-weight: bold;
    font-size: 12px;
    color: #909399;
}
</style>
