<template>
    <div style="margin: 20px;">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="PON" name="pon">
                <div class="ont-status-statistics">
                    <span>{{ $lang('registered_onu') }}:</span>
                    <span>{{ online + offline }}</span>
                    <span style="margin-left: 30px;">{{ $lang('online') }}:</span>
                    <span>{{ online }}</span>
                    <span style="margin-left: 30px;color: #F56C6C;">{{ $lang('offline') }}:</span>
                    <span style="color: #F56C6C;">{{ offline }}</span>
                </div>
                <el-row :gutter="40">
                    <template v-for="item in pon">
                        <el-col :span="6" style="margin: 20px 0;">
                            <port-card type="pon" :data="item" @click.native="clickItem(item)"></port-card>
                        </el-col>
                    </template>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :label="$lang('uplink')" name="uplink">
                <el-row :gutter="40">
                    <template v-for="item in port">
                        <template v-if="item.port_id > system.ponports">
                            <el-col :span="6" style="margin: 20px 0;">
                                <template v-if="item.media === 'fiber'">
                                    <port-card
                                        type="fiber"
                                        :data="item"
                                        @click.native="clickItem(item)"
                                    ></port-card>
                                </template>
                                <template v-else>
                                    <port-card
                                        type="rj45"
                                        :data="item"
                                        @click.native="clickItem(item)"
                                    ></port-card>
                                </template>
                            </el-col>
                        </template>
                    </template>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import portCard from "./portCard";
export default {
    name: "status",
    components: { portCard },
    data() {
        return {
            activeName: "pon"
        };
    },
    inject: ["updateNavScrollbar"],
    computed: {
        ...mapState(["system", "pon", "port"]),
        ...mapGetters(["getPortName", "$lang"]),
        online() {
            return this.pon.reduce((pre, item) => pre + item.online, 0);
        },
        offline() {
            return this.pon.reduce((pre, item) => pre + item.offline, 0);
        }
    },
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    created() {
        this.getPon();
    },
    mounted() {
        // 定时刷新数据
        const interval = setInterval(_ => {
            this.activeName === "pon" && this.getPon();
            this.activeName === "uplink" && this.getPort();
        }, 5000);
        this.$once("hook:beforeDestroy", _ => {
            clearInterval(interval);
        });
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    methods: {
        ...mapActions(["getPon", "getPort"]),
        clickItem(row) {
            const ponports = this.system.ponports;
            if (row.port_id <= ponports) {
                this.$router.push({
                    path: "/onu_allow",
                    query: { port_id: row.port_id }
                });
            } else {
                this.$router.push({
                    path: "/port_cfg",
                    query: { port_id: row.port_id }
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
.ont-status-statistics {
    margin: 10px 0 0 10px;
    .base-font-style;
    span {
        color: @titleColor;
        display: inline-block;
        vertical-align: middle;
        & + span {
            margin-left: 6px;
        }
    }
}
</style>