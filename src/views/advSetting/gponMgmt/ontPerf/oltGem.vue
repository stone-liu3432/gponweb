<template>
    <div>
        <el-table :data="perfs" border>
            <el-table-column :label="$lang('ont_id')">
                <template slot-scope="scope">{{
                    `ONT${scope.row.identifier >> 8}/${scope.row.identifier &
                        0xff}`
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('gemindex')"
                prop="gemport_id"
            ></el-table-column>
            <el-table-column
                :label="$lang('rx_packets')"
                prop="rx_packets"
            ></el-table-column>
            <el-table-column
                :label="$lang('rx_bytes')"
                prop="rx_bytes"
            ></el-table-column>
            <el-table-column
                :label="$lang('tx_packets')"
                prop="tx_packets"
            ></el-table-column>
            <el-table-column
                :label="$lang('tx_bytes')"
                prop="tx_bytes"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "oltGemPerf",
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        perfs: {
            type: Array
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
</style>