export default {
    macaddr() {
        return "非法MAC地址";
    },
    ipaddr() {
        return "点分十进制: x.x.x.x";
    },
    inputRange(min, max) {
        return `取值范围: ${min} - ${max}`;
    },
    inputLength(min, max) {
        return `${min} - ${max}位字符`;
    }
};
