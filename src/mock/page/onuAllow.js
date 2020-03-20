"use strict";
import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock("/gponont_mgmt?form=base", "get", _ => {
    const n = Random.range(1, 2048);
    const data = Array.from({ length: n }).map(_ => ({
        identifier: (Random.range(1, 16) << 8) | Random.range(0, 127),
        ont_name: Random.word(1, 32),
        state: Random.word(1, 8),
        rstate: Random.word(1, 8),
        cstate: Random.word(1, 8),
        mstate: Random.word(1, 8),
        authmode: Random.range(0, 1),
        sn: Random.word(1, 32),
        loid: Random.word(1, 32),
        loidpasswd: Random.word(1, 32),
        ont_description: Random.word(1, 32),
        last_d_cause: Random.datetime(),
        last_d_time: Random.datetime(),
        last_u_time: Random.datetime(),
        last_dg_time: Random.datetime(),
        uptime: Random.datetime(),
        lineprof_id: Random.range(1, 2048),
        lineprof_name: Random.word(1, 32),
        srvprof_id: Random.range(1, 2048),
        srvprof_name: Random.word(1, 32)
    }));
    data.sort((a, b) => (a.identifier & 0xff) - (b.identifier & 0xff));
    return {
        code: 1,
        message: "success",
        data
    };
});

Mock.mock("/gponont_mgmt?form=info", "post", "@BASESUCCESS");
