"use strict";
const path = require("path");

module.exports = {
    productionSourceMap: false,
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [
                path.resolve(__dirname, "./src/config/global-style.less")
            ]
        }
    },
    chainWebpack: config => {
        const eslint = config.module.rule("eslint");
        eslint.uses.clear();
    }
};

/**
 * 想了解 webpack当前的全部配置项，
 * 可在当前项目目录下，命令行输入 `vue inspect > output.js`，从导出的文件中查看
 * output.js 可任意命名
 * 当前关闭 eslint主要原因是vue template中的长字符串频繁报错
 */
