import Mock from "@/mock";

Mock.mock("/board?info=system", "get", {
    code: 1,
    message: "success",
    data: {
        product_name: "HSGQ-E08",
        sys_ver: "I_V1.0.0_Rel",
        fw_ver: "I_V1.0.0_Rel",
        hw_ver: "I_V1.0.0_Rel",
        bl_ver: "V1.0_Rel",
        macaddr: "38:3a:21:f0:01:b0",
        ponports: 16,
        geports: 8,
        xgeports: 8,
        vendor: "hsgq",
        build_time: "2017/11/22 09:32:48"
    }
});

Mock.mock("/board?info=pon", "get", {
    code: 1,
    message: "success",
    data: [
        {
            port_id: 1,
            status: "@STATUS",
            online: 2,
            offline: 3
        },
        {
            port_id: 2,
            status: "@STATUS",
            online: 2,
            offline: 3
        },
        {
            port_id: 3,
            status: "@STATUS",
            online: 2,
            offline: 3
        },
        {
            port_id: 4,
            status: "@STATUS",
            online: 2,
            offline: 3
        }
    ]
});

Mock.mock("/switch_port?form=portlist_info", "get", {
    code: 1,
    message: "success",
    data: [
        {
            port_id: 1,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1
        },
        {
            port_id: 2,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1
        },
        {
            port_id: 3,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1
        },
        {
            port_id: 4,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1
        },
        {
            port_id: 5,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "copper",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        },
        {
            port_id: 6,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "copper",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        },
        {
            port_id: 7,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "copper",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        },
        {
            port_id: 8,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "copper",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        },
        {
            port_id: 9,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        },
        {
            port_id: 10,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        },
        {
            port_id: 11,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        },
        {
            port_id: 12,
            admin_status: "@STATUS",
            link_status: "@STATUS",
            auto_neg: "@STATUS",
            speed: "1000M",
            duplex: 1,
            flow_ctrl: "@STATUS",
            mtu: 1500,
            media: "fiber",
            pvid: 1,
            link_aggregation: "@RANGE(0,8)"
        }
    ]
});
