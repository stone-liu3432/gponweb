"use strict";

import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/system?form=inbound", "post", "@BASESUCCESS");

Mock.mock("/system?form=outbound", "post", "@BASESUCCESS");

Mock.mock("/switch_route?form=route_default", "get", () => ({
    code: 1,
    message: "success",
    data: {
        gateway: Random.ip(),
        gateway_v6: Random.ipv6(),
    },
}));

Mock.post("/switch_route?form=route_default");
Mock.post("/switch_route?form=route_default_v6");
Mock.post("/system?form=dns_v6");

Mock.mock("/system?form=dns", "get", () => ({
    code: 1,
    message: "success",
    data: {
        primary: Random.ip(),
        secondary: Random.ip(),
        primary_v6: Random.ipv6(),
        secondary_v6: Random.ipv6(),
    },
}));

Mock.post("/system?form=dns");

Mock.mock("/system?form=outbound", "get", {
    code: 1,
    message: "success",
    data: {
        admin: Random.range(1, 2),
        telnet_status: Random.range(1, 2),
        ipaddr: `192.168.${Random.range(0, 255)}.${Random.range(0, 255)}`,
        ipmask: "255.255.255.0",
        interface: "outbound",
        mtu: "@RANGE(0,1500)",
        macaddr: Random.mac(),
        rcvpkts: "@RANGE(0,200000)",
        rcvbytes: "@RANGE(0,200000)",
        transpkts: "@RANGE(0,200000)",
        transbytes: "@RANGE(0,200000)",
        ipv6_address: Array.from({ length: Random.range(0, 10) }).map(() => ({
            ipv6: Random.ipv6(),
        })),
    },
});

Mock.mock("/system?form=inbound", "get", {
    code: 1,
    message: "success",
    data: Array.from({ length: Random.range(1, 10) }).map(() => ({
        telnet_status: Random.range(1, 2),
        ipaddr: `192.168.${Random.range(0, 255)}.${Random.range(0, 255)}`,
        ipmask: "255.255.255.0",
        interface: `vlanif-${Random.range(1, 4094)}`,
        vlan_id: "@RANGE(1,4094)",
        mtu: "@RANGE(0,1500)",
        macaddr: Random.mac(),
        rcvpkts: "@RANGE(0,200000)",
        rcvbytes: "@RANGE(0,200000)",
        transpkts: "@RANGE(0,200000)",
        transbytes: "@RANGE(0,200000)",
        ipv6_address: Array.from({ length: Random.range(0, 10) }).map(() => ({
            ipv6: Random.ipv6(),
        })),
    })),
});

Mock.post("/system?form=telnet_status");
Mock.post("/system?form=outbound_v6");
Mock.post("/system?form=inbound_v6");
Mock.post("/system?form=admin");
