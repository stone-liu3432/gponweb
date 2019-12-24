"use strict";
import { regIp, regMac, regRange } from "./validator";
export default {
    provide() {
        const _this = this;
        return {
            validateIp(rule, value, cb) {
                if (!regIp(value)) {
                    return cb(new Error(_this.validateMsg("ipaddr")));
                }
                cb();
            },
            validateMac(rule, value, cb) {
                if (!regMac(value)) {
                    return cb(new Error(_this.validateMsg("macaddr")));
                }
                cb();
            },
            validateVlan(rule, value, cb) {
                if (!regRange(value, 1, 4094)) {
                    return cb(
                        new Error(_this.validateMsg("inputRange", 1, 4094))
                    );
                }
                cb();
            },
            updateNavScrollbar() {
                _this.updateNavScrollbar();
            }
        };
    }
};
