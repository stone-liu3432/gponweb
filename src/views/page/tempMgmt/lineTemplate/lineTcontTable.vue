<template>
    <el-table :data="data" border stripe>
        <el-table-column :label="$lang('tcid')" prop="tcid" width="120px"></el-table-column>
        <el-table-column :label="$lang('dba_profid')" prop="dba_profid" width="120px"></el-table-column>
        <el-table-column :label="$lang('dba_profname')" prop="dba_profname"></el-table-column>
    </el-table>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "lineTcontTable",
    props: {
        data: {
            type: Array
        }
    },
    computed: {
        ...mapGetters(["$lang"])
    },
    methods: {}
};
</script>

<style lang="less" scoped>
</style>