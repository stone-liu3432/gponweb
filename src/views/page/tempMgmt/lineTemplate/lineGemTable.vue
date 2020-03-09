<template>
    <el-table :data="data" border stripe :span-method="spanMethod">
        <el-table-column :label="$lang('gemindex')" prop="gemindex" width="120px"></el-table-column>
        <el-table-column :label="$lang('tcontid')" prop="tcontid" width="120px"></el-table-column>
        <el-table-column :label="$lang('mapping')">
            <template slot-scope="scope">
                <el-table :data="scope.row.mapping">
                    <el-table-column :label="$lang('mode')">
                        <template slot-scope="scope">{{ mappingModes[scope.row.mode] }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('vlan_id')" prop="vlan_id">
                        <template
                            slot-scope="scope"
                        >{{ scope.row.vlan_id === 0xffff ? 'untag' : scope.row.vlan_id }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('vlan_pri')" prop="vlan_pri"></el-table-column>
                </el-table>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "lineGemTable",
    props: {
        data: {
            type: Array
        }
    },
    data() {
        return {
            mappingModes: { 1: "VLAN", 2: "Priority", 3: "TCI" }
        };
    },
    computed: { ...mapGetters(["$lang"]) },
    methods: {
        spanMethod({ row, column, rowIndex, columnIndex }) {}
    }
};
</script>

<style lang="less" scoped>
</style>