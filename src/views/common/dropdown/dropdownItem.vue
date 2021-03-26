<template>
    <div
        @click="dropdownClick"
        :class="['nms-dropdown-item', { 'disabled': disabled }, { 'divided': divided }]"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "nmsDropdown",
    data() {
        return {};
    },
    props: {
        command: {
            type: [String, Object],
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        },
        divided: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        dropdownClick() {
            if (this.disabled) return;
            this.$parent.height = "0px";
            this.$parent.$emit("command", this.command);
        }
    }
};
</script>

<style lang="less" scoped>
.nms-dropdown-item {
    line-height: 27px;
    font-size: 14px;
    padding: 6px 0 6px 12px;
    text-align: left;
    &:hover {
        color: #67aef6;
    }
}
.disabled {
    cursor: not-allowed;
    color: #aaa;
    &:hover {
        color: #aaa;
    }
}
.divided {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    padding-top: 12px;
}
</style>