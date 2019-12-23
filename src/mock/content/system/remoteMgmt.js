"use strict";

import Mock from "@/mock";

Mock.mock("/system?form=inbound", "post", "@BASESUCCESS");

Mock.mock("/system?form=outbound", "post", "@BASESUCCESS");
