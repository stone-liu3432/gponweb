import Mock from "@/mock";

Mock.mock("/upgrade?type=firmware", "post", "@BASESUCCESS");

Mock.mock("/upgrade?type=system", "post", "@BASESUCCESS");

Mock.mock("/upgrade?type=fullversion", "post", "@BASESUCCESS");

Mock.mock("/upgrade_status", "get", {
    code: 1,
    message: "success",
    data: {
        status: "@RANGE(1,3)"
    }
});
