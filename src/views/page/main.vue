<template>
    <el-container>
        <el-header style="border-bottom: 1px solid #E6E6E6;" height="70px">
            <page-header :nav-data="nav"></page-header>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
import pageComponents from "@/router/dynamicRouter";
import { isDef, isArray } from "@/utils/common";
const pageHeader = () => import(/* webpackChunkName: "main-page" */ "./header");
export default {
    name: "mainContent",
    components: { pageHeader },
    data() {
        return {
            nav: [],
            adv: []
        };
    },
    created() {
        this.$http
            .all([this.getNav(), this.getAdvMenu()])
            .then(
                this.$http.spread((navData, advData) => {
                    (this.nav = navData.data.data.menu),
                        (this.adv = advData.data.data.menu);
                    const routes = this.$router.options.routes;
                    const rts = this.cerateRoutes(this.nav, routes, {
                        root: "main"
                    });
                    const sub = this.cerateRoutes(this.adv, rts, {
                        root: "advanced_setting"
                    });
                    this.$router.addRoutes(sub);
                    // 路由加载完成后，跳转默认路由
                    this.$router.push("/status");
                })
            )
            .catch(err => {});
    },
    methods: {
        getNav() {
            return this.$http.get("/board?info=nav");
        },
        getAdvMenu() {
            return this.$http.get("/board?info=menu");
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
                            if (item.children && isArray(item.children)) {
                                item.children.forEach(_item => {
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
                                meta: child.meta
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
                    requireAuth: true
                }
            };
            if (isDef(index)) {
                item.meta.index = index;
            }
            return item;
        },
        findParent(node, path) {
            const result = [];
            node.forEach(item => {
                if (item.children) {
                    result.push(...this.findParent(item.children, path));
                }
                if (item.path === `/${path}`) {
                    result.push(item);
                }
            });
            return result;
        }
    }
};
</script>

<style lang="less" scoped></style>