<script>
"use strict";
import { COLORS } from "./colors";
export default {
    name: "svg-pon",
    props: {
        status: {
            type: Number,
            default: 0
        }
    },
    computed: {
        color() {
            return this.status ? COLORS.online : COLORS.offline;
        }
    },
    render(h) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="64"
                height="64"
            >
                <path d="M0 0 L0 64 L64 64 L64 0 Z" fill={this.color} />
                <path d="M4 4 L4 60 L60 60 L60 4 Z" fill={COLORS.background} />
                <circle
                    cx="32"
                    cy="32"
                    r="20"
                    stroke={this.color}
                    stroke-width="8"
                    fill={COLORS.background}
                />
                <circle cx="32" cy="32" r="12" fill={this.color} />
            </svg>
        );
    }
};
</script>

<style lang="less" scoped>
</style>