import Mock from "@/mock";

Mock.mock("/srvprofile?form=table", "get", () => {
    const Random = Mock.Random;
    const n = Random.range(1, 8);
    const data = [];
    for (let i = 0; i < n; i++) {
        data.push({
            profname: Random.word(1, 32),
            profid: n < 6 ? Random.range(0, 2048) : 0xfffe,
            bindtimes: Random.range(1, 5)
        });
    }
    data.sort((a, b) => a.profid - b.profid);
    return {
        code: 1,
        message: "success",
        data
    };
});

Mock.mock(
    /\/srvprofile\?form=self&profid=\d+&profname=\w+/,
    "get",
    ({ url }) => {
        const Random = Mock.Random;
        const profid = url.match(/(?<=profid=)\d+/) >>> 0;
        const profname = url.match(/(?<=profname=)\w+/)[0];
        const n = Random.range(1, 8),
            portvlan = [];
        for (let i = 0; i < n; i++) {
            portvlan.push({
                uniport: Random.range(0, 8),
                unitype: Random.range(0, 1),
                mode: Random.range(1, 4),
                svlanid: Random.range(1, 4094),
                svlanpri: Random.range(0, 8),
                cvlanid: Random.range(1, 4094),
                cvlanpri: Random.range(0, 8)
            });
        }
        return {
            code: 1,
            message: "success",
            data: {
                profname,
                profid,
                ont_ethport: Random.range(0, 8),
                ont_potsport: Random.range(0, 2),
                ont_catvport: Random.range(0, 1),
                native_vlan_flag: Random.range(0, 1),
                portvlan
            }
        };
    }
);

Mock.mock("/srvprofile", "post", "@BASESUCCESS");
