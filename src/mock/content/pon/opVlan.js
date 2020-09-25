import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(
    /\/gponont_mgmt\?form=port_vlan&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const identifier =
            (url.match(/(?<=port_id=)\d+/) << 8) |
            (url.match(/(?<=ont_id=)\d+/) >>> 0);
        const portvlan = Array.from({ length: Random.range(1, 8) }).map(
            (item, index) => {
                return {
                    uniport: index + 1,
                    unitype: Random.range(0, 1),
                    mode: Random.pick([1, 3, 4]),
                    svlanid: Random.range(1, 4094),
                    svlanpri: Random.range(0, 8),
                    cvlanid: Random.range(1, 4094),
                    cvlanpri: Random.range(0, 8),
                };
            }
        );
        return {
            code: 1,
            message: "success",
            data: {
                identifier,
                portvlan,
            },
        };
    }
);
