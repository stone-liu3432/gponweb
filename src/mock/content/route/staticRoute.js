import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_route?form=admin_status", "get", () => ({
    code: 1,
    message: "success",
    data: {
        status: 1,
    },
}));

Mock.post("/switch_route?form=admin");

Mock.mock("/switch_route?form=route_table", "get", () => {
    const data = Array.from({ length: Random.range(0, 256) }).map((item) => ({
        ipaddress: Random.ip(),
        mask_num: Random.range(0, 255),
        gateway: Random.ip(),
        interface: Random.vlan(),
        protocol: Random.range(0, 1),
        preference: Random.range(1, 1024000),
        status: Random.range(1, 2),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_route?form=static_route");
