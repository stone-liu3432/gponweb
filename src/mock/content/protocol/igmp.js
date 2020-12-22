import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_igmp?form=config", "get", () => {
    return {
        code: 1,
        message: "success",
        data: {
            mode: Random.range(0, 2),
            fast_leave: Random.range(0, 1),
            protocol_policy: Random.range(0, 1),
            group_aging_time: Random.range(1, 3000),
            robustness: Random.range(1, 10),
            query_src_ip: Random.ip(),
            query_src_mac: Random.mac(),
            gen_response_time: Random.range(1, 25),
            gen_query_interval: Random.range(2, 3000),
            sp_response_time: Random.range(100, 10000),
            sp_query_interval: Random.range(100, 10000),
            sp_query_number: Random.range(1, 10),
        },
    };
});

Mock.mock("/switch_igmp?form=mode", "post", "@BASESUCCESS");

Mock.mock("/switch_igmp?form=config", "post", "@BASESUCCESS");

Mock.mock("/switch_igmp?form=entry", "get", "@BASESUCCESS");

Mock.mock("/igmp_snooping_table", "get", () => {
    const data = Array.from({ length: Random.range(0, 1024) }).map(
        (item, index) => {
            return {
                multi_ip: Random.ip(),
                vid: Random.vlan(),
                action: Random.range(0, 1),
                host_portlist: Random.portlist(),
                router_portlist: Random.portlist(),
            };
        }
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_igmp?form=multicast_vlan", "get", () => {
    const data = Array.from({ length: Random.range(0, 1024) }).map(
        (item, index) => {
            return {
                mvlan: Random.vlan(),
                router_portlist: Random.portlist("uplink"),
                mvlan_desc: Random.word(1, 64),
            };
        }
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_igmp?form=multicast_vlan_desc", "post", "@BASESUCCESS");

Mock.mock(/\/switch_igmp\?form=mc_unknown&mvlan=\d+/, "get", ({ url }) => ({
    code: 1,
    message: "success",
    data: {
        mc_unknown_policy: Random.range(0, 1),
    },
}));
Mock.mock(/\/switch_igmp\?form=program&mvlan=\d+/, "get", ({ url }) => {
    const data = Array.from({ length: Random.range(0, 1024) }).map((item) => {
        return {
            program_s: Random.ip(),
            program_e: Random.ip(),
            program_desc: Random.word(0, 64),
        };
    });
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_igmp?form=multicast_vlan");

Mock.post("/switch_igmp?form=program");

Mock.post("/switch_igmp?form=router_port");

Mock.post("/switch_igmp?form=mc_unknown");

Mock.post("/switch_igmp?form=static_entry");

Mock.post("/switch_igmp?form=dynamic_entry");

Mock.post("/switch_igmp?form=static_entry_all");

Mock.post("/switch_igmp?form=dynamic_entry_all");
