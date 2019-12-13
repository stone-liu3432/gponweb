// 公用方法，工具函数

export const toString = Object.prototype.toString;
export const toLower = String.prototype.toLocaleLowerCase;

export function toRawType(val) {
    return toString.call(val).slice(8, -1);
}

export function isArray(val) {
    if (isFunction(Array.isArray)) {
        return Array.isArray(val);
    }
    return toRawType(val) === "Array";
}

export function isDef(val) {
    return val !== null && val !== undefined;
}

export function isUndef(val) {
    return val === null || val === undefined;
}

export function isFunction(fn) {
    return typeof fn === "function";
}

export function isPlainObject(val) {
    return val !== null && toRawType(val) === "Object";
}

export function isEmptyObject(obj) {
    return isPlainObject(obj) && !Reflect.ownKeys(obj).length;
}

// 移除数组项
export function removeItem(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}

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

// 解析portlist，返回端口号组成的数组
//  e.x. "1,3,5-9" -> [1, 3, 5, 6, 7, 8, 9]
export function parsePort(str) {
    if (!str) return [];
    const result = [];
    const arr = str.split(",");
    for (var i = 0, len = arr.length; i < len; i++) {
        const substrs = arr[i];
        if (substrs.indexOf("-") !== -1) {
            var subArr = substrs.split("-");
            var min = Number(subArr[0]),
                max = Number(subArr[subArr.length - 1]);
            if (isNaN(min) || isNaN(max)) {
                throw new TypeError(`${min} or ${max} is not a number.`);
            }
            result.push(min);
            for (var j = 1; j < max - min; j++) {
                result.push(min + j);
            }
            result.push(max);
        } else {
            if (isNaN(Number(substrs))) {
                throw new TypeError(`${substrs} is not a number.`);
            }
            result.push(Number(substrs));
        }
    }
    return result;
}

// 防抖
export function debounce(func, delay, context, ...args) {
    if (func.timer) {
        clearTimeout(func.timer);
        func.timer = setTimeout(_ => {
            func.apply(context, args);
            func.timer = null;
        }, delay);
    } else {
        func.timer = setTimeout(_ => {
            func.apply(context, args);
            func.timer = null;
        }, delay);
    }
}

// 节流
export function throttle(func, wait, context) {
    let last = 0,
        timer = null;
    return function() {
        let current = +new Date();
        clearTimeout(timer);
        if (current - last > wait) {
            func.apply(context, arguments);
            last = current;
        } else {
            timer = setTimeout(_ => {
                func.apply(context, arguments);
                last = current;
            }, wait);
        }
    };
}