import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_pkfilter", "get", () => {
    const data = Array.from({ length: Random.range(0, 128) }).map(
        (item, index) => ({
            acl_id: Random.range(2000, 5999),
            rule_id: Random.range(0, 16),
            direction: Random.range(1, 2),
            port_list: Random.portlist(),
            state: Random.range(0, 1),
        })
    );
    data.sort((a, b) => a.acl_id - b.acl_id);
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_pkfilter?form=inbound");

Mock.post("/switch_pkfilter?form=inbound");
