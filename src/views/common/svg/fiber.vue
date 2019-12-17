<script>
"use strict";
import { COLORS } from "./colors";
export default {
    name: "svg-fiber",
    props: {
        admin_status: {
            type: Number,
            default: 0
        },
        link_status: {
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
            y = 17;
        let path = `M${x - 4} ${y} V32 H${x - 2} V17 L${x} ${y} `;
        Array.from({ length: 8 }).forEach((item, index) => {
            const sx = x + index * 2 + index * 2;
            path += `M${sx} ${y} V27 H${sx + 2} V17 L${sx} ${y} `;
            if (index === 7) {
                path += `M${sx + 4} ${y} V32 H${sx + 6} V17 L${sx + 4} ${y}`;
            }
        });
        path += "Z";
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="64"
                height="64"
            >
                <path d="M0 0 L0 64 L64 64 L64 0 Z" fill={this.color} />
                <path d="M4 4 L4 60 L60 60 L60 4 Z" fill={COLORS.background} />
                <path
                    d="M9 15 V49 H55 V15 L9 15 M9 49 V51 H20 V49 L9 49 M40 15 V12 H58 V15 Z"
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