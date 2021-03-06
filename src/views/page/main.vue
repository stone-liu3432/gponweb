<template>
    <el-container>
        <el-header style="border-bottom: 1px solid #cccccc" height="71px">
            <nav-header :nav-data="nav"></nav-header>
        </el-header>
        <el-scrollbar
            :native="false"
            :noresize="true"
            :viewStyle="{ height: `${height}px` }"
            ref="nav-scrollbar"
        >
            <el-main style="padding: 0">
                <router-view></router-view>
            </el-main>
        </el-scrollbar>
    </el-container>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import pageComponents from "@/router/dynamicRouter";
import {
    isDef,
    isArray,
    isUndef,
    clearSessionStorage,
    throttle,
} from "@/utils/common";
import { ADVANCED_MENU } from "@/utils/commonData";
import provider from "@/utils/provider";
const navHeader = () => import(/* webpackChunkName: "main-page" */ "./header");
export default {
    name: "mainContent",
    computed: {
        ...mapGetters(["validateMsg", "$lang"]),
    },
    components: { navHeader },
    mixins: [provider],
    data() {
        return {
            nav: [],
            adv: [],
            height: 0,
            showMessage: true,
        };
    },
    created() {
        this.httpInterceptors();
        Promise.all([this.getNav(), this.getAdvMenu()])
            .then(([nav, adv]) => {
                this.nav = nav;
                this.adv = adv;
                this.updateNavMenu(this.nav);
                this.updateAdvMenu(this.adv);
                const routes = this.$router.options.routes;
                const rts = this.cerateRoutes(this.nav, routes, {
                    root: "main",
                });
                const sub = this.cerateRoutes(this.adv, rts, {
                    root: ADVANCED_MENU,
                });
                this.$router.addRoutes(sub);
                // 路由加载完成后，跳转默认路由
                this.$nextTick((_) => {
                    const nav = sessionStorage.getItem("nav");
                    nav
                        ? this.$router.push(`/${nav}`)
                        : this.$router.push("/status");
                });
            })
            .catch((err) => {});
        this.getSystemInfo()
            .then(() => {
                this.getPort();
            })
            .catch((err) => {});
        this.getPon();
    },
    mounted() {
        const height = document.documentElement.clientHeight;
        this.height = height - 71;
        const resizeCb = throttle(
            (e) => {
                const height = document.documentElement.clientHeight;
                this.height = height - 71;
                this.$nextTick(() => {
                    this.updateNavScrollbar();
                });
            },
            300,
            this
        );
        window.addEventListener("resize", resizeCb, false);
        this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("resize", resizeCb);
        });
    },
    methods: {
        ...mapActions(["getSystemInfo", "getPon", "getPort"]),
        ...mapMutations(["updateAdvMenu", "updatePortName", "updateNavMenu"]),
        getNav() {
            return this.$http
                .get("/board?info=nav")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            if (isArray(res.data.data.menu)) {
                                return Promise.resolve(res.data.data.menu);
                            }
                        }
                    }
                    return Promise.reject(res.data);
                })
                .catch((err) => {});
        },
        getAdvMenu() {
            return this.$http
                .get("/board?info=menu")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            if (isArray(res.data.data.menu)) {
                                return Promise.resolve(res.data.data.menu);
                            }
                        }
                    }
                    return Promise.reject(res.data);
                })
                .catch((err) => {});
        },
        /**
         * @method 创建符合routes选项的数组
         * @param {Array} menu  后台获取的要加入路由的列表
         * @param {Array} routes 当前已存在的路由列表
         * @param {Object} opts 配置信息，用于添加嵌套路由
         * @return {Array} 返回符合vue-router选项要求的数组
         */
        cerateRoutes(menu, routes, opts) {
            if (isDef(opts)) {
                const { root } = opts;
                if (typeof root === "string") {
                    const parent = this.findParent(routes, root)[0];
                    if (isDef(parent)) {
                        parent.children = menu.reduce((prev, item) => {
                            if (
                                isDef(item.children) &&
                                isArray(item.children)
                            ) {
                                item.children.forEach((_item) => {
                                    prev.push(this.createRoute(_item, 4));
                                });
                            } else {
                                prev.push(this.createRoute(item, 4));
                            }
                            return prev;
                        }, []);
                        const child = parent.children[0];
                        isDef(child) &&
                            parent.children.unshift({
                                path: `/${root}`,
                                component: child.component,
                                meta: child.meta,
                            });
                    }
                }
                return routes;
            }
        },
        createRoute(node, index) {
            const path = node.name;
            const item = {
                path: `/${path}`,
                component: pageComponents[path],
                meta: {
                    requireAuth: true,
                },
            };
            if (isDef(index)) {
                item.meta.index = index;
            }
            return item;
        },
        findParent(node, path) {
            const result = [];
            node.forEach((item) => {
                if (item.children) {
                    result.push(...this.findParent(item.children, path));
                }
                if (item.path === `/${path}`) {
                    result.push(item);
                }
            });
            return result;
        },
        updateNavScrollbar() {
            this.$refs["nav-scrollbar"].update();
        },
        httpInterceptors() {
            this.$http.interceptors.response.use(
                (response) => {
                    const jumpToLogin = () => {
                        clearSessionStorage();
                        this.$router.push("/login");
                    };
                    //  返回 0 ，非法登录信息
                    if (response.data.code === 0) {
                        if (this.showMessage) {
                            this.$message.error(
                                this.$lang("illegal_login_info")
                            );
                            this.showMessage = false;
                        }
                        jumpToLogin();
                    }
                    //  返回 -1，登录超时
                    if (response.data.code === -1) {
                        if (this.showMessage) {
                            this.$message.error(this.$lang("login_timeout"));
                            this.showMessage = false;
                        }
                        jumpToLogin();
                    }
                    // 返回 warning 或 error 时(code > 1)，有时需刷新数据或者是执行其他操作
                    if (/^\s*error/i.test(response.data.message)) {
                        response.data.type = "error";
                    }
                    if (/^\s*warning/i.test(response.data.message)) {
                        response.data.type = "warning";
                    }
                    return response;
                },
                (err) => {
                    return Promise.reject(err);
                }
            );
        },
    },
};
</script>

<style lang="less" scoped></style>
