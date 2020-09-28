<template>
    <el-table :data="tcont" border stripe>
        <el-table-column :label="$lang('tcid')" prop="tcid" width="120px"></el-table-column>
        <el-table-column :label="$lang('dba_profid')" prop="dba_profid" width="120px"></el-table-column>
        <el-table-column :label="$lang('dba_profname')" prop="dba_profname"></el-table-column>
        <el-table-column :label="$lang('config')" width="80px">
            <template slot-scope="scope">
                <el-popconfirm
                    :title="$lang('if_sure', 'delete') + ' ?'"
                    hideIcon
                    :confirmButtonText="$lang('apply')"
                    :cancelButtonText="$lang('cancel')"
                    @onConfirm="deleteTcontItem(scope.row)"
                >
                    <el-button slot="reference" type="text">{{ $lang('delete') }}</el-button>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { mapGetters } from "vuex";
import { removeItem } from "@/utils/common";
export default {
    name: "lineTcontTable",
    props: {
        tcont: {
            type: Array
        },
        gem: {
            type: Array
        }
    },
    computed: {
        ...mapGetters(["$lang"])
    },
    methods: {
        deleteTcontItem(row) {
            if (this.gem.some(item => row.tcid === item.tcontid)) {
                return this.$message.error(this.$lang("tcont_delete"));
            }
            removeItem(this.tcont, row);
            this.$emit("change-data");
        }
    }
};
</script>

<style lang="less" scoped>
</style>