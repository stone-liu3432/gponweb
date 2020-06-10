import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(
    /\/gponont_mgmt\?form=ethport&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const identifier =
            (url.match(/(?<=port_id=)\d+/) << 8) |
            (url.match(/(?<=ont_id=)\d+/) >>> 0);
        const n = Random.range(1, 4);
        const data = Array.from({ length: n }).map((item, index) => {
            return {
                identifier,
                ethport_id: index + 1,
                porttype: "GE",
                epspeed: Random.pick([0, 10, 100, 1000]),
                epduplex: Random.range(0, 1),
                epstatus: Random.range(0, 1),
                ring: Random.range(1, 2),
            };
        });
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.post("/gponont_mgmt?form=natvie_vlan");
Mock.post("/gponont_mgmt?form=port_attr");
Mock.post("/gponont_mgmt?form=port_vlan");

Mock.mock(
    /\/gponont_mgmt\?form=port_attr&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const identifier =
            (url.match(/(?<=port_id=)\d+/) << 8) |
            (url.match(/(?<=ont_id=)\d+/) >>> 0);
        const data = Array.from({ length: Random.range(1, 8) }).map(
            (item, index) => ({
                identifier,
                uniport: index + 1,
                unitype: Random.range(0, 1),
                epspeed: Random.pick([10, 100, 1000, 0xffff]),
                epduplex: Random.range(0, 1),
                epautoneg: Random.range(0, 1),
                flow_ctrl: Random.range(0, 1),
                adminstate: Random.range(0, 1),
                na_vlan_id: Random.range(1, 4096),
                na_vlan_pri: Random.pick([Random.range(0, 7), 15]),
                ring: Random.range(1, 2),
            })
        );
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);
