"use strict";
import { clearSessionStorage, isFunction } from "@/utils/common";

export default {
    methods: {
        rebootOlt(tips, timer) {
            const msg = tips || this.$lang("reboot_olt_hit");
            return this.$confirm(msg)
                .then(() => {
                    this.reboot();
                    return Promise.resolve();
                })
                .catch(() => {
                    clearTimeout(timer);
                });
        },
        reboot() {
            this.$http
                .get("/system_reboot")
                .then((res) => {})
                .catch((err) => {});
            clearSessionStorage();
            this.$router.push("/login");
            // 特殊处理，在打开confirm的情况下自动完成跳转到登录页时，关闭confirm
            const el = document.querySelector(".el-message-box__wrapper");
            if (el && isFunction(el.click)) {
                el.click();
            }
        },
    },
};
