/**
 * mockjs的配置，所有引用的 Mock应由此文件导出
 */

import Mock, { Random } from "mockjs";

Mock.setup({
    timeout: "200-600"
});

const _hex = () => {
    const n = Random.natural(0, 255).toString(16);
    return n.length < 2 ? "0" + n : n;
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
            message: "success"
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
    }
});

console.log("mock loaded success");

export default Mock;
