import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_port?form=optical_uplinkinfo", "get", () => {
    const data = Array.from({ length: 8 }).map((item, index) => ({
        port_id: 17 + index,
        portstate: Random.range(0, 1),
        mstate: Random.range(0, 1),
        work_temprature: `${Math.floor(Math.random() * 50)} C`,
        work_voltage: `${(Math.random() * 8).toFixed(2)} V`,
        transmit_bias: `${(Math.random() * 8).toFixed(2)} mA`,
        transmit_power: `${(Math.random() * 8).toFixed(2)} dBm`,
        receive_power: `${(Math.random() * 8).toFixed(2)} dBm`,
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock(
    /\/switch_port\?form=optical_uplinkinfo&port_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                port_id,
                portstate: Random.range(0, 1),
                mstate: Random.range(0, 1),
                mtype: Random.range(0, 1),
                work_temprature: "21 C",
                work_voltage: "3.29 V",
                transmit_bias: "13 mA",
                transmit_power: "1.8295 dBm",
                receive_power: "1.8295 dBm",
                vendor_name: "ODI",
                vendor_oui: "unspecify",
                vendor_rev: "1.0",
                vendor_pn: "LTE4302M-BC+HW",
                vendor_sn: "F9842018765",
                date_code: "18-09-03",
                vendor_specific: [],
                module_type: "EPON",
                max_distance: 20,
                wave_length: 1490,
                fiber_type: "Single Mode",
                identifier: "SFP or SFP Plus",
                connector: "SC",
                encoding: "8B10B",
            },
        };
    }
);
