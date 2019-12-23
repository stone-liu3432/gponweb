<template>
    <el-card shadow="never" style="margin: 20px 10px;">
        <template slot="header">
            <span>{{ $lang(boundData.interface) || boundData.interface || `vlanif-${boundData.vlan_id}` }}</span>
            <el-button
                type="text"
                style="float: right; padding: 3px 0; margin-right: 30px;"
                size="medium"
                @click="handleConfig('config')"
            >{{ $lang('config') }}</el-button>
            <el-button
                v-if="type !== 'outbound'"
                type="text"
                style="float: right; padding: 3px 0; margin-right: 30px;"
                size="medium"
                @click="handleConfig('delete')"
            >{{ $lang('delete') }}</el-button>
        </template>
        <el-row :gutter="20" class="remote-card-row">
            <el-col :span="8" class="remote-card-col">
                <el-row>
                    <el-col :span="12">{{ $lang('ipaddr') }}:</el-col>
                    <el-col :span="12">{{ boundData.ipaddr }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="8" class="remote-card-col">
                <el-row>
                    <el-col :span="12">{{ $lang('ipmask') }}:</el-col>
                    <el-col :span="12">{{ boundData.ipmask }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="8" v-if="boundData.vlan_id" class="remote-card-col">
                <el-row>
                    <el-col :span="12">{{ $lang('vlan_id') }}:</el-col>
                    <el-col :span="12">{{ boundData.vlan_id }}</el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="remote-card-row">
            <el-col :span="8" class="remote-card-col">
                <el-row>
                    <el-col :span="12">{{ $lang('rcvpkt') }}:</el-col>
                    <el-col :span="12">{{ boundData.rcvpkts }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="8" class="remote-card-col">
                <el-row>
                    <el-col :span="12">{{ $lang('rcvbytes') }}:</el-col>
                    <el-col :span="12">{{ boundData.rcvbytes }}</el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="remote-card-row">
            <el-col :span="8" class="remote-card-col">
                <el-row>
                    <el-col :span="12">{{ $lang('transpkt') }}:</el-col>
                    <el-col :span="12">{{ boundData.transpkts }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="8" class="remote-card-col">
                <el-row>
                    <el-col :span="12">{{ $lang('transbytes') }}:</el-col>
                    <el-col :span="12">{{ boundData.transbytes }}</el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
    name: "remoteCard",
    computed: {
        ...mapGetters(["$lang"]),
        type() {
            return this.boundData.interface === "outbound"
                ? "outbound"
                : "inbound";
        }
    },
    props: {
        boundData: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleConfig(action) {
            this.$emit("handle-config", this.boundData, this.type, action);
        }
    }
};
</script>

<style lang="less" scoped>
.remote-card-row {
    .base-font-style;
    border-bottom: @border-style;
    &:last-child {
        border-bottom: none;
    }
    .remote-card-col {
        padding: 10px 0;
        border-left: @border-style;
        &:first-child {
            border-left: none;
        }
    }
}
</style>