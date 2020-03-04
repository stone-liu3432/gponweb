"use strict";
const path = require("path");
const CallbackAfterBuildDoneWebpackPlugins = require("./src/config/webpackConfig");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg|woff|ttf)(\?.*)?$/i;
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
    productionSourceMap: false,
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            config.plugins.push(new CallbackAfterBuildDoneWebpackPlugins());
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: productionGzipExtensions,
                    threshold: 2048, // 大小限制，单位byte,低于此大小的不压缩
                    minRatio: 0.8, //  压缩率小于此值的才会被处理
                    deleteOriginalAssets: true //  是否删除原文件
                })
            );
        }
    },
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
 * 关闭 eslin: vue template中的长字符串频繁报错
 */
