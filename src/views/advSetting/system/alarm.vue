<template>
    <div class="alarm">
        <page-header :title="$lang('alarm')" type="none"></page-header>
        <div>
            <span>{{ $lang('alarm_info') }}</span>
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="refreshData"
            >{{ $lang('refresh') }}</el-button>
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="downloadAlarm"
            >{{ $lang('download') }}</el-button>
        </div>
        <ul>
            <template v-for="item in alarmList">
                <li style="line-height: 30px;">{{ item }}</li>
            </template>
        </ul>
        <el-backtop :target="backTopTarget"></el-backtop>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce, isDef } from "@/utils/common";
export default {
    name: "sysAlarm",
    computed: {
        ...mapGetters(["$lang"])
    },
    inject: ["updateAdvMainScrollbar", "backTopTarget"],
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
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
        downloadAlarm() {
            this.$confirm(this.$lang("if_sure", "download"))
                .then(_ => {
                    this.$http
                        .get("/alarm?form=download")
                        .then(res => {
                            if (res.data.code === 1) {
                                if (isDef(res.data.data)) {
                                    const filename = res.data.data.filename;
                                    if (isDef(filename)) {
                                        try {
                                            var a = document.createElement("a");
                                            a.href = "/" + filename;
                                            a.setAttribute(
                                                "download",
                                                filename
                                            );
                                            a.style.display = "none";
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        } catch (e) {}
                                    }
                                }
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
li {
    .base-font-style;
}
div {
    margin: 10px;
    span {
        color: @titleColor;
    }
}
</style>