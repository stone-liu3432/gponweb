<template>
    <div>
        <page-header :title="$lang('port_info')" type="none"></page-header>
        <el-table
            :data="port"
            border
            stripe
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
        >
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('admin_status')">
                <template slot-scope="scope">{{ scope.row.admin_status ? "Enable" : "Disable" }}</template>
            </el-table-column>
            <el-table-column :label="$lang('link_status')">
                <template slot-scope="scope">
                    <template v-if="scope.row.link_status">
                        <el-tag type="success">{{ $lang('link_up') }}</el-tag>
                    </template>
                    <template v-else>
                        <el-tag type="danger">{{ $lang('link_down') }}</el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column :label="$lang('auto_neg')">
                <template slot-scope="scope">{{ scope.row.auto_neg ? "Enable" : "Disable" }}</template>
            </el-table-column>
            <el-table-column :label="$lang('speed')">
                <template
                    slot-scope="scope"
                >{{ scope.row.speed === '10/100/1000M' ? 'Auto' : scope.row.speed }}</template>
            </el-table-column>
            <el-table-column :label="$lang('duplex')">
                <template slot-scope="scope">{{ scope.row.duplex === 1 ? "full" : "half" }}</template>
            </el-table-column>
            <el-table-column :label="$lang('flow_ctrl')">
                <template slot-scope="scope">{{ scope.row.flow_ctrl === 1 ? "Enable" : "Disable" }}</template>
            </el-table-column>
            <el-table-column :label="$lang('mtu')" prop="mtu"></el-table-column>
            <el-table-column :label="$lang('media')">
                <template slot-scope="scope">{{ $lang(scope.row.media) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('pvid')" prop="pvid"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        style="padding: 3px 0;"
                        @click="jump(scope.row.port_id)"
                    >{{ $lang('config') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
    name: "portInfo",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        ...mapState(["port"])
    },
    data() {
        return {};
    },
    created() {
        this.getPort();
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    methods: {
        ...mapActions(["getPort"]),
        jump(port_id) {
            this.$router.push("/port_cfg?port_id=" + port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>