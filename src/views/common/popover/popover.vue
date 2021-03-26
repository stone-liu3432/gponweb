<template>
    <div
        class="nms-popover"
        :style="{
            left,
            top,
            width,
            visibility: visible ? 'visible' : 'hidden',
        }"
    >
        <div :class="['nms-popover-arrow', placement]" v-if="placement"></div>
        <slot></slot>
    </div>
</template>

<script>
const PLACEMENTS = [
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "left",
    "left-start",
    "left-end",
    "right",
    "right-start",
    "right-end",
];
export default {
    name: "popover",
    data() {
        return {
            height: 0,
        };
    },
    computed: {
        left() {
            return `${this.position.x}px`;
        },
        top() {
            return `${this.position.y}px`;
        },
    },
    mounted() {
        this.height = this.$el.scrollHeight;
    },
    props: {
        position: {
            type: Object,
            default: () => ({ x: 0, y: 0 }),
        },
        visible: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: "150px",
        },
        placement: {
            type: String,
            validator: (val) => PLACEMENTS.includes(val) || val === "",
        },
    },
    methods: {},
};
</script>

<style lang="less" scoped>
.nms-popover {
    position: absolute;
    left: 0;
    top: 0;
    background: #ffffff;
    color: @baseFontColor;
    border: 1px solid @borderColor;
    border-radius: 3px;
    z-index: 999;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 12px 10px;
}
.nms-popover-arrow {
    width: 0;
    height: 0;
    position: absolute;
    border: 6px solid transparent;
    z-index: 1000;
    &:after {
        display: block;
        content: " ";
        border: 6px solid transparent;
        position: absolute;
        left: 0;
    }
}
.nms-popover-arrow[class*="top"] {
    bottom: -12px;
    border-top: 6px solid #bbb;
    &:after {
        border-top: 6px solid #fff;
        left: -6px;
        bottom: -5px;
    }
}
.top {
    left: calc(~"50% - 6px");
    border-top: 6px solid #bbb;
}
.top-end {
    right: 6px;
    border-top: 6px solid #bbb;
}
.top-start {
    left: 6px;
    border-top: 6px solid #bbb;
}
.nms-popover-arrow[class*="bottom"] {
    top: -12px;
    border-bottom: 6px solid #bbb;
    &:after {
        border-bottom: 6px solid #fff;
        left: -6px;
        top: -5px;
    }
}
.bottom {
    left: calc(~"50% - 6px");
    border-bottom: 6px solid #bbb;
}
.bottom-start {
    left: 6px;
    border-bottom: 6px solid #bbb;
}
.bottom-end {
    right: 6px;
    border-bottom: 6px solid #bbb;
}
</style>