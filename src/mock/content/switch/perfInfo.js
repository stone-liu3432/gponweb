import Mock from "@/mock";

Mock.mock("/switch_port?form=statistictab", "get", () => {
    const data = [],
        Random = Mock.Random;
    for (let i = 0; i < 12; i++) {
        data.push({
            port_id: i + 1,
            rx_octets: Random.natural(0, 1024000),
            rx_frame: Random.natural(0, 1024000),
            rx_discard_frame: Random.natural(0, 1024000),
            rx_error_frame: Random.natural(0, 1024000),
            tx_octets: Random.natural(0, 1024000),
            tx_frame: Random.natural(0, 1024000),
            tx_discard_frame: Random.natural(0, 1024000),
            tx_error_frame: Random.natural(0, 1024000)
        });
    }
    return {
        code: 1,
        message: "success",
        data
    };
});

Mock.mock(/\/switch_port\?form=nostatistic&port_id=\d/, "get", "@BASESUCCESS");

Mock.mock(/\/switch_port\?form=statistic&port_id=\d/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    const Random = Mock.Random;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            rx_octets: Random.natural(0, 1024000),
            rx_frame: Random.natural(0, 1024000),
            rx_unicast_frame: Random.natural(0, 1024000),
            rx_broadcast_frame: Random.natural(0, 1024000),
            rx_multicast_frame: Random.natural(0, 1024000),
            rx_discard_frame: Random.natural(0, 1024000),
            rx_error_frame: Random.natural(0, 1024000),
            rx_oversize_frame: Random.natural(0, 1024000),
            rx_frame_64: Random.natural(0, 1024000),
            rx_frame_127: Random.natural(0, 1024000),
            rx_frame_255: Random.natural(0, 1024000),
            rx_frame_511: Random.natural(0, 1024000),
            rx_frame_1023: Random.natural(0, 1024000),
            rx_frame_1518: Random.natural(0, 1024000),
            tx_octets: Random.natural(0, 1024000),
            tx_frame: Random.natural(0, 1024000),
            tx_unicast_frame: Random.natural(0, 1024000),
            tx_broadcast_frame: Random.natural(0, 1024000),
            tx_multicast_frame: Random.natural(0, 1024000),
            tx_discard_frame: Random.natural(0, 1024000),
            tx_error_frame: Random.natural(0, 1024000),
            tx_oversize_frame: Random.natural(0, 1024000),
            tx_frame_64: Random.natural(0, 1024000),
            tx_frame_127: Random.natural(0, 1024000),
            tx_frame_255: Random.natural(0, 1024000),
            tx_frame_511: Random.natural(0, 1024000),
            tx_frame_1023: Random.natural(0, 1024000),
            tx_frame_1518: Random.natural(0, 1024000)
        }
    };
});
