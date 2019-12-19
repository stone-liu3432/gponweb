"use strict";
export default {
    methods: {
        // return promise ，后续的数据刷新或其他操作
        rebootOnu(data) {
            return new Promise((resolve, reject) => {
                if (data.status.toLowerCase() !== "online") {
                    this.$message.info(this.$lang("onu_offline_tips"));
                    return reject();
                }
                this.$confirm(this.$lang("confirm_reboot_onu") + " ?")
                    .then(_ => {
                        const post_params = {
                            method: "set",
                            param: {
                                port_id: data.port_id,
                                onu_id: data.onu_id,
                                flags: 1,
                                fec_mode: 1
                            }
                        };
                        this.$http
                            .post("/onumgmt?form=config", post_params)
                            .then(res => {
                                if (res.data.code === 1) {
                                    this.$message.success(
                                        this.$lang("reboot_onu", "st_success")
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
