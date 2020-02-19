<template>
    <div style="margin: 20px;">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="PON" name="pon">
                <el-row :gutter="40">
                    <template v-for="item in pon">
                        <el-col :span="6" style="margin: 20px 0;">
                            <port-card type="pon" :data="item"></port-card>
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
                                    <port-card type="fiber" :data="item"></port-card>
                                </template>
                                <template v-else>
                                    <port-card type="rj45" :data="item"></port-card>
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
        ...mapGetters(["getPortName", "$lang"])
    },
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
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
        ...mapActions(["getPon", "getPort"])
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
</style>