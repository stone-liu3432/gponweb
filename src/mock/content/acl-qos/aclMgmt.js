import Mock from "@/mock";

const { Random } = Mock;

const hex = () => {
    const s = () =>
        Random.pick([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
        ]);
    return s() + s() + s() + s();
};

Mock.mock(
    /\/switch_acl\?form=acl&sacl_id=\d+&eacl_id=\d+/,
    "get",
    ({ url }) => {
        const baseRule = () =>
            Array.from({ length: Random.range(0, 16) }).map((item, index) => ({
                rule_id: index + 1,
                action: Random.range(1, 2),
                src_ipaddr: Random.ip(),
                src_ipmask: Random.ip(),
                timerange: Random.word(3, 16),
            }));
        const advRule = () =>
            Array.from({ length: Random.range(0, 16) }).map((item, index) => ({
                rule_id: index + 1,
                action: Random.range(1, 2),
                protocol: Random.pick([
                    "icmp",
                    "udp",
                    "tcp",
                    "ip",
                    "ipinip",
                    Random.range(0, 255),
                ]),
                src_ipaddr: Random.ip(),
                src_ipmask: Random.ip(),
                dst_ipaddr: Random.ip(),
                dst_ipmask: Random.ip(),
                src_port: Random.range(1, 24),
                dst_port: Random.range(1, 24),
                precedence: Random.range(0, 7),
                dscp: Random.range(0, 63),
                timerange: Random.word(3, 16),
            }));
        const linkRule = () =>
            Array.from({ length: Random.range(0, 16) }).map((item, index) => ({
                rule_id: index + 1,
                action: Random.range(1, 2),
                eth_type: Random.range(0, 0xffff),
                cos: Random.range(0, 7),
                inner_cos: Random.range(0, 7),
                vlan_id: Random.vlan(),
                inner_vlan_id: Random.vlan(),
                src_mac: Random.mac(),
                src_mask: `${hex()}-${hex()}-${hex()}`,
                dst_mac: Random.mac(),
                dst_mask: `${hex()}-${hex()}-${hex()}`,
                timerange: Random.word(3, 16),
            }));
        const res = [];
        const data = Array.from({ length: Random.range(0, 256) })
            .map(() => {
                const acl_id = Random.range(0, 3999) + 2000;
                return {
                    acl_id,
                    rule:
                        acl_id < 3000
                            ? baseRule()
                            : acl_id < 5000
                            ? advRule()
                            : linkRule(),
                };
            })
            .filter((item) => {
                if (!res.includes(item.acl_id)) {
                    res.push(item.acl_id);
                    return true;
                }
                return false;
            });
        data.sort((a, b) => a.acl_id - b.acl_id);
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.post("/switch_acl?form=rule");

Mock.post("/switch_acl?form=rulepri");

Mock.post("/switch_acl?form=acl");
