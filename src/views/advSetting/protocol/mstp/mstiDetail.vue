<template>
    <div>
        <h4>
            <span>{{ $lang('msti', 'info') }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="dispatchEvent('add')"
            >{{ $lang('add', 'vlan_list') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="dispatchEvent('delete')"
            >{{ $lang('delete', 'vlan_list') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="dispatchEvent('prio')"
            >{{ $lang('set', 'priority') }}</el-button>
        </h4>
        <div class="msti-info">
            <template v-for="item in infoEnum">
                <el-row class="msti-info-item">
                    <template v-for="key in item">
                        <span>{{ key === 'mstid' ? $lang('instance') : $lang(key) }}:</span>
                        <span>{{ key === 'root_port_name' ? (getPortName(row[key]) || 'None') : row[key] }}</span>
                    </template>
                </el-row>
            </template>
        </div>
        <h4>{{ $lang('port_list') }}</h4>
        <el-table :data="row.msti_port || []" border>
            <el-table-column :label="$lang('port_id')" prop="port_id">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('port_role')" prop="port_role">
                <template slot-scope="scope">{{ PORT_ROLE_MAP[scope.row.port_role] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('port_priority')" prop="port_priority"></el-table-column>
            <el-table-column :label="$lang('port_state')" prop="port_state">
                <template slot-scope="scope">{{ PORT_STATE_MAP[scope.row.port_state] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('admin_internal_cost')" prop="admin_internal_cost">
                <template slot-scope="scope">{{ scope.row.admin_internal_cost ? 'Manual' : 'Auto' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('internal_cost')" prop="internal_cost"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="dispatchEvent('port', scope.row)"
                    >{{ $lang('config') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { PORT_ROLE_MAP, PORT_STATE_MAP } from "@/utils/commonData";
export default {
    name: "mstiDetail",
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    props: {
        row: {
            type: Object
        }
    },
    data() {
        return {
            PORT_ROLE_MAP,
            PORT_STATE_MAP,
            infoEnum: [
                ["mstid"],
                ["msti_vlanlist"],
                ["bridge_prio", "bridge_addr"],
                ["designate_prio", "designate_addr"],
                ["root_port_name"],
                ["internal_path_cost"]
            ]
        };
    },
    methods: {
        dispatchEvent(type, data) {
            this.$emit("trigger-event", type, this.row, data);
        }
    }
};
</script>

<style lang="less" scoped>
h4 {
    color: @titleColor;
}
.msti-info {
    .base-font-style;
    > .msti-info-item {
        margin: 12px 0;
        span {
            display: inline-block;
            vertical-align: middle;
            width: 150px;
        }
        span + span {
            margin: 0 0 0 20px;
        }
    }
}
</style>