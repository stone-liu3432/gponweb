<script>
"use strict";
import { COLORS } from "./colors";
export default {
    name: "svg-rj45",
    props: {
        link_status: {
            type: Number,
            default: 0
        },
        admin_status: {
            type: Number,
            default: 0
        }
    },
    computed: {
        color() {
            return this.link_status ? COLORS.online : COLORS.offline;
        },
        disabled() {
            return !this.admin_status;
        }
    },
    render(h) {
        const x = 17,
            y = 14;
        let path = "";
        Array.from({ length: 8 }).forEach((item, index) => {
            const sx = x + index * 2 + index * 2;
            path += `M${sx} ${y} V25 H${sx + 2} V15 L${sx} ${y} `;
        });
        path += "Z";
        return (
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
            >
                <path d="M0 0 L0 64 L64 64 L64 0 Z" fill={this.color} />
                <path d="M4 4 L4 60 L60 60 L60 4 Z" fill={COLORS.background} />
                <path
                    d="M9 15 V40 H55 V15 L9 15 M14 35 V45 H50 V40 L14 35 M20 40 V50 H44 V45 L20 40 Z"
                    fill={this.color}
                />
                <path d={path} fill={COLORS.background} />
                {this.disabled && [
                    <circle
                        cx="48"
                        cy="48"
                        r="8"
                        stroke="red"
                        stroke-width="2"
                        fill="transparent"
                    />,
                    <path
                        d="M47 40 V56 H49 V40 Z"
                        fill="red"
                        transform="rotate(-45, 48, 48)"
                    />
                ]}
            </svg>
        );
    }
};
</script>

<style lang="less" scoped></style>