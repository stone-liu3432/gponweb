import Mock from "@/mock";
import { mock } from "mockjs";

const Random = Mock.Random;

Mock.mock("/board?info=system", "get", {
    code: 1,
    message: "success",
    data: {
        product_name: "HSGQ-E08",
        sys_ver: "I_V1.0.0_Rel",
        fw_ver: "I_V1.0.0_Rel",
        hw_ver: "I_V1.0.0_Rel",
        bl_ver: "V1.0_Rel",
        macaddr: "38:3a:21:f0:01:b0",
        ponports: 16,
        geports: 8,
        xgeports: 8,
        vendor: "hsgq",
        build_time: "2017/11/22 09:32:48",
        panel_temp: 1000,
        right_temp: 1000,
        sn: Random.word(1, 32),
        device_type: 2,
    },
});

Mock.mock("/board_info", "get", {
    code: 1,
    message: "success",
    data: {
        product_name: "HSGQ-E08",
        sys_ver: "I_V1.0.0_Rel",
        fw_ver: "I_V1.0.0_Rel",
        hw_ver: "I_V1.0.0_Rel",
        bl_ver: "V1.0_Rel",
        macaddr: "38:3a:21:f0:01:b0",
        ponports: 16,
        geports: 8,
        xgeports: 8,
        vendor: "hsgq",
        build_time: "2017/11/22 09:32:48",
        panel_temp: 1000,
        right_temp: 1000,
        sn: Random.word(1, 32),
        device_type: 2,
    },
});

Mock.mock("/board?info=pon", "get", () => {
    let i = 1;
    const data = Array.from({ length: 16 }).map((_) => ({
        port_id: i++,
        status: Random.range(0, 1),
        online: Random.range(0, 64),
        offline: Random.range(0, 64),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock("/switch_port?form=portlist_info", "get", () => {
    let i = 1;
    const pon = Array.from({ length: 16 }).map((_) => ({
        port_id: i++,
        port_desc: Random.word(1, 64),
        admin_status: Random.range(0, 1),
        link_status: Random.range(0, 1),
        auto_neg: Random.range(0, 1),
        speed: "1000M",
        duplex: 1,
        flow_ctrl: Random.range(0, 1),
        mtu: 1500,
        media: "fiber",
        pvid: 1,
    }));
    const data = pon.concat(
        Array.from({ length: 8 }).map((_) => ({
            port_id: i++,
            port_desc: Random.word(1, 64),
            admin_status: Random.range(0, 1),
            link_status: Random.range(0, 1),
            auto_neg: Random.range(0, 1),
            speed: "1000M",
            duplex: 1,
            flow_ctrl: Random.range(0, 1),
            mtu: 1500,
            erate: Random.range(64, 1024000),
            irate: Random.range(64, 1024000),
            media: i <= 20 ? "copper" : "fiber",
            pvid: 1,
            link_aggregation: Random.range(0, 8),
        }))
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});
