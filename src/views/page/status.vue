<template>
    <div>
        <h3>PON</h3>
        <el-row :gutter="40">
            <template v-for="item in pon">
                <el-col :span="6" style="margin: 20px 0;">
                    <port-card type="pon" :data="item"></port-card>
                </el-col>
            </template>
        </el-row>
        <h3>GE</h3>
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
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import portCard from "./portCard";
export default {
    name: "status",
    components: { portCard },
    data() {
        return {};
    },
    computed: {
        ...mapState(["system", "pon", "port"]),
        ...mapGetters(["getPortName"])
    },
    mounted() {
        // 定时刷新数据
        const interval = setInterval(_ => {
            this.getPon();
            this.getPort();
        }, 5000);
        this.$once("hook:beforeDestroy", _ => {
            clearInterval(interval);
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