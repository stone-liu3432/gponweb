import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_dhcp?form=global_config", "get", () => {
    return {
        code: 1,
        message: "success",
        data: {
            dhcp_admin: 1,
            relay_admin: Random.range(0, 1),
            relay_policy: Random.range(0, 1),
            option82_admin: Random.range(0, 1),
            option82_policy: Random.range(0, 2),
            option82_circuit: 1,
            option82_remote: 1,
            snooping_admin: Random.range(0, 1),
            chaddr_check: Random.range(0, 1),
            response_time: Random.range(3, 3600),
            trust_portlist: Random.portlist("uplink"),
            server_admin: Random.range(0, 1),
            ipaddress_s: Random.ip(),
            ipaddress_e: Random.ip(),
            ipmask: Random.ip(),
            interface: Random.vlan(),
            pridns: Random.ip(),
            secdns: Random.ip(),
            gateway: Random.ip(),
            lease_time: Random.range(6, 864000),
        },
    };
});

Mock.mock("/switch_dhcp?form=relay_standard", "get", () => {
    const data = Array.from({ length: Random.range(0, 4094) }).map(
        (item, index) => ({
            vlan_id: index + 1,
            server_ip: Random.ip(),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_dhcp?form=relay_option60", "get", () => {
    const data = Array.from({ length: Random.range(0, 128) }).map((item) => ({
        option60: Random.word(1, 64),
        server_ip: Random.ip(),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_dhcp?form=snooping_table", "get", () => {
    const data = Array.from({ length: Random.range(0, 128) }).map((item) => ({
        ipaddr: Random.ip(),
        macaddr: Random.mac(),
        port_id: Random.range(17, 24),
        vlan_id: Random.vlan(),
        lease_time: Random.range(60, 864000),
        entry_status: Random.range(0, 1),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_dhcp?form=dhcp_admin");

Mock.post("/switch_dhcp?form=snooping_admin");

Mock.post("/switch_dhcp?form=snooping_trust_add");

Mock.post("/switch_dhcp?form=snooping_chaddr");

Mock.post("/switch_dhcp?form=snooping_response");

Mock.post("/switch_dhcp?form=snooping_flush");

Mock.post("/switch_dhcp?form=option82_admin");

Mock.post("/switch_dhcp?form=option82_policy");

Mock.post("/switch_dhcp?form=relay_admin");

Mock.post("/switch_dhcp?form=relay_policy");

Mock.post("/switch_dhcp?form=relay_standard_add");

Mock.post("/switch_dhcp?form=relay_option60_add");

Mock.post("/switch_dhcp?form=relay_standard_del");

Mock.post("/switch_dhcp?form=relay_option60_del");

Mock.post("/switch_dhcp?form=snooping_trust_del");

Mock.post("/switch_dhcp?form=server_admin");

Mock.post("/switch_dhcp?form=server_cfg");
