<template>
    <div class="alarm">
        <page-header :title="$lang('alarm')" type="none"></page-header>
        <ul>
            <template v-for="item in alarmList">
                <li style="line-height: 30px;">{{ item }}</li>
            </template>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray } from "@/utils/common";
export default {
    name: "sysAlarm",
    computed: {
        ...mapGetters(["$lang"])
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            alarmList: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.alarmList = [];
            this.$http
                .get("/alarm?form=info")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.alarmList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
li {
    .base-font-style;
}
</style>