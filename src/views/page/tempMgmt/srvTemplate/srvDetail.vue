<template>
    <div>
        <el-row class="srv-detail-item">
            <el-col :span="4" class="srv-detail-title">{{ $lang('profname') }}:</el-col>
            <el-col :span="8">{{ data.profname }}</el-col>
            <el-col :span="4" class="srv-detail-title">{{ $lang('profid') }}:</el-col>
            <el-col :span="4">{{ data.profid }}</el-col>
            <el-col :span="4">
                <el-button
                    type="primary"
                    size="small"
                    @click="setProfile(data)"
                >{{ $lang('config') }}</el-button>
            </el-col>
        </el-row>
        <el-row class="srv-detail-item">
            <el-col :span="4" class="srv-detail-title">{{ $lang('ont_ethport') }}:</el-col>
            <el-col :span="8">{{ data.ont_ethport === 0xff ? 'adaptive' : data.ont_ethport }}</el-col>
            <el-col :span="4" class="srv-detail-title">{{ $lang('ont_potsport') }}:</el-col>
            <el-col :span="8">{{ data.ont_potsport === 0xff ? 'adaptive' : data.ont_potsport }}</el-col>
        </el-row>
        <el-row class="srv-detail-item">
            <el-col :span="4" class="srv-detail-title">{{ $lang('ont_catvport') }}:</el-col>
            <el-col :span="8">{{ data.ont_catvport }}</el-col>
            <el-col :span="4" class="srv-detail-title">{{ $lang('native_vlan_flag') }}:</el-col>
            <el-col
                :span="8"
                class="srv-detail-value"
            >{{ data.native_vlan_flag ? $lang('not_need') : $lang('need') }}</el-col>
        </el-row>
        <el-row class="srv-detail-item">
            <el-col :span="4" class="srv-detail-title">{{ $lang('portvlan') }}:</el-col>
            <el-col :span="20">
                <el-table :data="data.portvlan" border>
                    <el-table-column :label="$lang('uniport')" prop="uniport">
                        <template
                            slot-scope="scope"
                        >{{ scope.row.unitype === 0 ? scope.row.uniport : '-' }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('unitype')" prop="unitype">
                        <template slot-scope="scope">{{ UNI_TYPES[scope.row.unitype] }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('mode')">
                        <template slot-scope="scope">{{ VLAN_MODES[scope.row.mode] }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('svlanid')" prop="svlanid"></el-table-column>
                    <el-table-column :label="$lang('svlanpri')" prop="svlanpri">
                        <template
                            slot-scope="scope"
                        >{{ scope.row.svlanpri === 8 ? '-' : scope.row.svlanpri }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('cvlanid')" prop="cvlanid">
                        <template
                            slot-scope="scope"
                        >{{ scope.row.cvlanid === 4096 ? 'untag' : scope.row.cvlanid }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('cvlanpri')" prop="cvlanpri">
                        <template
                            slot-scope="scope"
                        >{{ scope.row.cvlanpri === 8 ? '-' : scope.row.cvlanpri }}</template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { VLAN_MODES, UNI_TYPES } from "@/utils/commonData";
export default {
    name: "srvDetail",
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            VLAN_MODES,
            UNI_TYPES
        };
    },
    methods: {
        setProfile(data) {
            this.$emit("set-profile", data);
        }
    }
};
</script>

<style lang="less" scoped>
.srv-detail-item {
    margin: 20px 0;
    line-height: 28px;
    > div:first-child {
        text-align: right;
        padding-right: 20px;
    }
    .srv-detail-title {
        font-weight: bold;
        font-size: 12px;
        color: #909399;
        & + div {
            color: @titleColor;
        }
    }
}
</style>