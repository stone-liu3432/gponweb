<template>
    <el-table
        :data="data"
        border
        :span-method="spanMethod"
        :row-key="getRowKey"
    >
        <el-table-column
            :label="$lang('gemindex')"
            prop="gemindex"
            width="120px"
        ></el-table-column>
        <el-table-column
            :label="$lang('tcontid')"
            prop="tcontid"
            width="120px"
        ></el-table-column>
        <el-table-column :label="$lang('mapping')">
            <template slot-scope="scope">
                <el-table
                    :data="scope.row.mapping"
                    size="mini"
                    :key="scope.row.gemindex"
                >
                    <el-table-column
                        :label="$lang('mid')"
                        prop="mid"
                    ></el-table-column>
                    <el-table-column :label="$lang('mode')">
                        <template slot-scope="sub">{{
                            MAPPING_MODES[sub.row.mode]
                        }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('vlan_id')" prop="vlan_id">
                        <template slot-scope="sub">{{
                            sub.row.mode !== 2
                                ? sub.row.vlan_id === 0xffff
                                    ? "untag"
                                    : sub.row.vlan_id === 0xfffe
                                    ? "transparent"
                                    : sub.row.vlan_id
                                : "-"
                        }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('vlan_pri')" prop="vlan_pri">
                        <template slot-scope="sub">{{
                            sub.row.mode !== 1 ? sub.row.vlan_pri : "-"
                        }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('config')" width="80px">
                        <template slot="header">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="openDialog('addMapping', scope.row)"
                                >{{ $lang("add") }}</el-button
                            >
                        </template>
                        <template slot-scope="sub">
                            <el-popconfirm
                                :title="
                                    $lang('if_sure', 'delete', 'mapping') + ' ?'
                                "
                                hideIcon
                                :confirmButtonText="$lang('apply')"
                                :cancelButtonText="$lang('cancel')"
                                @onConfirm="
                                    deleteMappingItem(scope.row, sub.row)
                                "
                            >
                                <el-button slot="reference" type="text">{{
                                    $lang("delete")
                                }}</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-table-column>
        <el-table-column :label="$lang('config')" width="100px">
            <template slot-scope="scope">
                <!-- <el-button
                    type="text"
                    size="small"
                    @click.native="openDialog('addMapping', scope.row)"
                >{{ $lang('add', 'mapping') }}</el-button>-->
                <el-popconfirm
                    :title="$lang('if_sure', 'delete', 'gem') + ' ?'"
                    hideIcon
                    :confirmButtonText="$lang('apply')"
                    :cancelButtonText="$lang('cancel')"
                    @onConfirm="deleteGemItem(scope.row)"
                >
                    <el-button slot="reference" type="text">{{
                        $lang("delete")
                    }}</el-button>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { mapGetters } from "vuex";
import { removeItem } from "@/utils/common";
import { MAPPING_MODES } from "@/utils/commonData";
export default {
    name: "lineGemTable",
    props: {
        data: {
            type: Array,
        },
    },
    data() {
        return {
            MAPPING_MODES,
        };
    },
    computed: { ...mapGetters(["$lang"]) },
    methods: {
        spanMethod({ row, column, rowIndex, columnIndex }) {},
        openDialog(type, data) {
            this.$emit("add-mapping", type, data);
        },
        deleteMappingItem(row, sub) {
            removeItem(row.mapping, sub);
            this.$emit("change-data");
        },
        deleteGemItem(row) {
            removeItem(this.data, row);
            this.$emit("change-data");
        },
        getRowKey(row) {
            return row.gemport;
        },
    },
};
</script>

<style lang="less" scoped>
</style>