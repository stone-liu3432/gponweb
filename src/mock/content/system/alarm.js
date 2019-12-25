import Mock from "@/mock";

Mock.mock("/alarm?form=info", "get", ({ url }) => {
    const Random = Mock.Random;
    const n = Random.range(1, 128);
    const data = [];
    for (let i = 0; i < n; i++) {
        data.push(Random.sentence(3, 6));
    }
    return {
        code: 1,
        message: "success",
        data
    };
});
