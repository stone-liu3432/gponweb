import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(
    /\/gpon_ontupgrade\?form=ont_upgrade_status&port_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            status = Array.from({ length: Random.range(1, 64) }).map(
                (item, index) => ({
                    ont_id: index + 1,
                    name: Random.word(1, 32),
                    bytes_transmitted: Random.range(1, 1024000),
                    upgrade_status: Random.word(1, 128),
                })
            );
        return {
            code: 1,
            message: "success",
            data: {
                port_id,
                file_size: Random.range(1024000, 4096000),
                upgrade_state: Random.range(0, 1),
                status,
            },
        };
    }
);

Mock.mock(
    /\/gpon_ontupgrade\?form=ont_version&port_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            data = Array.from({ length: Random.range(1, 64) }).map(
                (item, index) => ({
                    identifier: (port_id << 8) | (index + 1),
                    name: "123",
                    vendorid: "123",
                    ont_version: "V1",
                    equipmentid: Random.pick(["111111", "22222", "33333"]),
                    omcc_version: 0,
                    product_code: 1 + index,
                    mainversion: "1",
                    stbversion: "GPON-" + Random.range(1024000, 4096000),
                })
            );
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.post("/gpon_ontupgrade?form=upgrade");

Mock.post("/upgrade?type=ontimage");
