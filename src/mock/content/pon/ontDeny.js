import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(/\/gponont_mgmt\?form=blont&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
        data = Array.from({ length: Random.range(0, 128) }).map(
            (item, index) => ({
                port_id,
                ont_id: index + 1,
                ont_sn: Random.word(1, 64),
                trycount: Random.range(1, 10),
                reason: Random.word(1, 32),
            })
        );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/gponont_mgmt?form=blont");
