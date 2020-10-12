"use strict";

import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock("/gponmgmt?form=optical_poninfo", "get", (_) => {
    let i = 1;
    const data = Array.from({ length: 16 }).map((_) => ({
        port_id: i++,
        portstate: Random.range(0, 1),
        mstate: Random.range(0, 1),
        work_temprature: "21 C " + (i - 1),
        work_voltage: "3.29 V " + (i - 1),
        transmit_bias: "13 mA " + (i - 1),
        transmit_power: "1.8295 dBm " + (i - 1),
        receive_power: "1.0325 dBm " + (i - 1),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.mock(/\/gponmgmt\?form=optical_poninfo&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            portstate: Random.range(0, 1),
            mstate: Random.range(0, 1),
            mtype: Random.range(0, 1),
            work_temprature: "21 C " + port_id,
            work_voltage: "3.29 V" + port_id,
            transmit_bias: "13 mA" + port_id,
            transmit_power: "1.8295 dBm" + port_id,
            receive_power: "1.8295 dBm" + port_id,
            vendor_name: "ODI" + port_id,
            vendor_oui: "unspecify" + port_id,
            vendor_rev: "1.0" + port_id,
            vendor_pn: "LTE4302M-BC+HW" + port_id,
            vendor_sn: "F9842018765" + port_id,
            date_code: "18-09-03" + port_id,
            vendor_specific: Array.from({ length: 32 }).map((_) =>
                Random.range(0, 16)
            ),
            module_type: "EPON" + port_id,
            max_distance: 20 + port_id,
            wave_length: 1490 + port_id,
            fiber_type: "Single Mode" + port_id,
            identifier: "SFP or SFP Plus" + port_id,
            connector: "SC" + port_id,
            encoding: "8B10B" + port_id,
            temp_high_alarm: 123 + port_id,
            temp_low_alarm: 123 + port_id,
            temp_high_warning: 123 + port_id,
            temp_low_warning: 123 + port_id,
            vol_high_alarm: 123 + port_id,
            vol_low_alarm: 123 + port_id,
            vol_high_warning: 123 + port_id,
            vol_low_warning: 123 + port_id,
            bias_high_alarm: 123 + port_id,
            bias_low_alarm: 123 + port_id,
            bias_high_warning: 123 + port_id,
            bias_low_warning: 123 + port_id,
            txpwr_high_alarm: 123 + port_id,
            txpwr_low_alarm: 123 + port_id,
            txpwr_high_warning: 123 + port_id,
            txpwr_low_warning: 123 + port_id,
            rxpwr_high_alarm: 123 + port_id,
            rxpwr_low_alarm: 123 + port_id,
            rxpwr_high_warning: 123 + port_id,
            rxpwr_low_warning: 123 + port_id,
        },
    };
});

Mock.mock(/\/gponmgmt\?form=optical_onu&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    const data = Array.from({ length: Random.range(1, 128) }).map(
        (item, index) => ({
            port_id,
            ont_id: index,
            ont_name: `ONU${port_id}/${index}`,
            work_temprature: `${Random.range(0, 60)} C`,
            work_voltage: `${(Math.random() * 3).toFixed(2)} V`,
            transmit_bias: `${Random.range(1, 100)} mA`,
            transmit_power: `${(Math.random() * 5).toFixed(4)} dBm`,
            receive_power: `-${(Math.random() * 5).toFixed(4)} dBm`,
            olt_rxpower: `-${(Math.random() * 10).toFixed(2)} dBm`,
            us_ber: Random.word(),
            ds_ber: Random.word(),
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});
