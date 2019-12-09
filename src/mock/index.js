/**
 * mockjs的配置，所有引用的 Mock应由此文件导出
 */

import Mock, { Random } from "mockjs";

Mock.setup({
    timeout: "200-600"
});

// 自定义指令，调用"@STATUS"
Random.extend({
    status(date) {
        const _status = [0, 1];
        return this.pick(_status);
    },
    basesuccess(data) {
        return {
            code: 1,
            message: "success"
        };
    }
});

console.log("mock loaded success");

export default Mock;
