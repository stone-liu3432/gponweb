import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/system?form=logger", "get", () => {
    const info = ["gpondev", "switch", "system", "vty", "httpd"].map(
        (item) => ({
            module_name: item,
            level: Random.range(0, 7),
        })
    );
    return {
        code: 1,
        message: "success",
        data: {
            info,
            syslog_server: Random.ip(),
        },
    };
});

Mock.post("/system?form=logger");

Mock.mock("/system?form=logger_dw", "get", () => ({
    code: 1,
    message: "success",
    data: {
        filename: "logger.tar.gz",
    },
}));
