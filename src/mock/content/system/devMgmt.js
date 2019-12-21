import Mock from "@/mock";

const file_d = {
    code: 1,
    message: "success",
    data: {
        filename: "config.txt"
    }
};

Mock.mock("/system_restore", "post", "@BASESUCCESS");

Mock.mock("/system_reboot", "get", "@BASESUCCESS");

Mock.mock("/system_backup", "get", file_d);

Mock.mock("/system_def_config", "get", "@BASESUCCESS");

Mock.mock("/system_running_config", "get", file_d);
