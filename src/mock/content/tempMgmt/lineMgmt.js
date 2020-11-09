import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock("/lineprofile?form=table", "get", "@BASESUCCESS");

Mock.mock("/ont_line_prof_table", "get", () => {
    const data = Array.from({ length: Random.range(0, 2048) }).map(
        (item, index) => ({
            profname: Random.word(1, 32),
            profid: index,
            bindtimes: Random.range(1, 8),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock(
    /\/lineprofile\?form=self&profid=\d+&profname=\w+/,
    "get",
    ({ url }) => {
        const profid = url.match(/(?<=profid\=)\d+/) >>> 0;
        const profname = url.match(/(?<=profname\=)\w+/)[0];

        const n = Random.range(1, 32),
            tcont = [],
            m = Random.range(1, 32),
            gem = [];

        const createMapping = () => {
            const flag = Random.range(0, 3);
            // 模拟 untag模式
            if (!flag) {
                return [
                    {
                        mid: 0,
                        mode: Random.pick([1, 3]),
                        vlan_id: 0xffff,
                        vlan_pri: 0,
                    },
                ];
            }
            const mapping = [],
                mode = Random.range(1, 3),
                j = Random.range(1, 8);
            // 同一个gemport下 vlan mode不可变
            for (let i = 0; i < j; i++) {
                mapping.push({
                    mid: i,
                    mode,
                    vlan_id: Random.range(1, 4094),
                    vlan_pri: Random.range(0, 7),
                });
            }
            // mapping.sort((a, b) => a.vlan_id - b.vlan_id);
            return mapping;
        };

        for (let i = 0; i < n; i++) {
            const tcid = Random.range(1, 32);
            if (tcont.some((item) => item.tcid === tcid)) {
                continue;
            }
            tcont.push({
                tcid,
                dba_profid: Random.range(0, 512),
                dba_profname: Random.word(1, 32),
            });
        }
        tcont.sort((a, b) => a.tcid - b.tcid);
        for (let i = 0; i < m; i++) {
            const gemindex = Random.range(1, 32);
            if (gem.some((item) => item.gemindex === gemindex)) {
                continue;
            }
            gem.push({
                gemindex,
                tcontid: Random.range(1, 32),
                mapping: createMapping(),
            });
        }
        gem.sort((a, b) => a.gemindex - b.gemindex);
        return {
            code: 1,
            message: "success",
            data: {
                profname,
                profid,
                type: Random.range(1, 2),
                mappingmode: Random.range(1, 3),
                tcont,
                gem,
            },
        };
    }
);

Mock.mock("/lineprofile", "post", "@BASESUCCESS");

Mock.mock(
    /\/lineprofile\?form=boundinfo&profid=\d+&profname=\w+/,
    "get",
    ({ url }) => {
        const data = Array.from({ length: Random.range(0, 16) }).map(
            (item, index) => ({
                port_id: index + 1,
                resource: `0-${Random.range(1, 127)}`,
            })
        );
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);
