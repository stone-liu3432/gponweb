import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock(/\/switch_port\?form=vlan&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            port_type: Random.natural(1, 3),
            pvid: Random.natural(1, 4094),
            tagged_vlan: "1,5-20,33,35",
            untagged_vlan: "2,4,22-30,122",
        },
    };
});

Mock.mock(/\/vlan_action\?form=translate&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    let len = Random.natural(1, 30);
    const data = [];
    while (len--) {
        data.push({
            port_id,
            old_vlan: Random.natural(1, 4094),
            new_vlan: Random.natural(1, 4094),
            new_vlan_pri: Random.status([0, 1, 2, 3, 4, 5, 6, 7, 255]),
            action: 0,
        });
    }
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock(/\/vlan_action\?form=qinq&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    let len = Random.natural(3, 30);
    const data = [];
    while (len--) {
        data.push({
            port_id,
            cvlan: Random.natural(1, 4094),
            cvlan_s: 0,
            cvlan_e: 0,
            svlan: Random.natural(1, 4094),
            svlan_pri: Random.status([0, 1, 2, 3, 4, 5, 6, 7, 255]),
            action: 1,
        });
    }
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_port?form=vlan_type", "post", "@BASESUCCESS");

Mock.mock("/switch_port?form=defaultvlan", "post", "@BASESUCCESS");

Mock.mock("/switch_port?form=vlan", "post", "@BASESUCCESS");

Mock.mock("/vlan_action?form=translate", "post", "@BASESUCCESS");

Mock.mock("/vlan_action?form=qinq", "post", "@BASESUCCESS");

Mock.mock("/switch_port?form=vlanall", "get", () => {
    const data = Array.from({ length: 24 }).map((item, index) => ({
        port_id: index + 1,
        port_type: Random.range(1, 3),
        pvid: Random.vlan(),
        priority: Random.range(0, 8),
        tagged_vlan: "1,3-18",
        untagged_vlan: "2,22-24",
        link_aggregation: 0,
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});
