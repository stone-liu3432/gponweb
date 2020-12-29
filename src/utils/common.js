"use strict";
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

export function isPromise(val) {
    return (
        isDef(val) &&
        typeof val.then === "function" &&
        typeof val.catch === "function"
    );
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

// 解析list字符串，返回数组
//  e.x. "1,3,5-9" -> [1, 3, 5, 6, 7, 8, 9]
export function parseStringAsList(str) {
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
        func.timer = setTimeout(() => {
            func.apply(context, args);
            func.timer = null;
        }, delay);
    } else {
        func.timer = setTimeout(() => {
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
            timer = setTimeout(() => {
                func.apply(context, arguments);
                last = current;
            }, wait);
        }
    };
}

/**
 * @method intersectArray
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array} 返回两个数组的交集
 */
export function intersectArray(arr1, arr2) {
    return arr1.reduce((pre, item) => {
        if (arr2.includes(item)) {
            pre.push(item);
        }
        return pre;
    }, []);
}

/**
 * @method distinctArray
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array} 返回两个数组的不同项
 */
export function distinctArray(arr1, arr2) {
    return arr1.reduce(
        (pre, item) => {
            if (!arr2.includes(item)) {
                pre.push(item);
            }
            return pre;
        },
        arr2.reduce((pre, item) => {
            if (!arr1.includes(item)) {
                pre.push(item);
            }
            return pre;
        }, [])
    );
}

export function clearSessionStorage() {
    sessionStorage.clear();
}

/**
 * @param {String} string IPv6 string
 * @return {Boolean} true if the String is a valid IPv6 address; false otherwise
 */
export function isIPv6(value) {
    if (!value) {
        return false;
    }
    const components = value.split(":");
    if (components.length < 2 || components.length > 8) {
        return false;
    }
    if (components[0] !== "" || components[1] !== "") {
        // Address does not begin with a zero compression ("::")
        if (!components[0].match(/^[\da-f]{1,4}/i)) {
            // Component must contain 1-4 hex characters
            return false;
        }
    }
    let numberOfZeroCompressions = 0;
    for (let i = 1; i < components.length; ++i) {
        if (components[i] === "") {
            // We're inside a zero compression ("::")
            ++numberOfZeroCompressions;
            if (numberOfZeroCompressions > 1) {
                // Zero compression can only occur once in an address
                return false;
            }
            continue;
        }
        if (!components[i].match(/^[\da-f]{1,4}/i)) {
            // Component must contain 1-4 hex characters
            return false;
        }
    }
    if (value.match(/[0-9a-f]:$/i)) {
        return false;
    }
    return true;
}
