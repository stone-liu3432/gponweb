import Mock from "@/mock";

const file_d = {
        code: 1,
        message: "success",
        data: {
            filename: "config.txt",
        },
    },
    { Random } = Mock;

Mock.mock("/system_restore", "post", "@BASESUCCESS");

Mock.mock("/system_reboot", "get", "@BASESUCCESS");

Mock.mock("/system_backup", "get", file_d);

Mock.mock("/system_def_config", "get", "@BASESUCCESS");

Mock.mock("/system_running_config", "get", file_d);

Mock.mock("/board?info=faninfo", "get", () => {
    const fanctrl = Array.from({ length: 3 }).map((item, index) => ({
            fanid: index + 1,
            mode: Random.range(0, 2),
            speed: Random.range(0, 255),
            temperature: Random.range(0, 100),
        })),
        fanap = Array.from({ length: 3 }).map((item, index) => ({
            fanid: index + 1,
            speed1: Random.range(0, 255),
            speed2: Random.range(0, 255),
            temp1: Random.range(0, 100),
            temp2: Random.range(0, 100),
        }));
    return {
        code: 1,
        message: "success",
        data: {
            fanctrl,
            fanap,
        },
    };
});

Mock.post("/board?info=fanmode");

Mock.post("/board?info=fanspeed");

Mock.post("/board?info=fanpoint");
