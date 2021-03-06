import Mock from "@/mock";
import { Random } from "mockjs";

Mock.mock("/usermgmt?form=userlist", "get", () => {
    const Random = Mock.Random;
    return {
        code: 1,
        message: "success",
        data: [
            {
                name: Random.last(),
                level: Random.range(0, 5),
                reenter: Random.range(1, 4),
                info: Random.title(),
                status: Random.status(),
                logins: Random.range(1, 3),
            },
            {
                name: Random.last(),
                level: Random.range(0, 5),
                reenter: Random.range(1, 4),
                info: Random.title(),
                status: Random.status(),
                logins: Random.range(1, 3),
            },
        ],
    };
});

Mock.mock("/usermgmt?form=userlist", "post", "@BASESUCCESS");
Mock.mock("/usermgmt?form=modifyps", "post", "@BASESUCCESS");

Mock.mock("/usermgmt?form=userlevel", "get", () => ({
    code: 1,
    message: "success",
    data: {
        level: Random.range(0, 5),
        name: Random.word(1, 16),
    },
}));
