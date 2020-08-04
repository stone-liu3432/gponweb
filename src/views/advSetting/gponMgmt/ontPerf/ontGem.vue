<template>
    <div>
        <el-table :data="perfs" border stripe>
            <el-table-column :label="$lang('ont_id')">
                <template
                    slot-scope="scope"
                >{{ `ONT${scope.row.identifier >> 8}/${scope.row.identifier & 0xff}` }}</template>
            </el-table-column>
            <el-table-column :label="$lang('gemindex')" prop="gemport_id"></el-table-column>
            <el-table-column :label="$lang('gem_rx_packets')" prop="gem_rx_packets"></el-table-column>
            <el-table-column :label="$lang('gem_rx_bytes')" prop="gem_rx_bytes"></el-table-column>
            <el-table-column :label="$lang('gem_tx_packets')" prop="gem_tx_packets"></el-table-column>
            <el-table-column :label="$lang('gem_tx_bytes')" prop="gem_tx_bytes"></el-table-column>
            <el-table-column :label="$lang('gem_encrypt_key_error')" prop="gem_encrypt_key_error"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "ontGemPerf",
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