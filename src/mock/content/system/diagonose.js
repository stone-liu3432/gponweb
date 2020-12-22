"use strict";

import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock("/diagnose?form=ping", "post", "@BASESUCCESS");

const str =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit.\
     Magni, fugiat, quis architecto reprehenderit laborum ea enim \
     obcaecati amet iure repudiandae corrupti dignissimos ratione, \
     deleniti officiis distinctio. Consequatur explicabo perferendis autem.";

Mock.mock("/diagnose?form=ping", "get", {
    code: 1,
    message: "success",
    data: {
        result: str.slice(0, Random.range(1, 251)),
        finish: "@STATUS",
    },
});
