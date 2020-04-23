"use strict";
export default {
    methods: {
        deleteOnu(url, data) {
            return this.$confirm(this.$lang("tips_del_onu"))
                .then(() => {
                    return this.$http
                        .post(url, data)
                        .then((res) => {
                            if (res.data.code === 1) {
                                this.$message.success(this.$lang("setting_ok"));
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                                return Promise.reject(res.data);
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        },
    },
};
