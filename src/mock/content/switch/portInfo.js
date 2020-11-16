import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_port?form=optical_uplinkinfo", "get", () => {
    const data = Array.from({ length: 24 }).map((item, index) => ({
        port_id: 1 + index,
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
