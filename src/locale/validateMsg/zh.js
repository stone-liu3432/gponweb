export default {
    macaddr() {
        return "非法MAC地址,格式00:00:00:00:00:00";
    },
    ipaddr() {
        return "点分十进制: x.x.x.x";
    },
    inputRange(min, max) {
        return `取值范围: ${min} - ${max}`;
    },
    inputLength(min, max) {
        return `${min}${max ? " - " + max : ""}位字符`;
    },
    inputName(min, max) {
        return `由数字,字母,下划线或连字符(-)组成, ${min}${
            max ? " - " + max : ""
        }位字符`;
    },
};
