import Mock from "@/mock";

Mock.mock("/pon_loop_detect?form=loop_detect_config", "get", {
    code: 1,
    message: "success",
    data: {
        ld_status: "@STATUS",
        recover_mode: "@STATUS",
        recover_time: "@RANGE(3,3600)",
        detect_interval: "@RANGE(3,3600)"
    }
});

Mock.mock("/switch_loop_detect?form=loop_detect_config", "get", {
    code: 1,
    message: "success",
    data: {
        ld_status: "@STATUS",
        recover_mode: "@STATUS",
        recover_time: "@RANGE(3,3600)",
        detect_interval: "@RANGE(3,3600)"
    }
});

Mock.mock("/pon_loop_detect?form=loop_detect_info", "get", {
    code: 1,
    message: "success",
    data: [
        {
            status: "@STATUS",
            onu_status: "@STATUS",
            port_id: "@RANGE(1,8)",
            onu_id: "@RANGE(1,128)",
            ld_port_id: "@RANGE(1,8)",
            ld_onu_id: "@RANGE(1,128)"
        }
    ]
});

Mock.mock("/switch_loop_detect?form=loop_detect_info", "get", {
    code: 1,
    message: "success",
    data: [
        {
            status: "@STATUS",
            port_status: "@STATUS",
            port_id: "@RANGE(1,8)",
            ld_port_id: "@RANGE(1,8)"
        }
    ]
});

Mock.mock("/pon_loop_detect?form=admin", "post", "@BASESUCCESS");

Mock.mock("/switch_loop_detect?form=admin", "post", "@BASESUCCESS");

Mock.mock("/pon_loop_detect?form=recover_mode", "post", "@BASESUCCESS");

Mock.mock("/switch_loop_detect?form=recover_mode", "post", "@BASESUCCESS");

Mock.mock("/pon_loop_detect?form=detect_interval", "post", "@BASESUCCESS");

Mock.mock("/switch_loop_detect?form=detect_interval", "post", "@BASESUCCESS");

Mock.mock("/pon_loop_detect?form=recover_time", "post", "@BASESUCCESS");

Mock.mock("/switch_loop_detect?form=recover_time", "post", "@BASESUCCESS");

Mock.mock("/pon_loop_detect?form=recover_manual", "post", "@BASESUCCESS");

Mock.mock("/switch_loop_detect?form=recover_manual", "post", "@BASESUCCESS");
