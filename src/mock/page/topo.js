import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(/\/ponmgmt\?form=splitter&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
        data = Array.from({ length: 97 /* Random.natural(1, 8) */ }).map(
            (item, index) => ({
                port_id,
                splitter_id: index + 1,
                name: Random.word(1, 32),
                description: Random.word(0, 64),
                parent: index === 0 ? 0 : index < 33 ? 1 : 2,
            })
        );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/ponmgmt?form=splitter");

Mock.post("/ponmgmt?form=splitterbindonu");
