<template>
    <div>
        <page-header type="none" :title="$lang('loop_detect')"></page-header>
        <el-tabs v-model="activeName" type="card" style="margin-top: 20px;" @tab-click="tabClick">
            <el-tab-pane :label="$lang('pon_loop_detect')" name="pon_loop_detect">
                <loop-detect-detail
                    :ld-status="ldStatus"
                    :ld-info="ldInfo"
                    type="pon_loop_detect"
                    @refresh="getData"
                ></loop-detect-detail>
            </el-tab-pane>
            <el-tab-pane :label="$lang('ge_loop_detect')" name="ge_loop_detect">
                <loop-detect-detail
                    :ld-status="ldStatus"
                    :ld-info="ldInfo"
                    type="ge_loop_detect"
                    @refresh="getData"
                ></loop-detect-detail>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import loopDetectDetail from "./loopDetect/detail";
import { isFunction, isDef, isArray } from "@/utils/common";
export default {
    name: "loopDetect",
    components: { loopDetectDetail },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            activeName: "pon_loop_detect",
            ldInfo: [],
            ldStatus: {}
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getData();
    },
    methods: {
        tabClick(tab) {
            this.getData();
        },
        getData() {
            const reqs = {
                pon_loop_detect() {
                    this.getPonStatus();
                },
                ge_loop_detect() {
                    this.getGeStatus();
                }
            };
            if (isFunction(reqs[this.activeName])) {
                reqs[this.activeName].call(this);
            }
        },
        getPonStatus() {
            this.ldStatus = {};
            this.$http
                .get("/pon_loop_detect?form=loop_detect_config")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.ldStatus = res.data.data;
                            if (this.ldStatus.ld_status) {
                                this.getPonInfo();
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getPonInfo() {
            this.ldInfo = [];
            this.$http
                .get("/pon_loop_detect?form=loop_detect_info")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.ldInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getGeStatus() {
            this.ldStatus = {};
            this.$http
                .get("/switch_loop_detect?form=loop_detect_config")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.ldStatus = res.data.data;
                            if (this.ldStatus.ld_status) {
                                this.getGeInfo();
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getGeInfo() {
            this.ldInfo = [];
            this.$http
                .get("/switch_loop_detect?form=loop_detect_info")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.ldInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>