<template>
    <div>
        <el-table :data="data.status || []" border>
            <el-table-column :label="$lang('ont_id')" width="150px">
                <template slot-scope="scope">
                    {{ `${data.port_id} / ${scope.row.ont_id}` }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('name')"
                prop="name"
            ></el-table-column>
            <el-table-column :label="$lang('bytes_transmitted')">
                <template slot-scope="scope">
                    <el-progress
                        :percentage="
                            Math.floor(
                                (scope.row.bytes_transmitted / data.file_size) *
                                    100
                            )
                        "
                        :format="
                            (val) =>
                                `${scope.row.bytes_transmitted} / ${data.file_size} (${val}%)`
                        "
                    ></el-progress>
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('upgrade_status')"
                prop="upgrade_status"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "upgradeStatus",
    computed: {
        ...mapGetters(["$lang"]),
    },
    props: {
        data: {
            type: Object,
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="less" scoped>
</style>