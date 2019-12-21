"use strict";

export default {
    methods: {
        rebootOlt(tips, timer) {
            const t = tips || this.$lang("reboot_olt_hit");
            return new Promise((resolve, reject) => {
                this.$confirm(t)
                    .then(_ => {
                        this.reboot();
                        resolve();
                    })
                    .catch(_ => {
                        clearTimeout(timer);
                    });
            });
        },
        reboot() {
            this.$http
                .get("/system_reboot")
                .then(res => {})
                .catch(err => {});
        }
    }
};
