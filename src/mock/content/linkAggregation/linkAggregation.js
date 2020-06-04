import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_trunk?form=link_aggregation", "get", () => {
    const data = Array.from({ length: Random.range(0, 8) }).map(
        (item, index) => ({
            trunk_id: index + 1,
            psc: Random.range(1, 6),
            member_portlist: Random.portlist("uplink"),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_trunk?form=link_aggregation_member");

Mock.post("/switch_trunk?form=link_aggregation_psc");
