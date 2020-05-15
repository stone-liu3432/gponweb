import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_mstp?form=mstp_status", "get", () => {
    return {
        code: 1,
        message: "success",
        data: {
            mstp_status: 1,
        },
    };
});

Mock.post("/switch_mstp?form=mstp_status");

Mock.post("/switch_mstp?form=regional_name_set");

Mock.post("/switch_mstp?form=revision_level_set");

Mock.mock("/switch_mstp?form=mst_regional_get", "get", () => {
    return {
        code: 1,
        message: "success",
        data: {
            format_selector: 0,
            regional_name: Random.word(1, 32),
            revision_level: Random.range(0, 128),
            conf_digest: Random.word(16),
        },
    };
});

Mock.post("/switch_mstp?form=cist_bridge_set");

Mock.mock("/switch_mstp?form=cist_bridge_get", "get", () => {
    return {
        code: 1,
        message: "success",
        data: {
            msti_vlanlist: "1-4094",
            bridge_addr: Random.mac(),
            bridge_prio: 32768,
            designate_addr: Random.mac(),
            designate_prio: 32768,
            regional_addr: Random.mac(),
            regional_prio: 32768,
            root_port_name: Random.range(17, 24),
            internal_path_cost: 0,
            root_path_cost: 0,
            bridge_hello_time: Random.range(1, 10),
            bridge_forward_delay: Random.range(4, 30),
            bridge_max_age: Random.range(6, 40),
            max_hops: Random.range(1, 40),
            root_hello_time: 2,
            root_forward_delay: 15,
            root_max_age: 20,
        },
    };
});

Mock.post("/switch_mstp?form=cist_port_set");

Mock.post("/switch_mstp?form=cist_edge_port_set");

Mock.mock("/switch_mstp?form=cist_port_get", "get", () => {
    const data = Array.from({ length: 8 }).map((item, index) => ({
        port_id: 17 + index,
        port_role: Random.range(0, 5),
        port_priority: Random.range(0, 15) * 16,
        port_state: Random.range(0, 4),
        admin_external_cost: Random.range(0, 1),
        external_cost: Random.range(0, 1),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_mstp?form=msti_priority_set");

Mock.post("/switch_mstp?form=msti_port_set");

Mock.post("/switch_mstp?form=mcheck_trigger");

Mock.post("/switch_mstp?form=loop_detect_guard");

Mock.mock("/switch_mstp?form=msti_status_get", "get", () => {
    const msti_port = () =>
        Array.from({ length: Random.range(0, 8) }).map((item, index) => ({
            port_id: 17 + index,
            port_role: Random.range(0, 5),
            port_priority: Random.range(0, 8) * 16,
            port_state: Random.range(0, 4),
            admin_internal_cost: Random.range(0, 1),
            internal_cost: Random.range(0, 1),
        }));
    const data = Array.from({ length: Random.range(0, 15) }).map(
        (item, index) => ({
            mstid: index + 1,
            msti_vlanlist: "1-4094",
            bridge_addr: Random.mac(),
            bridge_prio: Random.range(0, 8) * 4096,
            designate_addr: Random.mac(),
            designate_prio: 32768,
            root_port_name: "",
            internal_path_cost: 0,
            msti_port: msti_port(),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_mstp?form=mstp_vlan_map");

Mock.mock("/switch_mstp?form=port_status_get", "get", () => {
    const data = Array.from({ length: 8 }).map((item, index) => ({
        port_id: 17 + index,
        bpdu_guard_port: Random.range(0, 1),
        loop_detect_guard: Random.range(0, 1),
        admin_edge_port: Random.range(0, 2),
        auto_edge_port: Random.range(0, 1),
        admin_p2p: Random.range(0, 2),
        oper_p2p: Random.range(0, 1),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});
