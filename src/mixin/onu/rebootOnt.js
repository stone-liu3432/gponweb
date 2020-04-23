"use strict";
export default {
    methods: {
        rebootOnt(identifier) {
            return this.$confirm(this.$lang("confirm_reboot_onu") + " ?")
                .then((_) => {
                    const post_params = {
                        method: "set",
                        param: {
                            identifier,
                            flags: 0x4,
                            ont_name: "",
                            ont_description: "",
                        },
                    };
                    return this.$http
                        .post("/gponont_mgmt?form=info", post_params)
                        .then((res) => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.$lang("reboot_onu", "st_success")
                                );
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                                return Promise.reject(res.data);
                            }
                        })
                        .catch((err) => {});
                })
                .catch((_) => {});
        },
    },
};
