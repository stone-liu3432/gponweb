<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang('running_status') }}</template>
        </page-header>
        <el-row :gutter="30" style="margin: 20px 0;">
            <el-col :span="10">
                <el-card shadow="never" class="company-info">
                    <template slot="header">
                        <span class="company-info-title">{{ $lang('sys_info') }}</span>
                    </template>
                    <template v-for="(item, key) in system">
                        <template v-if="key !== 'bl_ver' && key !== 'vendor'">
                            <p>
                                <span>{{ $lang(key) }}</span>
                                <span>{{ item }}</span>
                            </p>
                        </template>
                    </template>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-card shadow="never" class="company-info">
                    <template slot="header">
                        <span class="company-info-title">{{ $lang('hw_status') }}</span>
                    </template>
                    <el-row :gutter="30">
                        <el-col :span="10" style="text-align: center;">
                            <p class="base-font-style">{{ $lang('cpu_usage') }}</p>
                            <canvas width="200" height="200" ref="cpu-detail"></canvas>
                        </el-col>
                        <el-col :span="10" style="text-align: center;">
                            <p class="base-font-style">{{ $lang('memory_usage') }}</p>
                            <canvas width="200" height="200" ref="memory-detail"></canvas>
                        </el-col>
                    </el-row>
                    <h3>{{ $lang('sys_run_time') }}</h3>
                    <el-row style="padding: 6px;" class="base-font-style">
                        <el-col :span="6">{{ $lang('current_time') }}:</el-col>
                        <el-col :span="12">{{ cur_time }}</el-col>
                    </el-row>
                    <el-row style="padding: 6px;" class="base-font-style">
                        <el-col :span="6">{{ $lang('run_time') }}:</el-col>
                        <el-col :span="12">{{ run_time }}</el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-card shadow="never" class="company-info" style="margin: 0 15px;" v-if="showCompanyInfo">
            <template slot="header">
                <span class="company-info-title">{{ $lang('company_info') }}</span>
            </template>
            <p v-if="!!company_name">
                <span>{{ $lang('company_name') }}:</span>
                <span>{{ this.company_name }}</span>
            </p>
            <p v-if="!!company_addr">
                <span>{{ $lang('company_addr') }}:</span>
                <span>{{ this.company_addr }}</span>
            </p>
            <p v-if="!!company_email">
                <span>{{ $lang('company_email') }}:</span>
                <span>{{ this.company_email }}</span>
            </p>
            <p v-if="!!company_phone">
                <span>{{ $lang('company_phone') }}:</span>
                <span>{{ this.company_phone }}</span>
            </p>
        </el-card>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { isPlainObject, isArray } from "@/utils/common";
export default {
    name: "runningStatus",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["system", "time"]),
        cur_time() {
            if (isArray(this.now) && this.now.length) {
                const t = this.now;
                return `${t[0]}-${t[1]}-${t[2]} ${t[3]}:${t[4]}:${t[5]}`;
            }
            return "";
        },
        run_time() {
            if (isArray(this.runtime) && this.runtime.length) {
                const [d, h, m, s] = this.runtime;
                return `${d}${this.$lang("days")} ${h}${this.$lang(
                    "hours"
                )} ${m}${this.$lang("mins")} ${s}${this.$lang("secs")}`;
            }
            return "";
        },
        showCompanyInfo() {
            return (
                !!this.company_name ||
                !!this.company_addr ||
                !!this.company_email ||
                !!this.company_phone
            );
        }
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            usage: {},
            now: [],
            runtime: [],
            company_name: "",
            company_addr: "",
            company_email: "",
            company_phone: ""
        };
    },
    created() {
        this.getTime();
        this.getUsage();
        this.getCompanyInfo();
        const fn = () => {
            if (isArray(this.now) && this.now.length) {
                let now = +new Date(...this.now);
                now += 1000;
                const date = new Date(now);
                const y = date.getFullYear(),
                    m = date.getMonth(),
                    d = date.getDate(),
                    h = date.getHours(),
                    _m = date.getMinutes(),
                    s = date.getSeconds();
                this.now = [y, m, d, h, _m, s];
            }
            if (isArray(this.runtime) && this.runtime.length) {
                let [d, h, m, s] = this.runtime;
                if (s < 59) {
                    s++;
                } else {
                    s = 0;
                    m++;
                    if (m > 59) {
                        m = 0;
                        h++;
                        if (h > 23) {
                            h = 0;
                            d++;
                        }
                    }
                }
                this.runtime = [d, h, m, s];
            }
        };
        const interval = setInterval(fn, 1000);
        const refreshTimer = setInterval(_ => {
            this.getUsage();
        }, 10000);
        this.$once("hook:beforeDestroy", _ => {
            clearInterval(interval);
            clearInterval(refreshTimer);
        });
    },
    methods: {
        ...mapActions(["getTime"]),
        getUsage() {
            this.usage = {};
            this.$http
                .get("/board?info=cpu")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isPlainObject(res.data.data)) {
                            this.usage = res.data.data;
                            const { cpu_usage, memory_usage } = res.data.data;
                            this.$nextTick(_ => {
                                this.drawing(cpu_usage, memory_usage);
                            });
                        }
                    }
                })
                .catch(err => {});
        },
        drawing(cpuNum, memoryNum) {
            var cpu = this.$refs["cpu-detail"];
            if (!cpu) return;
            this.drawArc(cpu, cpuNum);
            var memory = this.$refs["memory-detail"];
            if (!memory) return;
            this.drawArc(memory, memoryNum);
        },
        drawArc(elm, num = 0) {
            if (!elm instanceof HTMLCanvasElement) {
                return;
            }
            const { width, height } = elm.getBoundingClientRect();
            const x = width / 2,
                y = height / 2,
                arcWidth = 15,
                basePad = 20,
                r = x - basePad;
            const ctx = elm.getContext("2d");
            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.lineWidth = arcWidth;
            ctx.strokeStyle = "#ccc";
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.stroke();

            // 开始绘制覆盖层
            ctx.beginPath();
            ctx.lineWidth = arcWidth;
            ctx.strokeStyle = "#65B2FB";
            if (num >= 70) {
                ctx.strokeStyle = "red";
            }
            //设置开始处为0点钟方向(-90 * Math.PI / 180)
            //num为百分比值(0-100)
            ctx.arc(
                x,
                y,
                r,
                (-90 * Math.PI) / 180,
                ((num * 3.6 - 90) * Math.PI) / 180
            );
            ctx.stroke();
            //绘制文字
            ctx.font = "40px Arial";
            ctx.fillStyle = "#65B2FB";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(num + "%", 100, 100);
        },
        getCompanyInfo() {
            this.company_name = "";
            this.company_addr = "";
            this.company_email = "";
            this.company_phone = "";
            this.$http
                .get("/board?info=setting_board")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isPlainObject(res.data.data)) {
                            const data = res.data.data;
                            this.company_name = data.name || "";
                            this.company_addr = data.addr || "";
                            this.company_email = data.email || "";
                            this.company_phone = data.phone || "";
                        }
                    }
                })
                .catch(err => {});
        }
    },
    watch: {
        time() {
            if (isPlainObject(this.time)) {
                if (isArray(this.time.time_now)) {
                    this.now = this.time.time_now;
                }
                if (isArray(this.time.uptime)) {
                    this.runtime = this.time.uptime;
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
    font-size: 16px;
    font-weight: normal;
}
.system-info-detail {
    .base-font-style;
    .system-info-item {
        padding: 6px;
        border-left: @border-style;
        border-top: @border-style;
        & + .system-info-item {
            border-right: @border-style;
        }
    }
    &:last-child {
        .system-info-item {
            border-bottom: @border-style;
        }
    }
}
p {
    margin: 0;
}
.company-info {
    p {
        margin: 12px;
        .base-font-style;
        span {
            display: inline-block;
            vertical-align: middle;
            &:first-child {
                width: 140px;
            }
        }
    }
    .company-info-title {
        color: @titleColor;
    }
}
</style>