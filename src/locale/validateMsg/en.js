export default {
    macaddr() {
        return "Illegal MAC Address, ex. 00:00:00:00:00:00";
    },
    ipaddr() {
        return "Dotted decimal notation: x.x.x.x";
    },
    inputRange(min, max) {
        return `Range: ${min} - ${max}`;
    },
    inputLength(min, max) {
        return `${min}${max ? " - " + max : ""} characters`;
    },
};
