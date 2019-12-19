"use strict";
export default {
    methods: {
        deleteOnu(url, data) {
            return new Promise((resolve, reject) => {
                this.$confirm(this.$lang("tips_del_onu"))
                    .then(_ => {
                        this.$http
                            .post(url, data)
                            .then(res => {
                                if (res.data.code === 1) {
                                    this.$message.success(
                                        this.$lang("setting_ok")
                                    );
                                    resolve();
                                } else {
                                    this.$message.error(
                                        `(${res.data.code}) ${res.data.message}`
                                    );
                                    reject(res.data);
                                }
                            })
                            .catch(err => {});
                    })
                    .catch(_ => {});
            });
        }
    }
};
