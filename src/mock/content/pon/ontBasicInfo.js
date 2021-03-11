import Mock from "@/mock";

const { Random } = Mock;

Mock.mock(
    /\/gponont_mgmt\?form=base&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                ont_name: Random.word(1, 32),
                ont_sn: Random.word(1, 32),
                state: Random.range(0, 1),
                rstate: Random.range(0, 2),
                cstate: Random.range(0, 2),
                mstate: Random.range(0, 2),
                auth_mode: Random.range(0, 2),
                us_ber: Random.word(),
                ds_ber: Random.word(),
                loid: Random.word(1, 32),
                loid_password: Random.word(1, 32),
                ont_description: Random.word(1, 128),
                last_d_cause: Random.datetime(),
                last_d_time: Random.datetime(),
                last_u_time: Random.datetime(),
                last_dg_time: Random.datetime(),
                uptime: Random.datetime(),
                lineprof_id: Random.range(1, 2048),
                lineprof_name: "lineprof name",
                srvprof_id: Random.range(1, 2048),
                srvprof_name: "srvprof name",
            },
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=ont_version&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                vendorid: Random.word(1, 32),
                ont_version: Random.word(1, 32),
                equipmentid: Random.word(1, 32),
                omcc_version: Random.range(1, 4096),
                product_code: Random.range(1, 4096),
                mainversion: Random.word(1, 32),
                stbversion: Random.word(1, 32),
            },
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=capability&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                ani_num: Random.range(1, 4),
                eth_uni: Random.range(1, 4),
                pots_uni: Random.range(1, 4),
                gem_num: Random.range(1, 4),
                tcont_num: Random.range(1, 4),
                iphost_num: Random.range(1, 4),
                veip_num: Random.range(0, 1),
                wan: Random.range(0, 1),
            },
        };
    }
);

Mock.mock(/\/gponont_mgmt\?form=resource&port_id=\d+/, "get", ({ url }) => {
    const port_id = url.match(/(?<=port_id=)\d+/) >>> 0;
    return {
        code: 1,
        message: "success",
        data: {
            port_id,
            resource: "0-1,3-8,15-29",
        },
    };
});

Mock.mock(
    /\/gponont_mgmt\?form=ont_alarm&port_id=\d+&ont_id=\d+/,
    "get",
    () => ({
        code: 1,
        message: "success",
        data: Array.from({ length: Random.range(0, 255) }).map(() =>
            Random.word(1, 128)
        ),
    })
);

Mock.mock(
    /\/gponont_mgmt\?form=ont_optical&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                port_id,
                ont_id,
                work_temprature: `${Random.range(1, 50)} C`,
                work_voltage: `${Random.range(1, 50)} V`,
                transmit_bias: `${Random.range(1, 50)} mA`,
                transmit_power: `-${Random.range(1, 50)} dBm`,
                receive_power: `-${Random.range(1, 50)} dBm`,
                olt_rxpower: `-${(Math.random() * 10).toFixed(4)} dBm`,
            },
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=ipconfig&port_id=\d+&ont_id=\d+&index=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        const data = Array.from({ length: Random.range(0, 2) }).map(
            (item, index) => ({
                identifier: (port_id << 8) | ont_id,
                index: index,
                ipoption: Random.range(1, 2),
                vlan_id: Random.vlan(),
                ipaddr: Random.ip(),
                ipmask: Random.ip(),
                gateway: Random.ip(),
                primary: Random.ip(),
                secondary: Random.ip(),
            })
        );
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.post("/gponont_mgmt?form=ipconfig");

Mock.mock(
    /\/gponont_mgmt\?form=wanconfig&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const data = Array.from({ length: 3 }).map((item, index) => ({
            name: "wan" + index,
            index: 0,
            status: Random.range(0, 1),
            ipmode: Random.range(0, 3),
            ctype: Random.range(0, 7),
            mtu: Random.range(70, 1500),
            tagmode: Random.range(0, 1),
            vlan_id: Random.vlan(),
            vlan_priority: Random.range(0, 8),
            ipproto: Random.range(1, 3),
            igmpproxy: Random.range(0, 2),
            ipaddr: Random.ip(),
            ipmask: Random.ip(),
            gateway: Random.ip(),
            pppoemode: Random.range(0, 2),
            user: Random.word(1, 16),
            password: Random.word(1, 16),
            requestdns: Random.range(0, 1),
            pridns: Random.ip(),
            secdns: Random.ip(),
            portmap: [1, 2, 3, 4, 5, 9].slice(0, Random.range(1, 5)),
        }));
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=wlanconfig&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                name: Random.word(1, 32),
                wlan_2_4g_administrator: Random.range(0, 1),
                wlan_2_4g_encrypt: Random.pick([0, 1, 4, 6]),
                wlan_2_4g_ssid: Random.word(1, 32),
                wlan_2_4g_password: Random.word(1, 32),
                wlan_5g_administrator: Random.range(0, 1),
                wlan_5g_encrypt: Random.pick([0, 1, 4, 6]),
                wlan_5g_ssid: Random.word(1, 32),
                wlan_5g_password: Random.word(1, 32),
            },
        };
    }
);

Mock.post("/gponont_mgmt?form=wanconfig");

Mock.post("/gponont_mgmt?form=wlanconfig");

Mock.post("/gponmgmt?form=wlan");

Mock.mock(
    /\/gponont_mgmt\?form=wlanclients&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0,
            data = Array.from({
                length: Random.range(1, 8),
            }).map((item, index) => ({
                identifier: (port_id << 8) | ont_id,
                wlan_type: Random.pick([1, 2, 3]),
                macaddr: Random.mac(),
                tx_pkts: Random.range(0, 1024000),
                rx_pkts: Random.range(0, 1024000),
                tx_rate: Random.rage(0, 1000),
                rssi: Random.range(-120, 0),
                expired_time: Range.range(0, 600),
            }));
        return {
            code: 1,
            message: "success",
            data,
        };
    }
);

Mock.mock(
    /\/gponont_mgmt\?form=wanaclconfig&port_id=\d+&ont_id=\d+/,
    "get",
    ({ url }) => {
        const port_id = url.match(/(?<=port_id=)\d+/) >>> 0,
            ont_id = url.match(/(?<=ont_id=)\d+/) >>> 0;
        return {
            code: 1,
            message: "success",
            data: {
                identifier: (port_id << 8) | ont_id,
                telnet: Random.range(0, 1),
                http: Random.range(0, 1),
                ping: Random.range(0, 1),
            },
        };
    }
);

Mock.post("/gponont_mgmt?form=wanaclconfig");
