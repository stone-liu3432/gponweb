<script>
"use strict";
import { mapState, mapActions, mapGetters } from "vuex";
import svgRj45 from "@/views/common/svg/rj45";
import svgPon from "@/views/common/svg/pon";
import svgFiber from "@/views/common/svg/fiber";
import { STATUS, LINK_STATUS, SWITCH } from "@/utils/commonData";
export default {
    name: "status-card",
    components: { svgRj45, svgPon, svgFiber },
    props: {
        type: {
            type: String,
            default: "pon"
        },
        data: {
            type: Object
        }
    },
    computed: {
        ...mapState(["system", "pon", "port"]),
        ...mapGetters(["getPortName", "$lang"])
    },
    methods: {
        ...mapActions(["getPon", "getPort"])
    },
    render(h) {
        const SVG_MAPS = {
            pon: [<svg-pon status={this.data.status}></svg-pon>],
            fiber: [
                <svg-fiber
                    link_status={this.data.link_status}
                    admin_status={this.data.admin_status}
                    style="margin-top: 16px;"
                ></svg-fiber>
            ],
            rj45: [
                <svg-rj45
                    link_status={this.data.link_status}
                    admin_status={this.data.admin_status}
                    style="margin-top: 16px;"
                ></svg-rj45>
            ]
        };
        const UPLINK_DETAIL = [
            <div style="margin: 10px 0 10px 10px;">
                {this.$lang("port_id")}: {this.getPortName(this.data.port_id)}
            </div>,
            <div style="margin: 10px 0 10px 10px;">
                {this.$lang("admin_status")}:{" "}
                {this.$lang(SWITCH[this.data.admin_status])}
            </div>,
            <div style="margin: 10px 0 10px 10px;">
                {this.$lang("link_status")}:{" "}
                {this.$lang(LINK_STATUS[this.data.link_status])}
            </div>
        ];
        const DETAIL_MAPS = {
            pon: [
                <div style="margin: 3px 0 16px 0;">
                    {this.$lang("registered_onu")}:{" "}
                    {`${this.data.online + this.data.offline}`}
                </div>,
                <div style="margin-bottom: 16px;">
                    {this.$lang("online")}: {this.data.online}
                </div>,
                <div style="margin-bottom: 16px;">
                    {this.$lang("offline")}: {this.data.offline}
                </div>
            ],
            fiber: UPLINK_DETAIL,
            rj45: UPLINK_DETAIL
        };
        const spans = this.type === "pon" ? [12, 12] : [8, 16];
        return (
            <el-card shadow="hover">
                <el-row>
                    <el-col
                        span={spans[0]}
                        style="text-align: center; height: 100px;"
                    >
                        {SVG_MAPS[this.type]}
                        {this.type === "pon" && (
                            <div style="margin: 10px 0 0 0;">
                                {this.getPortName(this.data.port_id)}:{" "}
                                {this.$lang(STATUS[this.data.status])}
                            </div>
                        )}
                    </el-col>
                    <el-col
                        span={spans[1]}
                        style={{
                            height: "100px",
                            padding: this.type === "pon" ? "0 0 0 12px" : ""
                        }}
                    >
                        {DETAIL_MAPS[this.type]}
                    </el-col>
                </el-row>
            </el-card>
        );
    }
};
</script>

<style lang="less" scoped>
div {
    font-size: 14px;
}
</style>