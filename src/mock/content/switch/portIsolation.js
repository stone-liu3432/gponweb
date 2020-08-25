import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_isolate?form=isolate_pon", "post", "@BASESUCCESS");

Mock.mock("/switch_isolate?form=isolate_uplink", "post", "@BASESUCCESS");

Mock.mock("/switch_isolate?form=port_group", "get", () => {
    const inter_working = Array.from({ length: 24 }).map((item, index) => ({
        port_id: index + 1,
        inter_working_portlist: Random.portlist(),
    }));
    return {
        code: 1,
        message: "success",
        data: {
            port_group_mode: Random.range(1, 2),
            pon_isolate_portlist: Random.portlist("pon"),
            uplink_isolate_portlist: Random.portlist("uplink"),
            inter_working,
        },
    };
});

Mock.post("/switch_isolate?form=port_group_mode");

Mock.post("/switch_isolate?form=inter_working_default");

Mock.post("/switch_isolate?form=inter_working");
