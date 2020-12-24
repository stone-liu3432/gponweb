import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/system_accesslist?form=rule_tab", "get", () => {
    return {
        code: 1,
        message: "success",
        data: Array.from({ length: Random.range(1, 30) }).map(
            (item, index) => ({
                name: "filter" + (index + 1),
                afi: Random.range(1, 2),
                type: 1,
                hostip: Random.ip(),
                macaddr: Random.mac(),
                access: Random.range(1, 4),
            })
        ),
    };
});

Mock.post("/system_accesslist?form=rule_tab");
