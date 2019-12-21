"use strict";

import Mock from "@/mock";

const Random = Mock.Random;
const hex = _ => {
    const s = Random.range(0, 255).toString(16);
    return s.length < 2 ? "0" + s : s;
};

Mock.mock("/system?form=outbound", "get", {
    code: 1,
    message: "success",
    data: {
        ipaddr: `192.168.${Random.range(0, 255)}.${Random.range(0, 255)}`,
        ipmask: "255.255.255.0",
        interface: "outbound",
        mtu: "@RANGE(0,1500)",
        macaddr: `38:3A:21:${hex()}:${hex()}:${hex()}`,
        rcvpkts: "@RANGE(0,200000)",
        rcvbytes: "@RANGE(0,200000)",
        transpkts: "@RANGE(0,200000)",
        transbytes: "@RANGE(0,200000)"
    }
});

Mock.mock("/system?form=inbound", "get", {
    code: 1,
    message: "success",
    data: [
        {
            ipaddr: `192.168.${Random.range(0, 255)}.${Random.range(0, 255)}`,
            ipmask: "255.255.255.0",
            interface: `vlanif-${Random.range(1, 4094)}`,
            vlan_id: "@RANGE(1,4094)",
            mtu: "@RANGE(0,1500)",
            macaddr: `38:3A:21:${hex()}:${hex()}:${hex()}`,
            rcvpkts: "@RANGE(0,200000)",
            rcvbytes: "@RANGE(0,200000)",
            transpkts: "@RANGE(0,200000)",
            transbytes: "@RANGE(0,200000)"
        },
        {
            ipaddr: `192.168.${Random.range(0, 255)}.${Random.range(0, 255)}`,
            ipmask: "255.255.255.0",
            interface: `vlanif-${Random.range(1, 4094)}`,
            vlan_id: "@RANGE(1,4094)",
            mtu: "@RANGE(0,1500)",
            macaddr: `38:3A:21:${hex()}:${hex()}:${hex()}`,
            rcvpkts: "@RANGE(0,200000)",
            rcvbytes: "@RANGE(0,200000)",
            transpkts: "@RANGE(0,200000)",
            transbytes: "@RANGE(0,200000)"
        }
    ]
});

Mock.mock("/diagnose?form=ping", "post", "@BASESUCCESS");

const str =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit.\
     Magni, fugiat, quis architecto reprehenderit laborum ea enim \
     obcaecati amet iure repudiandae corrupti dignissimos ratione, \
     deleniti officiis distinctio. Consequatur explicabo perferendis autem.";

Mock.mock("/diagnose?form=ping", "get", {
    code: 1,
    message: "success",
    data: {
        result: str.slice(0, Random.range(1, 251)),
        finish: "@STATUS"
    }
});
