import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(
    /\/gponont_mgmt\?form=base&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                ont_name: Random.word(1, 32),
                ont_sn: Random.word(1, 32),
                state: Random.range(0, 1),
                rstate: Random.range(0, 2),
                cstate: Random.range(0, 2),
                mstate: Random.range(0, 2),
                auth_mode: Random.range(0, 2),
                loid: Random.word(1, 32),
                loid_password: Random.word(1, 32),
                ont_description: Random.word(1, 128),
                last_d_cause: Random.datetime(),
                last_d_time: Random.datetime(),
                last_u_time: Random.datetime(),
                last_dg_time: Random.datetime(),
                uptime: Random.datetime(),
                lineprof_id: Random.range(1, 2048),
                lineprof_name: "lineprof name",
                srvprof_id: Random.range(1, 2048),
                srvprof_name: "srvprof name",
            },
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=ont_version&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                vendorid: Random.word(1, 32),
                ont_version: Random.word(1, 32),
                equipmentid: Random.word(1, 32),
                omcc_version: Random.range(1, 4096),
                product_code: Random.range(1, 4096),
                mainversion: Random.word(1, 32),
                stbversion: Random.word(1, 32),
            },
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=capability&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                ani_num: Random.range(1, 4),
                eth_uni: Random.range(1, 4),
                pots_uni: Random.range(1, 4),
                gem_num: Random.range(1, 4),
                tcont_num: Random.range(1, 4),
                iphost_num: Random.range(1, 4),
                veip_num: Random.range(0, 1),
            },
        };
    }
);

Mock.mock(/\/gponont_mgmt\?form=resource&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            resource: "1,3-8,15-29",
        },
    };
});
