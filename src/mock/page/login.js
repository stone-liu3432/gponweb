import Mock from "@/mock";

Mock.mock("/userlogin?form=login", "post", "@BASESUCCESS");

Mock.mock("/system_custom", "get", () => {
    return {
        code: 1,
        message: "success",
        data: {
            hsgq: 1,
            addonu: 1,
            pon_authmode: 1,
            frpc: 1,
            captcha: 1,
            fix_lang: 0,
            mac_auth: 1,
        },
    };
});

Mock.mock("/system_captcha", "get", () => {
    return {
        code: 1,
        message: "success",
        data: {
            filename: `${Mock.Random.word(5, 12)}.gif`,
        },
    };
});
