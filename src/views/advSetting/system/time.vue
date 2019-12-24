<template>
    <div>
        <page-header :title="$lang('time_set', 'config')" type="none"></page-header>
        <el-form
            label-width="200px"
            label-position="left"
            :model="formData"
            :rules="rules"
            ref="time-form"
        >
            <el-form-item :label="$lang('current_time')">
                <span>{{ crtTime }}</span>
            </el-form-item>
            <el-form-item :label="$lang('config', 'time_set')">
                <el-radio v-model="setType" :label="0">{{ $lang('ntp_gettime') }}</el-radio>
                <el-radio v-model="setType" :label="1">{{ $lang('manual_s','config','time_set') }}</el-radio>
            </el-form-item>
            <template v-if="setType === 0">
                <el-form-item :label="$lang('ntp_ipaddr1')" prop="ntp_ipaddr1">
                    <el-input style="width: 200px;" v-model="formData.ntp_ipaddr1"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('ntp_ipaddr2')" prop="ntp_ipaddr2" ref="ntp-ipaddr2">
                    <el-input style="width: 200px;" v-model="formData.ntp_ipaddr2"></el-input>
                </el-form-item>
                <el-form-item :label="$lang('update_frequency')" prop="update_frequency">
                    <el-input style="width: 200px;" v-model="formData.update_frequency"></el-input>
                    <span style="margin-left: 12px;">{{ $lang('days') }}</span>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item :label="$lang('select_timezone')" prop="timezone" key="timezone">
                    <el-select v-model.number="formData.timezone">
                        <template v-for="(item, index) in timezone">
                            <el-option :value="index" :label="item.tag"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$lang('time_set')" prop="time" key="time">
                    <el-date-picker
                        v-model="formData.time"
                        type="datetime"
                        :clearable="false"
                        :editable="false"
                    ></el-date-picker>
                </el-form-item>
            </template>
        </el-form>
        <el-button type="primary" @click="refreshTime">{{ $lang('time_get_serv') }}</el-button>
        <span style="margin-left: 30px;">{{ $lang('notice_time_sync') }}</span>
        <div style="margin: 30px 0;">
            <el-button
                type="primary"
                style="width: 200px;"
                @click="submitForm('time-form')"
            >{{ $lang('apply') }}</el-button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { regRange, regIp } from "@/utils/validator";
import { isArray, isFunction, isPlainObject, debounce } from "@/utils/common";
import timezone from "@/utils/timezone";
import postData from "@/mixin/postData";
export default {
    name: "timeMgmt",
    mixins: [postData],
    data() {
        return {
            timezone,
            setType: 0,
            formData: {
                ntp_ipaddr1: "",
                ntp_ipaddr2: "",
                update_frequency: "",
                timezone: 0,
                time: ""
            },
            rules: {
                ntp_ipaddr1: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                ntp_ipaddr2: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                update_frequency: [
                    {
                        validator: this.validateFrequency,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getTime();
        this.getData();
        const timer = setInterval(_ => {
            if (this.time && isArray(this.time.time_now)) {
                const now = this.time.time_now;
                const t = +new Date(...now);
                const date = new Date(t + 1000);
                const y = date.getFullYear(),
                    m = date.getMonth(),
                    d = date.getDate(),
                    h = date.getHours(),
                    _m = date.getMinutes(),
                    s = date.getSeconds();
                this.time.time_now = [y, m, d, h, _m, s];
            }
        }, 1000);
        this.$once("hook:beforeDestroy", _ => {
            clearInterval(timer);
        });
    },
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["time"]),
        crtTime() {
            if (this.time && isArray(this.time.time_now)) {
                const now = this.time.time_now;
                return `${now[0]}-${now[1]}-${now[2]} ${now[3]}:${
                    now[4] < 10 ? "0" + now[4] : now[4]
                }:${now[5] < 10 ? "0" + now[5] : now[5]}`;
            }
            return "";
        }
    },
    methods: {
        ...mapActions(["getTime"]),
        validateIp(rule, value, cb) {
            if (this.setType === 1) {
                return cb();
            }
            // 备用IP可以为空
            const { field, fullField } = rule;
            if (field === "ntp_ipaddr2" || fullField === "ntp_ipaddr2") {
                if (regIp(this.formData.ntp_ipaddr1) && value === "") {
                    return cb();
                }
            } else {
                if (this.formData.ntp_ipaddr2 === "") {
                    this.$refs["ntp-ipaddr2"].clearValidate();
                }
            }
            if (!regIp(value)) {
                return cb(new Error(this.validateMsg("ipaddr")));
            }
            cb();
        },
        validateFrequency(rule, value, cb) {
            if (this.setType === 1) {
                return cb();
            }
            const max = Math.floor(Math.pow(2, 31) / 60 / 60 / 24);
            if (
                this.formData.update_frequency <= 0 ||
                this.formData.update_frequency === ""
            ) {
                this.formData.update_frequency = 1;
            }
            if (isNaN(value) || value > max) {
                return cb(new Error(this.validateMsg("inputRange", 1, max)));
            }
            cb();
        },
        getData() {
            this.$http
                .get("/time?form=ntp")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isPlainObject(res.data.data)) {
                            const {
                                status,
                                ntp_srv_ip,
                                poll_interval_time
                            } = res.data.data;
                            this.setType = status;
                            if (status === 0) {
                                if (isArray(ntp_srv_ip)) {
                                    this.formData.ntp_ipaddr1 = ntp_srv_ip[0];
                                    this.formData.ntp_ipaddr2 = ntp_srv_ip[1];
                                }
                                this.formData.update_frequency = poll_interval_time;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        refreshTime() {
            debounce(this.getTime, 1000, this);
        },
        submitForm(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    const ACTIONS = [
                            _ => {
                                return {
                                    method: "set",
                                    param: {
                                        status: 0,
                                        ntp_srv_ip: [
                                            this.formData.ntp_ipaddr1,
                                            this.formData.ntp_ipaddr2
                                        ],
                                        poll_interval_time: this.formData
                                            .update_frequency
                                    }
                                };
                            },
                            _ => {
                                const t = this.formData.time;
                                const y = t.getFullYear(),
                                    m = t.getMonth() + 1,
                                    d = t.getDate(),
                                    h = t.getHours(),
                                    _m = t.getMinutes(),
                                    s = t.getSeconds();
                                return {
                                    method: "set",
                                    param: {
                                        time: [y, m, d, h, _m, s],
                                        time_zone: this.formData.timezone
                                    }
                                };
                            }
                        ],
                        URLS = ["/time?form=ntp", "/time?form=info"];
                    if (
                        isFunction(ACTIONS[this.setType]) &&
                        URLS[this.setType]
                    ) {
                        this.postData(
                            URLS[this.setType],
                            ACTIONS[this.setType].call(this)
                        )
                            .then(_ => {
                                this.setType ? this.getTime() : this.getData();
                            })
                            .catch(_ => {});
                    }
                }
            });
        }
    },
    watch: {
        time() {
            /**
             *  一月 Jan. January
                二月 Feb. February
                三月 Mar. March
                四月 Apr. April
                五月 May. May
                六月 Jun. June
                七月 Jul. July
                八月 Aug. August
                九月 Sept. September
                十月 Oct. October
                十一月 Nov. November
                十二月 Dec. December
             */
            if (this.time && isArray(this.time.time_now)) {
                const now = this.time.time_now;
                this.formData.timezone = this.time.timezone;
                this.formData.time = new Date(
                    now[0],
                    now[1] - 1,
                    now[2],
                    now[3],
                    now[4],
                    now[5]
                );
            }
        }
    }
};
</script>

<style lang="less" scoped>
span {
    .base-font-style;
}
</style>