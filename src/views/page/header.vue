<template>
    <div id="header">
        <template v-if="system && system.vendor">
            <div
                id="logo"
                :style="{
                    'font-size': system.vendor.length > 10 ? '30px' : '',
                }"
            >
                <template v-if="hasLogo">
                    <img src="/logo.png" />
                </template>
                <template v-else>{{
                    system.vendor
                        ? system.vendor.length > 18
                            ? system.vendor.substring(0, 18)
                            : system.vendor
                        : "Neutral"
                }}</template>
            </div>
        </template>
        <div>
            <div style="max-width: 150px">
                <el-tooltip v-model="userVisible" :open-delay="200">
                    <template slot="content">{{
                        $lang("click_enter", "user_mgmt")
                    }}</template>
                    <el-button
                        type="text"
                        style="
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        "
                        @click="changeView('user_mgmt')"
                        >{{ username }}</el-button
                    >
                </el-tooltip>
            </div>
            <div>
                <el-dropdown
                    @command="shortcutCommand"
                    style="line-height: normal"
                >
                    <span>
                        <el-button type="text">
                            {{ $lang("shortcut") }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="socket">
                            {{ wsTips }}
                        </el-dropdown-item>
                        <el-dropdown-item command="save">
                            {{ $lang("save_config") }}
                        </el-dropdown-item>
                        <el-dropdown-item command="logout">
                            {{ $lang("logout") }}
                        </el-dropdown-item>
                        <el-dropdown-item command="reboot">
                            {{ $lang("reboot") }}
                        </el-dropdown-item>
                        <el-dropdown-item command="ponOptical">
                            {{ $lang("pon_optical") }}
                        </el-dropdown-item>
                        <el-dropdown-item command="viewConfig">
                            {{ $lang("view_cfg") }}
                        </el-dropdown-item>
                        <template v-if="custom.fix_lang === 0">
                            <el-dropdown-item command="zh">
                                简体中文
                            </el-dropdown-item>
                            <el-dropdown-item command="en">
                                English
                            </el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="navClick"
            style="float: right; height: 70px"
            router
            ref="nav-menu"
        >
            <template v-for="item in navData">
                <el-menu-item
                    :index="item.name"
                    style="height: 70px; line-height: 70px; user-select: none"
                >
                    {{ $lang(item.name) || item.name }}
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { isFunction, clearSessionStorage } from "@/utils/common";
import {
    LEVEL,
    ALARM_TYPE_MAP,
    MESSAGE_ACTION_MAP,
    ADVANCED_MENU,
} from "@/utils/commonData";
import logout from "@/mixin/logout";
import saveConfig from "@/mixin/saveConfig";
import rebootOlt from "@/mixin/rebootOlt";

const protocol = location.protocol.indexOf("https") > -1 ? "wss:" : "ws:";
const wsUrl =
    process.env.NODE_ENV === "production"
        ? `${protocol}//${window.location.host}/ws`
        : `${protocol}//${window.location.hostname}:8201/ws`;
export default {
    name: "pageHeader",
    mixins: [logout, saveConfig, rebootOlt],
    data() {
        return {
            activeIndex: "",
            username: "",
            userVisible: false,
            isOpenSocket: true,
            ws: null,
            ws_limit: 0,
            heartbeat: 30000,
            msgs: [],
            msgQueue: [],
            hasLogo: false,
        };
    },
    props: {
        navData: {
            type: Array,
            required: true,
        },
    },
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["lang", "system", "custom"]),
        wsTips() {
            if (this.isOpenSocket) {
                return this.$lang("close_rt_alarm");
            }
            return this.$lang("open_rt_alarm");
        },
    },
    created() {
        this.username = sessionStorage.getItem("uname");
        this.$http
            .get("/logo.png")
            .then((res) => {
                this.hasLogo = true;
            })
            .catch((err) => {});
    },
    mounted() {
        this.initSocket();
        this.$once("hook:beforeDestroy", () => {
            this.closeWs();
        });
    },
    methods: {
        ...mapMutations(["updateLang"]),
        ...mapActions(["setLanguage"]),
        shortcutCommand(command) {
            const ACTIONS = {
                socket() {
                    if (this.isOpenSocket) {
                        this.closeWs();
                    } else {
                        this.initSocket();
                    }
                    this.isOpenSocket = !this.isOpenSocket;
                },
                save() {
                    this.saveConfig();
                },
                logout() {
                    this.logout();
                },
                reboot() {
                    this.rebootOlt();
                },
                ponOptical() {
                    this.changeView("pon_optical");
                },
                viewConfig() {
                    this.viewCurrentConfig();
                },
                zh(lang) {
                    this.changeLang(lang);
                },
                en(lang) {
                    this.changeLang(lang);
                },
            };
            if (isFunction(ACTIONS[command])) {
                ACTIONS[command].call(this, command);
            }
        },
        navClick(path, subPath) {
            sessionStorage.setItem("nav", path);
        },
        // 跳转 user mgmt 或 pon optical
        changeView(path) {
            this.userVisible = false;
            const p = `/${path}`;
            if (p === this.$route.path) {
                return;
            }
            this.$router.push(p);
        },
        viewCurrentConfig() {
            this.$confirm(this.$lang("confirm_download_file"))
                .then((_) => {
                    this.$http
                        .get("/system_running_config")
                        .then((res) => {
                            if (res.data.code === 1) {
                                try {
                                    const anchor = document.createElement("a");
                                    anchor.href = "/oltconfigtmp.txt";
                                    anchor.setAttribute(
                                        "download",
                                        "oltconfigtmp.txt"
                                    );
                                    anchor.style.display = "none";
                                    document.body.appendChild(anchor);
                                    anchor.click();
                                    document.body.removeChild(anchor);
                                } catch (e) {}
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch((err) => {});
                })
                .catch((_) => {});
        },
        changeLang(lang) {
            if (lang === this.lang) {
                return;
            }
            this.$i18n.locale = lang;
            this.updateLang(lang);
            this.setLanguage(lang);
        },
        initSocket() {
            if ("WebSocket" in window) {
                let ws = new WebSocket(wsUrl);
                ws.onopen = (e) => {
                    if (ws.readyState === 1) {
                        this.sendRegisterMsg();
                        //  心跳检测
                        this.startHeartBeat();
                    }
                };
                ws.onmessage = (e) => {
                    this.wsHandle(e.data);
                };
                ws.onclose = (e) => {
                    if (e.code !== 0x3e8) {
                        if (this.ws_limit >= 3) {
                            this.$message.error(this.$lang("conn_error"));
                            clearSessionStorage();
                            this.$router.replace("/login");
                        } else {
                            this.ws_limit++;
                            this.initSocket();
                        }
                    } else {
                        this.ws_limit = 0;
                    }
                };
                ws.onerror = (e) => {};
                this.ws = ws;
            }
        },
        wsHandle(msg) {
            //  type: 1-alarm 2-message
            const { type, ...data } = JSON.parse(msg);

            const messageActions = {
                //  server推送，登录超时
                timeout() {
                    this.$message.error(this.$lang("login_timeout"));
                    clearSessionStorage();
                    this.$router.push("/login");
                },
                //  接收到服务器返回的register消息直接忽略，不作任何处理
                register() {},
                //  接收到server发送的pong包时的动作
                heartbeats() {
                    this.resetHeartBeat();
                },
            };
            const typeActions = {
                alarm(data) {
                    const { content, alarm_id } = data;
                    this.msgs.push(data);
                    //  设备重启告警
                    if (alarm_id === 0x1001) {
                        this.$message.warning({
                            message: content,
                            duration: 0,
                        });
                        this.msgs = [];
                        clearSessionStorage();
                        this.$router.push("/login");
                    }
                },
                message(data) {
                    //  action:  1-resgister，2-timeout，3-heartbeats
                    const { action } = data;
                    action &&
                        isFunction(
                            messageActions[MESSAGE_ACTION_MAP[action]]
                        ) &&
                        messageActions[MESSAGE_ACTION_MAP[action]].call(this);
                },
            };
            type &&
                isFunction(typeActions[ALARM_TYPE_MAP[type]]) &&
                typeActions[ALARM_TYPE_MAP[type]].call(this, data);
        },
        closeWs(code = 0x3e8) {
            if (this.ws) {
                this.ws.onclose = (e) => {};
                this.ws.close(code);
                this.ws = null;
            }
        },
        startHeartBeat() {
            this.timeout = setTimeout((_) => {
                this.ws &&
                    this.ws.send(
                        JSON.stringify({
                            type: 2,
                            action: 3,
                        })
                    );
            }, this.heartbeat);
        },
        resetHeartBeat() {
            clearTimeout(this.timeout);
            this.startHeartBeat();
        },
        sendRegisterMsg() {
            const xtoken = sessionStorage.getItem("x-token"),
                username = sessionStorage.getItem("uname");
            xtoken &&
                username &&
                this.ws.send(
                    JSON.stringify({
                        type: 2, // message
                        action: 1, // register
                        xtoken,
                        username,
                    })
                );
        },
    },
    watch: {
        $route(route) {
            if (route.path === "/main") {
                return (this.$refs["nav-menu"].activeIndex = "status");
            }
            const path = route.path.slice(1);
            const isNav =
                path === "main" ||
                this.navData.some((item) => item.name === path);
            if (!isNav) {
                this.$refs["nav-menu"].activeIndex = ADVANCED_MENU;
            } else if (path !== "login" || path !== "main") {
                this.$refs["nav-menu"].activeIndex = path;
            }
            if (isNav) {
                this.$refs["nav-menu"].activeIndex = path;
            }
        },
        navData() {
            const nav = sessionStorage.getItem("nav");
            if (nav) {
                this.activeIndex = nav;
            } else {
                if (this.navData[0]) {
                    this.activeIndex = this.navData[0].name;
                }
            }
        },
        msgs() {
            if (this.msgs.length) {
                if (this.msgQueue.length > 5) {
                    const notify = this.msgQueue.shift();
                    isFunction(notify.close) && notify.close(notify.id);
                }
                this.$nextTick(() => {
                    const { content, level, alarm_id } = this.msgs.shift();
                    content &&
                        this.msgQueue.push(
                            this.$notify({
                                title: this.$lang("tips"),
                                message: content,
                                position: "bottom-right",
                                type: LEVEL[level] || "info",
                            })
                        );
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
#logo {
    height: 70px;
    float: left;
    line-height: 70px;
    margin: 0 20px;
    max-width: 280px;
    min-width: 200px;
    overflow: hidden;
    text-align: center;
    font-size: 42px;
    font-weight: bold;
    color: @titleColor;
    img {
        max-width: 240px;
        max-height: 70px;
    }
    & + div {
        float: right;
        text-align: center;
        user-select: none;
        line-height: 70px;
        margin: 0 0 0 10px;
        &::after {
            content: "";
            display: table;
            clear: both;
        }
        > div {
            float: left;
            padding: 0 10px;
        }
    }
}
#header {
    box-sizing: border-box;
    height: 70px;
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}
</style>