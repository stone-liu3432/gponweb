"use strict";
export default {
    methods: {
        // 默认弹出消息提示，不需要可取消
        postData(url, data, flag = true) {
            const methods = [
                "create",
                "destroy",
                "add",
                "delete",
                "modify",
                "set",
            ];
            return this.$http
                .post(url, data)
                .then((res) => {
                    if (flag) {
                        if (res.data.code === 1) {
                            this.$message.success(
                                methods.includes(data.method)
                                    ? this.$lang(data.method, "st_success")
                                    : this.$lang("setting_ok")
                            );
                        } else {
                            this.$message.error(
                                `(${res.data.code}) ${res.data.message}`
                            );
                            return Promise.reject(res.data);
                        }
                    } else {
                        return Promise.resolve(res);
                    }
                })
                .catch((err) => {});
        },
    },
};
