<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("running_status") }}</template>
        </page-header>
        <el-row :gutter="30" style="margin: 20px 0">
            <el-col :span="11">
                <el-card shadow="never" class="company-info">
                    <template slot="header">
                        <span class="company-info-title">
                            {{ $lang("sys_info") }}
                        </span>
                        <el-button
                            type="primary"
                            size="mini"
                            style="float: right"
                            @click="setHostName"
                        >
                            {{ $lang("set_dev_name") }}
                        </el-button>
                    </template>
                    <p>
                        <span>{{ $lang("dev_name") }}:</span>
                        <span>{{ hostname || "-" }}</span>
                    </p>
                    <template v-for="key in sysKey">
                        <p>
                            <span>{{ $lang(key) }}:</span>
                            <template v-if="key !== 'device_type'">
                                <span>{{ system[key] || "" }}</span>
                            </template>
                            <template v-else>
                                <span>
                                    {{ system[key] === 1 ? "EPON" : "GPON" }}
                                </span>
                            </template>
                        </p>
                    </template>
                    <p>
                        <span>{{ $lang("current_time") }}:</span>
                        <span>{{ cur_time }}</span>
                    </p>
                    <p>
                        <span>{{ $lang("run_time") }}:</span>
                        <span>{{ run_time }}</span>
                    </p>
                    <p>
                        <span>{{ $lang("panel_temp") }}:</span>
                        <span>
                            {{ (system["panel_temp"] / 1000).toFixed(2) }}
                            °C
                        </span>
                    </p>
                    <p>
                        <span>{{ $lang("right_temp") }}:</span>
                        <span>
                            {{ (system["right_temp"] / 1000).toFixed(2) }}
                            °C
                        </span>
                    </p>
                    <p>
                        <span>{{ $lang("lic_available") }}:</span>
                        <span
                            :style="{
                                color: system.lic_available <= 5 ? 'red' : '',
                            }"
                        >
                            {{ system.lic_available }}
                        </span>
                    </p>
                    <p>
                        <span>{{ $lang("lic_total") }}:</span>
                        <span style="width: 80px">
                            {{
                                system.lic_tatol === 0
                                    ? $lang("forever")
                                    : system.lic_total
                            }}
                        </span>
                        <template
                            v-if="system.lic_total && system.lic_total !== 0"
                        >
                            <el-button
                                type="primary"
                                size="mini"
                                @click="addLicTotal"
                            >
                                {{ $lang("add", "lic_total") }}
                            </el-button>
                        </template>
                    </p>
                </el-card>
            </el-col>
            <el-col :span="13">
                <el-card shadow="never" class="company-info">
                    <template slot="header">
                        <span class="company-info-title">{{
                            $lang("hw_status")
                        }}</span>
                    </template>
                    <el-row :gutter="30">
                        <el-col :span="10" style="text-align: center">
                            <p class="base-font-style">
                                {{ $lang("cpu_usage") }}
                            </p>
                            <canvas
                                width="200"
                                height="200"
                                ref="cpu-detail"
                            ></canvas>
                        </el-col>
                        <el-col :span="10" style="text-align: center">
                            <p class="base-font-style">
                                {{ $lang("memory_usage") }}
                            </p>
                            <canvas
                                width="200"
                                height="200"
                                ref="memory-detail"
                            ></canvas>
                        </el-col>
                    </el-row>
                    <h3>{{ $lang("fan_speed") }}</h3>
                    <template v-for="item in fans">
                        <el-row style="padding: 6px" class="base-font-style">
                            <el-col :span="6" style="line-height: 38px"
                                >{{ $lang("fanid") + item.fanid }}:</el-col
                            >
                            <el-col :span="12">
                                <el-slider
                                    v-model="item.speed"
                                    :max="255"
                                    disabled
                                ></el-slider>
                            </el-col>
                        </el-row>
                    </template>
                </el-card>
            </el-col>
        </el-row>
        <el-card
            shadow="never"
            class="company-info"
            style="margin: 0 15px"
            v-if="showCompanyInfo"
        >
            <template slot="header">
                <span class="company-info-title">{{
                    $lang("company_info")
                }}</span>
            </template>
            <p v-if="!!company_name">
                <span>{{ $lang("company_name") }}:</span>
                <span>{{ this.company_name }}</span>
            </p>
            <p v-if="!!company_addr">
                <span>{{ $lang("company_addr") }}:</span>
                <span>{{ this.company_addr }}</span>
            </p>
            <p v-if="!!company_email">
                <span>{{ $lang("company_email") }}:</span>
                <span>{{ this.company_email }}</span>
            </p>
            <p v-if="!!company_phone">
                <span>{{ $lang("company_phone") }}:</span>
                <span>{{ this.company_phone }}</span>
            </p>
        </el-card>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { isPlainObject, isArray } from "@/utils/common";
import postData from "@/mixin/postData";
export default {
    name: "runningStatus",
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["system", "time"]),
        sysKey() {
            return [
                "product_name",
                "sys_ver",
                "fw_ver",
                "hw_ver",
                "macaddr",
                "sn",
                "device_type",
                "ponports",
                "geports",
                "xgeports",
                "build_time",
            ];
        },
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
        },
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
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
            company_phone: "",
            fans: [],
            hostname: "",
            devName: "",
        };
    },
    created() {
        this.getFanInfo();
        this.getTime();
        this.getUsage();
        this.getCompanyInfo();
        this.getDevName();
        const fn = () => {
            if (isArray(this.now) && this.now.length) {
                let now = +new Date(
                    ...this.now.map((item, index) => {
                        if (index === 1) {
                            return item - 1;
                        }
                        return item;
                    })
                );
                now += 1000;
                const date = new Date(now);
                const y = date.getFullYear(),
                    m = date.getMonth(),
                    d = date.getDate(),
                    h = date.getHours(),
                    _m = date.getMinutes(),
                    s = date.getSeconds();
                this.now = [y, m + 1, d, h, _m, s];
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
        const refreshTimer = setInterval(() => {
            this.getFanInfo();
            this.getUsage();
        }, 10000);
        this.$once("hook:beforeDestroy", () => {
            clearInterval(interval);
            clearInterval(refreshTimer);
        });
    },
    methods: {
        ...mapActions(["getTime", "getSystemInfo"]),
        getUsage() {
            this.usage = {};
            this.$http
                .get("/board?info=cpu")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isPlainObject(res.data.data)) {
                            this.usage = res.data.data;
                            const { cpu_usage, memory_usage } = res.data.data;
                            this.$nextTick((_) => {
                                this.drawing(cpu_usage, memory_usage);
                            });
                        }
                    }
                })
                .catch((err) => {});
        },
        getFanInfo() {
            this.$http
                .get("/board?info=fan")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.fans = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
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
                .then((res) => {
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
                .catch((err) => {});
        },
        getDevName() {
            this.$http
                .get("/system?form=hostname")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.hostname = res.data.data.hostname;
                        }
                    }
                })
                .catch((err) => {});
        },
        setHostName() {
            this.devName = this.hostname;
            this.$prompt(this.$lang("dev_name"), this.$lang("config"), {
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                closeOnClickModal: false,
                closeOnPressEscape: false,
                inputValue: this.devName,
                inputPattern: /^[a-z].{0,63}$/i,
                inputErrorMessage: this.validateMsg("inputLength", 1, 64),
            })
                .then(({ value }) => {
                    if (value === this.hostname) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/system?form=hostname", {
                        method: "set",
                        param: {
                            hostname: value,
                        },
                    })
                        .then(() => {
                            this.getDevName();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        addLicTotal() {
            this.$prompt("license: ", this.$lang("add"), {
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                closeOnClickModal: false,
                closeOnPressEscape: false,
                inputPattern: /^[\da-z]{32}$/i,
                inputErrorMessage: this.validateMsg("inputLength", 32),
            })
                .then(({ value }) => {
                    this.postData("/board?info=trylic", {
                        method: "set",
                        param: {
                            trylic: value,
                        },
                    })
                        .then(() => {
                            this.getSystemInfo();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
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
        },
    },
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
        span + span {
            width: calc(~"100% - 140px");
            overflow-wrap: break-word;
            word-break: break-all;
        }
    }
    .company-info-title {
        color: @titleColor;
    }
}
</style>