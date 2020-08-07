<template>
    <div>
        <page-header type="none" title="QoS"></page-header>
        <h4 class="qos-mode">
            <span>{{ $lang('mode') }}:</span>
            <span>{{ cmode }}</span>
        </h4>
        <h4>
            <span>{{ $lang('priority') }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('cosq', cosq)"
            >{{ $lang('config') }}</el-button>
        </h4>
        <template v-if="cosq.length">
            <template v-for="(item, index) in cosq">
                <el-row class="qos-item">
                    <el-col style="width: 120px;">
                        <span>{{ $lang('queue') }}:</span>
                        <span>{{ index }}</span>
                    </el-col>
                    <el-col style="width: 120px;">
                        <span>{{ $lang('priority') }}:</span>
                        <span>{{ item }}</span>
                    </el-col>
                </el-row>
            </template>
        </template>
        <h4>
            <span>{{ $lang('queue_scheduler') }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('queue', queue)"
            >{{ $lang('config') }}</el-button>
        </h4>
        <template v-if="queue.length">
            <template v-for="item in queue">
                <el-row class="qos-item">
                    <el-col style="width: 160px">
                        <span>{{ $lang('cos') }}:</span>
                        <span>{{ item.cos }}</span>
                    </el-col>
                    <el-col style="width: 160px">
                        <span>{{ $lang('mode') }}:</span>
                        <span>{{ item.mode }}</span>
                    </el-col>
                    <el-col style="width: 160px">
                        <span>{{ $lang('weight') }}:</span>
                        <span>{{ item.weight }}</span>
                    </el-col>
                </el-row>
            </template>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="600px">
            <div slot="title">{{ $lang('config') }}</div>
            <qos-form ref="qos-form"></qos-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('qos-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import qosForm from "./qos/qosForm";
import postData from "@/mixin/postData";
export default {
    name: "qos",
    computed: {
        ...mapGetters(["$lang"])
    },
    components: { qosForm },
    mixins: [postData],
    data() {
        return {
            cmode: "",
            queue: [],
            cosq: [],
            dialogVisible: false
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getQos();
    },
    methods: {
        getQos() {
            this.cmode = "";
            this.queue = [];
            this.cosq = [];
            this.$http
                .get("/switch_qos?form=qos")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            const data = res.data.data;
                            this.cmode = data.cmode;
                            this.queue = data.queue || [];
                            this.cosq = data.cosq || [];
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(type, data) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["qos-form"].init(type, data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        cosq(form) {
                            const priority = Array.from({ length: 8 }).map(
                                (item, index) => form["prio" + index] || 0
                            );
                            return {
                                url: "/switch_qos?form=cosqmap",
                                data: {
                                    method: "set",
                                    param: {
                                        priority
                                    }
                                }
                            };
                        },
                        queue(form) {
                            return {
                                url: "/switch_qos?form=queue-scheduler",
                                data: {
                                    method: "set",
                                    param: {
                                        flag: form.flag,
                                        wrr:
                                            Array.from({ length: 8 }).map(
                                                (item, index) =>
                                                    form["wrr" + index]
                                            ) || 0
                                    }
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, formData);
                        if (res) {
                            const { url, data } = res;
                            url &&
                                data &&
                                this.postData(url, data)
                                    .then(_ => {
                                        this.getQos();
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
h4 {
    color: @titleColor;
}
.qos-mode {
    .base-font-style;
    margin: 12px 0;
    span {
        color: @titleColor;
    }
    span + span {
        margin: 0 0 0 12px;
    }
}
.qos-item {
    .base-font-style;
    border-bottom: @border-style;
    padding: 6px 0 6px 6px;
    span + span {
        margin: 0 0 0 12px;
    }
}
h4 + .qos-item {
    border-top: @border-style;
}
</style>