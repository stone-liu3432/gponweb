"use strict";
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function timeStramp() {
    var now = new Date();
    return `${now.getFullYear()}-${now.getMonth() +
        1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
}

const autoSync = (filename) => {
    let filePath = "\\\\192.168.5.28\\鸿升研发\\WEB版本";
    // latest文件夹只存放最新一次的编译版本
    // backup存放所有的历史版本
    let files = fs.readdirSync(path.join(filePath, "gpon-latest"));
    files.forEach((file) => {
        var filedir = path.join(filePath, "gpon-latest", file);
        const stats = fs.statSync(filedir);
        const isFile = stats.isFile();
        if (isFile && file.indexOf("dist") === 0) {
            fs.unlinkSync(filedir);
            console.log(`删除 ${chalk.green(filedir)} 成功 ！\n`);
        }
    });
    let data = fs.readFileSync(filename);
    const paths = ["gpon-latest", "gpon-backup"];
    paths.forEach((item) => {
        fs.writeFile(
            path.join(
                filePath,
                item,
                filename.slice(filename.lastIndexOf("\\") + 1)
            ),
            data,
            function(err) {
                if (err) {
                    return console.error(err);
                }
                console.log(
                    chalk.yellow(
                        `文件 ${chalk.green(
                            filename.slice(filename.lastIndexOf("\\") + 1)
                        )} 同步至${item}目录成功！\n`
                    )
                );
            }
        );
    });
};

const autoArchiver = () => {
    const archiver = require("archiver");
    console.time("文件压缩成功，共计用时：");

    const filename =
        path.resolve(__dirname, "../../dist/dist") + timeStramp() + ".zip";
    // 创建文件输出流
    const output = fs.createWriteStream(filename);
    const archive = archiver("zip", {
        zlib: { level: 9 }, // 设置压缩级别
    });
    // 文件输出流结束
    output.on("close", function() {
        console.timeEnd("文件压缩成功，共计用时：");
        console.log(
            chalk.green(`\n压缩后文件大小共 ${archive.pointer()} 字节 \n\n`)
        );
        autoSync(filename);
    });
    // 数据源是否耗尽
    output.on("end", function() {
        console.log("数据源已耗尽");
    });
    // 存档警告
    archive.on("warning", function(err) {
        if (err.code === "ENOENT") {
            console.warn("路径名中的目录不存在或是无效的符号连接");
        } else {
            throw err;
        }
    });
    // 存档出错
    archive.on("error", function(err) {
        throw err;
    });
    // 通过管道方法将输出流存档到文件
    archive.pipe(output);
    // 追加文件
    appendFileAndDirectory(archive, [
        filename.slice(filename.lastIndexOf("\\") + 1),
    ]);
    // 完成归档
    archive.finalize();
};

/**
 * @method appendFileAndDirectory 压缩包文件流追加文件
 * @param {archiver} archiver对象
 * @param {Array} excludes 要排除的文件，不希望放入压缩包的文件
 */
function appendFileAndDirectory(archive, excludes = []) {
    const filepath = path.join(__dirname, "../../dist");
    const files = fs.readdirSync(filepath);
    files.forEach((file) => {
        const filedir = path.join(filepath, file);
        const stats = fs.statSync(filedir);
        if (stats.isFile()) {
            if (excludes.includes(file)) {
                return;
            }
            archive.append(fs.createReadStream(filedir), { name: file });
        }
        if (stats.isDirectory()) {
            archive.directory(filedir, file);
        }
    });
}

// 一个简易版的webpack插件，用于build后进行压缩并上传至指定文件夹
// 文档地址：https://www.webpackjs.com/concepts/plugins/

const pluginName = "CallbackAfterBuildDoneWebpackPlugins";
class CallbackAfterBuildDoneWebpackPlugins {
    apply(compiler) {
        compiler.hooks.done.tap(pluginName, (compilation) => {
            autoArchiver();
        });
    }
}

module.exports = CallbackAfterBuildDoneWebpackPlugins;
