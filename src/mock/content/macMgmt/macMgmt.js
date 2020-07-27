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

Mock.mock("/switch_mac?form=table", "post", ({ body }) => {
    const { method, param } = JSON.parse(body);
    if (method !== "get") {
        return {
            code: 1,
            message: "success",
        };
    }
    /*
        "flags":1,   flags定义， mac_type: 1, port_id: 2, vlan_id: 4, mac:8
        "count":0,
        "mac_type":3,   mac_type定义： 0-dynamic, 1-static, 2-blackhole, 3-all
        "port_id":1,
        "vlan_id":10,
        "vlan_id_e":100,
        "macaddr":"00:00:00:00:00:11",
        "macmask":"00:00:00:00:00:ff"
    */
    const { flags, mac_type, port_id, vlan_id, vlan_id_e } = param;
    const data = Array.from({
        length: flags === 4 ? vlan_id_e - vlan_id : Random.range(0, 8190),
    }).map((item, index) => ({
        macaddr: Random.mac(),
        vlan_id: flags === 4 ? vlan_id + index : Random.range(1, 4094),
        port_id: flags === 2 ? port_id : Random.range(1, 24),
        mac_type: mac_type !== 3 ? mac_type : Random.range(0, 2),
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
