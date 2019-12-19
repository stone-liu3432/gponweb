import Mock from "@/mock";

Mock.mock(/\/onu_allow_list\?port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    const Random = Mock.Random;
    const n = Random.range(0, 128);
    const data = !!n ? [] : null;
    const hex = _ => {
        const s = Random.range(0, 255).toString(16);
        return s.length < 2 ? "0" + s : s;
    };
    for (let i = 0; i < n; i++) {
        data.push({
            port_id,
            onu_id: Random.range(1, 128),
            onu_name: Random.name(),
            macaddr: `38:3a:21:${hex()}:${hex()}:${hex()}`,
            status: Random.pick(["online", "offline"]),
            auth_state: Random.status(),
            register_time: Random.datetime("yyyy/MM/dd HH:mm:ss"),
            last_down_time: Random.datetime("yyyy/MM/dd HH:mm:ss"),
            last_down_reason: "Power Down"
        });
    }
    return {
        code: 1,
        message: "success",
        data: data ? data.sort((a, b) => a.onu_id - b.onu_id) : null
    };
});

Mock.mock(/\/onu_allow_list\?form=resource\&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            resource: "1, 4-7, 23"
        }
    };
});

Mock.mock("/onumgmt?form=config", "post", "@BASESUCCESS");
Mock.mock(/\/onu_allow_list(\?form=batch)?/, "post", "@BASESUCCESS");
