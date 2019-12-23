"use strict";
import { toLower } from "./common";

// ip地址验证，
export function regIp(val) {
    const reg = /^((1?\d?\d|2[0-4]\d|25[0-5])\.){3}(1?\d?\d|2[0-4]\d|25[0-5])$/;
    return reg.test(val) && val !== "0.0.0.0" && val !== "255.255.255.255";
}

// mac地址验证
export function regMac(val) {
    const reg = /^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/i;
    return reg.test(val) && toLower.call(val) !== "ff:ff:ff:ff:ff:ff";
}

// 4-32位，字母数字下划线"@"及"."，只能以字母开头
export function regName(val) {
    const reg = /^[a-zA-Z][\w@\.]{3,31}$/;
    return reg.test(val);
}

// 4-64位
export function regPwd(val) {
    const reg = /^.{4,64}$/g;
    return reg.test(val);
}

// 4-64位
export function regDesc(val) {
    const reg = /^.{0,128}$/;
    return reg.test(val);
}

// 数字范围
export function regRange(val, min, max) {
    return val >= min && val <= max && !isNaN(val);
}

// 字符长度
export function regLength(val, min, max) {
    const reg = new RegExp(`^.{${min},${max}}$`);
    return reg.test(val);
}
