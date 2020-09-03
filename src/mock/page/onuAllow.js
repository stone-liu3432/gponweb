"use strict";
import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock(/\/gponont_mgmt\?form=auth&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    const data = Array.from({ length: Random.range(0, 127) }).map(
        (item, index) => ({
            identifier: (port_id << 8) | index,
            ont_name: Random.word(1, 32),
            ont_sn: Random.word(1, 32),
            state: Random.range(0, 1),
            rstate: Random.range(0, 2),
            cstate: Random.range(0, 2),
            mstate: Random.range(0, 2),
            last_d_cause: Random.datetime(),
            last_d_time: Random.datetime(),
            last_u_time: Random.datetime(),
        })
    );
    data.sort((a, b) => (a.identifier & 0xff) - (b.identifier & 0xff));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/gponont_mgmt?form=info", "post", "@BASESUCCESS");

Mock.mock(/\/gponont_mgmt\?form=autofind&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    const data = Array.from({ length: Random.range(0, 127) }).map(
        (item, index) => ({
            identifier: (port_id << 8) | index,
            ont_id: index,
            ont_sn: Random.word(1, 32),
            ont_password: Random.word(1, 32),
            loid: Random.word(1, 32),
            loid_password: Random.word(1, 32),
            vendorid: Random.word(1, 32),
            ont_version: Random.word(1, 32),
            equipmentid: Random.word(1, 32),
            autofind_time: Random.datetime(),
        })
    );
    data.sort((a, b) => (a.identifier & 0xff) - (b.identifier & 0xff));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock(/\/gponont_mgmt\?form=auth&port_id=\d+/, "post", "@BASESUCCESS");
Mock.mock("/gponont_mgmt?form=auth", "post", "@BASESUCCESS");
Mock.post("/gponont_mgmt?form=autofind");

Mock.post(/\/gponont_mgmt\?form=multiauth&port_id=\d/);
