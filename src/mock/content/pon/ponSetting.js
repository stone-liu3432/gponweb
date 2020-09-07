import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/gponmgmt?form=gpon_setting", "get", () => {
    const gpon_setting = Array.from({ length: 16 }).map((_item, index) => ({
        port_id: index + 1,
        autofind: Random.range(0, 1),
        laser: Random.range(0, 1),
        trx_type: Random.range(0, 15),
        auth_type: Random.range(0, 1),
        lineprof_id: Random.range(1, 2048),
        srvprof_id: Random.range(1, 2048),
    }));
    return {
        code: 1,
        message: "success",
        data: {
            af_aging_time: Random.pick([0, Random.range(100, 300)]),
            af_interval: Random.range(2, 10),
            gpon_setting,
        },
    };
});

Mock.mock(/\/gponmgmt\?form=laser&port_id=\d+/, "post", "@BASESUCCESS");

Mock.mock(/\/gponmgmt\?form=ont_autofind&port_id=\d+/, "post", "@BASESUCCESS");

Mock.mock(/\/gponmgmt\?form=ont_auth&port_id=\d+/, "post", "@BASESUCCESS");

Mock.mock(/\/gponmgmt\?form=af_param/, "post", "@BASESUCCESS");

Mock.post(/\/gponmgmt\?form=trxtype&port_id=\d+/);

Mock.post("/gponmgmt?form=gpon_setting");
