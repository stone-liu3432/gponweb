import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(
    /\/gponont_mgmt\?form=olt_gemport&port_id=\d+&ont_id=\d+&gemport_id=\d+/,
    "get",
    ({ url }) => {
        const identifier =
            (url.match(/(?<=port_id=)\d+/) << 8) |
            (url.match(/(?<=ont_id=)\d+/) >>> 0);
        const data = Array.from({ length: Random.range(0, 32) }).map(
            (item, index) => ({
                identifier,
                gemport_id: index,
                rx_packets: Random.range(0, 20000000),
                rx_bytes: Random.range(0, 20000000),
                tx_packets: Random.range(0, 20000000),
                tx_bytes: Random.range(0, 20000000),
            })
        );
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=ont_gemport&port_id=\d+&ont_id=\d+&gemport_id=\d+/,
    "get",
    ({ url }) => {
        const identifier =
            (url.match(/(?<=port_id=)\d+/) << 8) |
            (url.match(/(?<=ont_id=)\d+/) >>> 0);
        const data = Array.from({ length: Random.range(0, 32) }).map(
            (item, index) => ({
                identifier,
                gemport_id: index,
                gem_rx_packets: Random.range(0, 20000000),
                gem_rx_bytes: Random.range(0, 20000000),
                gem_tx_packets: Random.range(0, 20000000),
                gem_tx_bytes: Random.range(0, 20000000),
                gem_encrypt_key_error: Random.range(0, 20000000),
            })
        );
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=ont_ethport&port_id=\d+&ont_id=\d+&uniport_id=\d+/,
    "get",
    ({ url }) => {
        const identifier =
            (url.match(/(?<=port_id=)\d+/) << 8) |
            (url.match(/(?<=ont_id=)\d+/) >>> 0);
        const data = Array.from({ length: Random.range(0, 4) }).map(
            (item, index) => ({
                identifier,
                ethport_id: index + 1,
                tx_frame: Random.range(0, 20000000),
                tx_buffer_overflows: Random.range(0, 20000000),
                tx_single_collision_frame: Random.range(0, 20000000),
                tx_multiple_collision_frame: Random.range(0, 20000000),
                tx_excessive_collision_frame: Random.range(0, 20000000),
                tx_late_collision_frame: Random.range(0, 20000000),
                sqe_test_error_message: Random.range(0, 20000000),
                tx_delay_frame: Random.range(0, 20000000),
                tx_mac_sub_layer_error_frame: Random.range(0, 20000000),
                carrier_sense_error_frame: Random.range(0, 20000000),
                tx_mtu_exceeded_discard_frame: Random.range(0, 20000000),
                rx_frame: Random.range(0, 20000000),
                rx_packet: Random.range(0, 20000000),
                rx_broadcast_packet: Random.range(0, 20000000),
                rx_multicast_packet: Random.range(0, 20000000),
                rx_octet: Random.range(0, 20000000),
                discard_frames_due_to_error: Random.range(0, 20000000),
                rx_undersize_packet: Random.range(0, 20000000),
                rx_oversize_packet: Random.range(0, 20000000),
                rx_fragment: Random.range(0, 20000000),
                rx_jabber: Random.range(0, 20000000),
                rx_packets_64_octet: Random.range(0, 20000000),
                rx_packets_65_127_octet: Random.range(0, 20000000),
                rx_packets_128_255_octet: Random.range(0, 20000000),
                rx_packets_256_511_octet: Random.range(0, 20000000),
                rx_packets_512_1023_octet: Random.range(0, 20000000),
                rx_packets_1024_1518_octet: Random.range(0, 20000000),
                pppoe_filtered_frame: Random.range(0, 20000000),
                rx_fcs_error_frame: Random.range(0, 20000000),
                rx_buffer_overflows: Random.range(0, 20000000),
                rx_alignment_error_frame: Random.range(0, 20000000),
                rx_mac_sub_layer_error_frame: Random.range(0, 20000000),
            })
        );
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);
