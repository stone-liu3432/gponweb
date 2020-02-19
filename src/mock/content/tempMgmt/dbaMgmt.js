import Mock from "@/mock";

Mock.mock("/dbaprofile?form=table", "get", req => {
    const Random = Mock.Random;
    const n = Random.range(1, 5);
    const data = [];
    for (let i = 0; i < n; i++) {
        data.push({
            profname: Random.word(1, 32),
            profid: Random.range(10, 512),
            type: Random.range(1, 5),
            fix: Random.range(128, 1000000),
            assure: Random.range(128, 1000000),
            max: Random.range(128, 1000000)
        });
    }
    data.sort((a, b) => a.profid - b.profid);
    return {
        code: 1,
        message: "success",
        data
    };
});

Mock.mock("/dbaprofile", "post", "@BASESUCCESS");
