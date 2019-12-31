import Mock from "@/mock";

Mock.mock("/switch_rstp?form=bridge", "get", {
    code: 1,
    message: "success",
    data: {
        status: "@STATUS",
        rstp_mode: 2,
        rb_priority: 1,
        rb_address: "@MAC",
        db_priority: 1,
        db_address: "@MAC",
        max_age: "@RANGE(6,40)",
        hello_time: "@RANGE(1,10)",
        forward_delay: "@RANGE(4,30)",
        transmit_hold_count: "@RANGE(1,255)",
        root_path_cost: 1
    }
});

Mock.mock("/switch_rstp?form=port", "get", {
    code: 1,
    message: "success",
    data: [
        {
            port_id: 5,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        },
        {
            port_id: 6,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        },
        {
            port_id: 7,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        },
        {
            port_id: 8,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        },
        {
            port_id: 9,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        },
        {
            port_id: 10,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        },
        {
            port_id: 11,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        },
        {
            port_id: 12,
            port_priority: 1,
            port_path_cost: "@RANGE(0,200000000)",
            edge_status: "@STATUS",
            admin_link_type: "@STATUS(['auto','p2p','shared'])",
            oper_link_type: "@STATUS(['p2p','shared'])",
            port_role: "",
            port_state: "",
            link_aggregation: 0
        }
    ]
});

Mock.mock("/switch_rstp?form=bridge", "post", "@BASESUCCESS");

Mock.mock("/switch_rstp?form=port", "post", "@BASESUCCESS");
