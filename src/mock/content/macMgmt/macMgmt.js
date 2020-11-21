import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_mac?form=age", "get", () => ({
    code: 1,
    message: "success",
    data: {
        age: Random.pick([0, Random.range(10, 1000000)]),
    },
}));

Mock.mock(/\/switch_mac\?form=age&value=\d+/, "get", "@BASESUCCESS");

Mock.mock("/sw_mac_table", "get", () => {
    const data = Array.from({
        length: Random.range(0, 8190),
    }).map((item, index) => ({
        macaddr: Random.mac(),
        vlan_id: index + 1,
        port_id: Random.range(0, 24),
        mac_type: Random.range(0, 2),
        link_aggregation: Random.range(0, 8),
        svp_id: Random.range(0, 8190) || 0xffff,
        ont_id: Random.range(0, 127),
        gemport: Random.range(1, 32),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_mac?form=table", "get", "@BASESUCCESS");
