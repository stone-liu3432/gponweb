"use strict";
import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock(/\/gponont_mgmt\?form=auth&port_id=\d+/, "get", ({ url }) => {
    const n = Random.range(0, 127),
        port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    const data = Array.from({ length: n }).map(_ => ({
        identifier: (port_id << 8) | Random.range(0, 127),
        ont_name: Random.word(1, 32),
        ont_sn: Random.word(1, 32),
        state: Random.word(1, 8),
        rstate: Random.word(1, 8),
        cstate: Random.word(1, 8),
        mstate: Random.word(1, 8),
        last_d_cause: Random.datetime(),
        last_d_time: Random.datetime(),
        last_u_time: Random.datetime()
    }));
    data.sort((a, b) => (a.identifier & 0xff) - (b.identifier & 0xff));
    return {
        code: 1,
        message: "success",
        data
    };
});

Mock.mock("/gponont_mgmt?form=info", "post", "@BASESUCCESS");

Mock.mock(/\/gponont_mgmt\?form=autofind&port_id=\d+/, "get", ({ url }) => {
    const n = Random.range(0, 127),
        port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    const data = Array.from({ length: n }).map(_ => ({
        identifier: (port_id << 8) | Random.range(0, 127),
        ont_sn: Random.word(1, 32),
        ont_password: Random.word(1, 32),
        loid: Random.word(1, 32),
        loid_password: Random.word(1, 32),
        vendorid: Random.word(1, 32),
        ont_version: Random.word(1, 32),
        equipmentid: Random.word(1, 32),
        autofind_time: Random.datetime()
    }));
    data.sort((a, b) => (a.identifier & 0xff) - (b.identifier & 0xff));
    return {
        code: 1,
        message: "success",
        data
    };
});

Mock.mock(/\/gponont_mgmt\?form=auth&port_id=\d+/, "post", "@BASESUCCESS");
Mock.mock("/gponont_mgmt?form=auth", "post", "@BASESUCCESS");
