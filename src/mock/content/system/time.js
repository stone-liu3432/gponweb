import Mock from "@/mock";

Mock.mock("/time?form=ntp", "get", {
    code: 1,
    message: "success",
    data: {
        status: "@STATUS",
        ntp_srv_ip: [
            "@RANGE(1,255).@RANGE(1,255).@RANGE(1,255).@RANGE(1,255)",
            "@RANGE(1,255).@RANGE(1,255).@RANGE(1,255).@RANGE(1,255)"
        ],
        poll_interval_time: "@RANGE(1,24855)"
    }
});

Mock.mock("/time?form=ntp", "post", "@BASESUCCESS");

Mock.mock("/time?form=info", "post", "@BASESUCCESS");
