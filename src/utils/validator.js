"use strict";

// ip地址验证，
export function regIp(val) {
    const reg = /^((\d?\d|2[0-4]\d|25[0-5])\.){3}(\d?\d|2[0-4]\d|25[0-5])$/;
    return reg.test(val) && val !== "0.0.0.0" && val !== "255.255.255.255";
}

// mac地址验证
export function regMac(val) {
    const reg = /^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/i;
    return reg.test(val) || toLower.call(val) !== "ff:ff:ff:ff:ff:ff";
}

// 4-32位，字母数字下划线"@"及"."，只能以字母开关
export function regName(val) {
    const reg = /^[a-zA-Z][\w@\.]{3,31}$/;
    return reg.test(val);
}

// 4-64位
export function regPwd(val) {
    const reg = /^.{4,64}$/g;
    return reg.test(val);
}
