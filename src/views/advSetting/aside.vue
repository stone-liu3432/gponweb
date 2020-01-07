<script>
"use strict";
import { mapGetters, mapState } from "vuex";
import { ADVANCED_MENU } from "@/utils/commonData";
export default {
    name: "adv-aside",
    computed: {
        ...mapState(["advMenu"]),
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            activedItem: "running_status",
            openeds: []
        };
    },
    inject: ["updateAdvAsideScrollbar"],
    methods: {
        advSelected(key, path) {
            sessionStorage.setItem("advMenu", key);
            this.updateAdvAsideScrollbar();
            // 点击无子菜单的菜单项时，收起已打开的子菜单
            if (path.length === 1) {
                this.openeds = [key];
            }
        }
    },
    created() {
        const nav = sessionStorage.getItem("nav"),
            adv = sessionStorage.getItem("advMenu");
        if (nav === ADVANCED_MENU && !!adv) {
            this.activedItem = adv;
            this.$router.push(`/${adv}`);
        }
    },
    watch: {
        $route() {
            const path = this.$route.path;
            this.activedItem = path.substr(1);
        }
    },
    render(h) {
        return (
            <el-menu
                default-active={this.activedItem}
                router
                unique-opened
                onSelect={this.advSelected}
                default-openeds={this.openeds}
                style="padding: 20px 0;"
            >
                {this.advMenu.map(item => {
                    if (!item.children) {
                        return (
                            <el-menu-item index={item.name}>
                                {this.$lang(item.name)}
                            </el-menu-item>
                        );
                    } else {
                        const sub = item.children;
                        return (
                            <el-submenu index={item.name}>
                                <template slot="title">
                                    {this.$lang(item.name) || item.name}
                                </template>
                                {sub.map(_item => {
                                    return (
                                        <el-menu-item index={_item.name}>
                                            {this.$lang(_item.name) ||
                                                _item.name}
                                        </el-menu-item>
                                    );
                                })}
                            </el-submenu>
                        );
                    }
                })}
            </el-menu>
        );
    }
};
</script>

<style lang="less" scoped>
</style>