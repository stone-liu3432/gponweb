import Mock from "@/mock";

Mock.mock("/switch_isolate?form=isolate", "get", {
    code: 1,
    message: "success",
    data: {
        pon_isolate_portlist: "1,3-4",
        uplink_isolate_portlist: "5-7,9,12"
    }
});

Mock.mock("/switch_isolate?form=isolate_pon", "post", "@BASESUCCESS");

Mock.mock("/switch_isolate?form=isolate_uplink", "post", "@BASESUCCESS");
