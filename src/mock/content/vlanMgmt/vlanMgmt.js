import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_vlan", "get", "@BASESUCCESS");

Mock.mock("/vlantable", "get", () => {
    const data = Array.from({ length: Random.range(0, 4094) }).map(
        (item, index) => ({
            vlan_id: index + 1,
            tagged_portlist: Random.portlist("uplink"),
            untagged_portlist: Random.portlist("uplink"),
            default_vlan_portlist: Random.portlist("uplink"),
            vlan_name: Random.word(1, 16),
            vlan_desc: Random.word(1, 64),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_vlan");

Mock.post("/switch_vlanlist");

Mock.post("/switch_vlan_pvid");

Mock.post("/switch_vlan?form=vlan_desc");

Mock.post("/switch_vlan?form=vlan_name");
