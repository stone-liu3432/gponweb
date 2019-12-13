import Mock from "@/mock";

// advanced menu
Mock.mock("/board?info=menu", "get", {
    code: 1,
    msg: "success",
    data: {
        page: "advanced",
        menu: [
            {
                name: "running_status"
            },
            {
                name: "system_mgmt",
                children: [
                    { name: "dev_mgmt" },
                    { name: "diagonose" },
                    { name: "remote_mgmt" },
                    { name: "upgrade" },
                    { name: "time" },
                    { name: "service" },
                    { name: "alarm" },
                    { name: "user_mgmt" }
                ]
            },
            {
                name: "pon_mgmt",
                children: [
                    { name: "onu_deny" },
                    { name: "sla_cfg" },
                    { name: "pon_setting" },
                    { name: "loid_mgmt" },
                    { name: "onu_batch_upgrade" },
                    { name: "pon_optical" },
                    { name: "batch_config" }
                ]
            },
            {
                name: "onu_mgmt",
                children: [
                    { name: "onu_basic_info" },
                    { name: "onu_port_cfg" },
                    { name: "onu_multicast" },
                    { name: "onu_perf_info" }
                ]
            },
            {
                name: "swport_mgmt",
                children: [
                    { name: "port_info" },
                    { name: "perf_info" },
                    { name: "port_cfg" },
                    { name: "port_vlan" },
                    { name: "loop_detect" }
                ]
            },
            {
                name: "mac_mgmt"
            },
            {
                name: "protocol_mgmt",
                children: [{ name: "rstp" }, { name: "igmp" }, { name: "dhcp" }]
            },
            {
                name: "ACL/QoS",
                children: [
                    { name: "time_range" },
                    { name: "acl_mgmt" },
                    { name: "packet_filter" },
                    { name: "QoS" }
                ]
            },
            {
                name: "route",
                children: [{ name: "route_mgmt" }, { name: "ARP" }]
            },
            {
                name: "link_aggregation"
            }
        ]
    }
});

// nav
Mock.mock("/board?info=nav", "get", {
    code: 1,
    message: "success",
    data: {
        page: "nav",
        menu: [
            { name: "status" },
            { name: "onu_allow" },
            { name: "virtual_port" },
            { name: "advanced_setting" }
        ]
    }
});
