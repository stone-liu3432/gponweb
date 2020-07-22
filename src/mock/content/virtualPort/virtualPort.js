import Mock from "@/mock";

const Random = Mock.Random;

/**
 * 虚端口列表
 */
Mock.mock("/switch_svp?form=svp_table", "get", "@BASESUCCESS");
Mock.mock("/serviceport", "get", () => {
    const n = Random.range(0, 8190);
    const data = Array.from({ length: n }).map((item, index) => ({
        svp_id: index + 1,
        new_svlan: Random.range(1, 4094),
        port_id: Random.range(1, 16),
        ont_id: Random.range(0, 127),
        gemport: Random.range(1, 32),
        svp_type: Random.range(1, 2),
        user_vlan: Random.range(1, 4094),
        tag_action: Random.range(1, 5),
        inner_vlan: Random.range(1, 4094),
        state: Random.range(0, 1),
        admin_status: Random.range(0, 1),
        desc: Random.word(0, 64),
        install_mode: Random.range(1, 2),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_svp?form=svp_create", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_delete", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_delete_all", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_modify", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_desc", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_admin_status", "post", "@BASESUCCESS");

/**
 * 虚端口自动配置模板列表
 */

Mock.mock("/switch_svp?form=svp_auto_profile", "get", () => {
    const n = Random.range(0, 16);
    let i = 1;
    const data = Array.from({ length: n }).map((item, index) => ({
        new_svlan: Random.range(1, 4094),
        port_id: i++,
        tag_action: Random.range(1, 5),
        inner_vlan: Random.range(0, 4094),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_svp?form=svp_auto_profile_set", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_auto_profile_del", "post", "@BASESUCCESS");

/**
 * 虚端口自动发现列表
 */
Mock.mock("/switch_svp?form=svp_auto_find", "get", "@BASESUCCESS");
Mock.mock("/serviceport_af", "get", () => {
    const n = Random.range(0, 8190);
    const data = Array.from({ length: n }).map((item, index) => ({
        svp_af_id: index + 1,
        port_id: Random.range(1, 16),
        ont_id: Random.range(1, 128),
        gemport: Random.range(1, 5),
        user_vlan: Random.range(1, 4094),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

/**
 * 虚端口统计信息
 */

Mock.mock("/switch_svp?form=svp_stat_get", "get", () => {
    const n = Random.range(0, 8190);
    let i = 1;
    const data = Array.from({ length: n }).map((item) => ({
        svp_id: i++,
        stat_admin: Random.range(0, 1),
        ig_packets: Random.range(0, 1024000),
        ig_bytes: Random.range(0, 1024000),
        eg_packets: Random.range(0, 1024000),
        eg_bytes: Random.range(0, 1024000),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_svp?form=svp_stat_enable", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_stat_disable", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_stat_clear", "post", "@BASESUCCESS");

/**
 * 虚端口流量模板
 */

Mock.mock("/switch_svp?form=traffic_profile_get", "get", () => {
    const n = Random.range(0, 256);
    const bytes = (_) => Random.range(1, 1024000);
    let i = 1;
    const data = Array.from({ length: n }).map((item) => ({
        traffic_profile_id: i++,
        cir: bytes(),
        cbs: bytes(),
        pir: bytes(),
        pbs: bytes(),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_svp?form=traffic_profile_set", "post", "@BASESUCCESS");
Mock.mock("/switch_svp?form=svp_traffic_bind", "post", "@BASESUCCESS");

Mock.post("/switch_svp?form=svp_af_create");
