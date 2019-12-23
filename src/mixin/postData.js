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
                "set"
            ];
            return new Promise((resolve, reject) => {
                this.$http
                    .post(url, data)
                    .then(res => {
                        if (res.data.code === 1) {
                            flag &&
                                this.$message.success(
                                    methods.includes(data.method)
                                        ? this.$lang(data.method, "st_success")
                                        : this.$lang("setting_ok")
                                );
                            resolve(res.data);
                        } else {
                            flag &&
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            resolve(res.data);
                        }
                    })
                    .catch(err => {});
            });
        }
    }
};
