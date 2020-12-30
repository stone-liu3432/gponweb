import Mock from "@/mock";
import { Random } from "mockjs";

Mock.mock("/board?info=cpu", "get", {
    code: 1,
    message: "success",
    data: {
        cpu_usage: "@RANGE(0,100)",
        memory_usage: "@RANGE(0,100)",
    },
});

Mock.mock("/time?form=info", "get", {
    code: 1,
    message: "success",
    data: {
        time_now: [
            "@RANGE(1970,2019)",
            "@RANGE(1,12)",
            "@RANGE(1,28)",
            "@RANGE(0,23)",
            "@RANGE(0,59)",
            "@RANGE(0,59)",
        ],
        uptime: ["@RANGE(1,9)", "@RANGE(0,23)", "@RANGE(0,59)", "@RANGE(0,59)"],
        timezone: "@RANGE(1,99)",
    },
});

Mock.mock("/board?info=setting_board", "get", {
    code: 1,
    message: "success",
    data: {
        name: "中国深圳市鸿升光通讯设备有限公司",
        addr: "深圳市坂田街道杨美村德众工业园A栋6楼",
        email: "hsgq@hsgq.com",
        phone: "0755—81755556",
    },
});

Mock.mock("/board?info=fan", "get", () => {
    const data = Array.from({ length: 3 }).map((item, index) => ({
        fanid: index + 1,
        speed: Random.range(0, 255),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/system?form=hostname", "get", () => ({
    code: 1,
    message: "success",
    data: {
        hostname: "OLT",
    },
}));

Mock.post("/system?form=hostname");
