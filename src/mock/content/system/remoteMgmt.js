"use strict";

import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/system?form=inbound", "post", "@BASESUCCESS");

Mock.mock("/system?form=outbound", "post", "@BASESUCCESS");

Mock.mock("/switch_route?form=route_default", "get", () => ({
    code: 1,
    message: "success",
    data: {
        gateway: Random.ip(),
    },
}));

Mock.post("/switch_route?form=route_default");

Mock.mock("/system?form=dns", "get", () => ({
    code: 1,
    message: "success",
    data: {
        primary: Random.ip(),
        secondary: Random.ip(),
    },
}));

Mock.post("/system?form=dns");
