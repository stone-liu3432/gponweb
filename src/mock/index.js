/**
 * mockjs的配置，所有引用的 Mock应由此文件导出
 */

import Mock, { Random } from "mockjs";

Mock.setup({
    timeout: "200-600",
});

const _hex = () => {
    const n = Random.natural(0, 255).toString(16);
    return n.length < 2 ? "0" + n : n;
};

const ipv6 = () => {
    const hex = () => {
        let n = Math.floor(Math.random() * 0xffff);
        n = n < 0x4000 ? 0 : n;
        n = n.toString(16);
        while (n.length < 4) {
            n = "0" + n;
        }
        return n;
    };
    let str = `${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`;
    str = str.replace(/^0+(?!:)/, "");
    str = str.replace(/(?::)0+/g, ":0");
    str = str.replace(/:0/, ":");
    while (str.match(/(?:::)0:/)) {
        str = str.replace(/(?:::)0:/, "::");
    }
    str = str.replace(/0+(?=\w)/g, "");
    return str;
};

// 自定义指令，调用"@STATUS" 有参数时，直接 "@RANGE(min,max)"
Random.extend({
    status(data) {
        const _status = data || [0, 1];
        return this.pick(_status);
    },
    basesuccess(data) {
        return {
            code: 1,
            message: "success",
        };
    },
    range(start, end) {
        return this.natural(start, end);
    },
    mac() {
        return `38:3a:21:${_hex()}:${_hex()}:${_hex()}`;
    },
    vlan() {
        return this.natural(1, 4094);
    },
    ip() {
        return `${this.natural(0, 255)}.${this.natural(0, 255)}.${this.natural(
            0,
            255
        )}.${this.natural(0, 255)}`;
    },
    ipv6() {
        return ipv6();
    },
    portlist(flag = "port") {
        const length =
            flag === "port"
                ? this.natural(0, 24) // all port
                : flag === "pon"
                ? this.natural(0, 16) // pon
                : this.natural(0, 8); // switch
        const data = Array.from({ length })
            .map((item) =>
                flag === "port"
                    ? this.natural(1, 24)
                    : flag === "pon"
                    ? this.natural(1, 16)
                    : this.natural(17, 24)
            )
            .filter((item, index, arr) => index === arr.indexOf(item));
        data.sort((a, b) => a - b);
        return data.join(",");
    },
});

Mock.post = (url) => Mock.mock(url, "post", "@BASESUCCESS");

console.log("mock loaded success");

export default Mock;
