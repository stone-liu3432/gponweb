import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/srvprofile?form=table", "get", "@BASESUCCESS");

Mock.mock("/ont_srv_prof_table", "get", () => {
    const Random = Mock.Random;
    const data = Array.from({ length: Random.range(0, 2048) }).map(
        (item, index) => ({
            profname: Random.word(1, 32),
            profid: index,
            bindtimes: Random.range(1, 5),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
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
                cvlanpri: Random.range(0, 8),
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
                ont_veipport: Random.range(0, 2),
                native_vlan_flag: Random.range(0, 1),
                igmp_version: Random.range(0, 4),
                igmp_function: Random.range(0, 2),
                immediate_leave: Random.range(0, 1),
                igmp_upstream: Random.range(0, 2),
                igmp_up_vid: Random.range(1, 4094),
                igmp_up_pri: Random.range(0, 8),
                mcast_downstream: Random.range(0, 3),
                mcast_down_vid: Random.range(1, 4094),
                mcast_down_pri: Random.range(0, 8),
                portvlan,
            },
        };
    }
);

Mock.mock("/srvprofile", "post", "@BASESUCCESS");

Mock.mock(/\/srvprofile\?form=boundinfo&profid=\d+&profname=\w+/, "get", () => {
    return {
        code: 1,
        message: "success",
        data: Array.from({ length: Random.range(1, 16) }).map(
            (item, index) => ({
                port_id: index + 1,
                resource: "0,1",
            })
        ),
    };
});
