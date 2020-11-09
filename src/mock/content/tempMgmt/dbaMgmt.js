import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/dbaprofile?form=table", "get", (req) => {
    const data = Array.from({ length: Random.range(0, 245) }).map(
        (item, index) => ({
            profname: Random.word(1, 32),
            profid: 1 + index,
            type: Random.range(1, 5),
            fix: Random.range(128, 1000000),
            assure: Random.range(128, 1000000),
            max: Random.range(128, 1000000),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/dbaprofile", "post", "@BASESUCCESS");

Mock.mock(
    /\/dbaprofile\?form=boundinfo&profid=\d+&profname=\w+/,
    "get",
    ({ url }) => {
        return {
            code: 1,
            message: "success",
            data: [1, 2, 3],
        };
    }
);
