import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock(/\/switch_port\?form=port_info&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            admin_status: Random.status(),
            link_status: Random.status(),
            auto_neg: Random.status(),
            speed: "1000M",
            duplex: Random.status(),
            flow_ctrl: Random.status(),
            mtu: Random.range(128, 2000),
            media: "fiber",
            erate: Random.range(64, 1024000),
            irate: Random.range(64, 1024000),
            pvid: Random.range(1, 4094),
            link_aggregation: 0,
            port_desc: Random.word(0, 64),
        },
    };
});

Mock.mock(/\/switch_port\?form=stormctrl&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            broadcast: Random.range(0, 1488100),
            multicast: Random.range(0, 1488100),
            unicast: Random.range(0, 1488100),
        },
    };
});

Mock.mock(/\/switch_port\?form=mirror&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            src_port: port_id,
            dst_port: Random.range(0, 12),
            type: Random.range(0, 3),
        },
    };
});

Mock.mock("/switch_port?form=port_info", "post", "@BASESUCCESS");

Mock.mock("/switch_port?form=stormctrl", "post", "@BASESUCCESS");

Mock.mock("/switch_port?form=mirror", "post", "@BASESUCCESS");

Mock.mock("/switch_port?form=stormctrl_all", "get", () => {
    const data = Array.from({ length: 24 }).map((item, index) => ({
        port_id: index + 1,
        broadcast: Random.range(0, 1488100),
        multicast: Random.range(0, 1488100),
        unicast: Random.range(0, 1488100),
        link_aggregation: 0,
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_port?form=mirror_all", "get", () => {
    const data = Array.from({ length: 24 }).map((item, index) => ({
        port_id: index + 1,
        src_port: index + 1,
        dst_port: Random.range(1, 24),
        type: Random.range(1, 3),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});
