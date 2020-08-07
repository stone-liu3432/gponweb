<template>
    <div>
        <template v-if="perfs.length">
            <div style="margin: 10px 0 10px 10px;">
                <span>{{ $lang('ethport_id') }}</span>
                <el-select v-model="ethport_id" style="margin-left: 30px;" size="small">
                    <template v-for="item in perfs">
                        <el-option :value="item.ethport_id"></el-option>
                    </template>
                </el-select>
            </div>
            <el-row :gutter="20" style="width: 900px;">
                <el-col :span="12">
                    <template v-for="item in leftKeys">
                        <div class="ont-eth-info-item">
                            <span>{{ $lang(item) }}:</span>
                            <span>{{ info[item] }}</span>
                        </div>
                    </template>
                </el-col>
                <el-col :span="12">
                    <template v-for="item in rightKeys">
                        <div class="ont-eth-info-item">
                            <span>{{ $lang(item) }}:</span>
                            <span>{{ info[item] }}</span>
                        </div>
                    </template>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <div class="tips">{{ $lang('no_more_data') }}</div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "ontEthPerf",
    computed: {
        ...mapGetters(["$lang"]),
        info() {
            const info = this.perfs.filter(
                item => item.ethport_id === this.ethport_id
            )[0];
            if (!info && this.perfs.length) {
                this.ethport_id = this.perfs[0].ethport_id;
                return this.perfs[0];
            }
            return info || {};
        },
        leftKeys() {
            return [
                "rx_frame",
                "rx_packet",
                "rx_broadcast_packet",
                "rx_multicast_packet",
                "rx_octet",
                "discard_frames_due_to_error",
                "rx_undersize_packet",
                "rx_oversize_packet",
                "rx_fragment",
                "rx_jabber",
                "rx_packets_64_octet",
                "rx_packets_65_127_octet",
                "rx_packets_128_255_octet",
                "rx_packets_256_511_octet",
                "rx_packets_512_1023_octet",
                "rx_packets_1024_1518_octet",
                "rx_fcs_error_frame",
                "rx_buffer_overflows",
                "rx_alignment_error_frame",
                "rx_mac_sub_layer_error_frame"
            ];
        },
        rightKeys() {
            return [
                "tx_frame",
                "tx_buffer_overflows",
                "tx_single_collision_frame",
                "tx_multiple_collision_frame",
                "tx_excessive_collision_frame",
                "tx_late_collision_frame",
                "sqe_test_error_message",
                "tx_delay_frame",
                "tx_mac_sub_layer_error_frame",
                "carrier_sense_error_frame",
                "tx_mtu_exceeded_discard_frame",
                "pppoe_filtered_frame"
            ];
        }
    },
    props: {
        perfs: {
            type: Array
        }
    },
    data() {
        return {
            ethport_id: 1
        };
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.ont-eth-info-item {
    .base-font-style;
    margin: 12px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
        &:first-child {
            width: 250px;
            padding-right: 12px;
        }
    }
}
div.tips {
    .base-font-style;
    margin: 0 0 0 10px;
}
</style>