<template>
    <div id="header">
        <div id="logo">logo区域，最大240px*70px</div>
        <div>
            <div>
                <el-tooltip disabled>
                    <template slot="content"></template>
                    <el-button type="text" @click="logout">{{ $lang('logout') }}</el-button>
                </el-tooltip>
            </div>
            <div @mouseenter="showTips" @mouseleave="hideTips">
                <el-tooltip :open-delay="200" v-model="saveVisible" :manual="true">
                    <template slot="content">{{ $lang('save_cfg_info') }}</template>
                    <el-button type="text" @click="saveConfig">{{ $lang('save') }}</el-button>
                </el-tooltip>
            </div>
            <div style="max-width: 100px;">
                <el-tooltip v-model="userVisible" :open-delay="200">
                    <template slot="content">{{ $lang('click_enter','user_mgmt') }}</template>
                    <el-button
                        type="text"
                        style="width: 100%; overflow: hidden; text-overflow: ellipsis;"
                        @click="changeView('user_mgmt')"
                    >{{ username }}</el-button>
                </el-tooltip>
            </div>
            <div>
                <el-dropdown @command="changeLang">
                    <span>
                        <el-button type="text">
                            {{ langMap[lang] }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="zh">简体中文</el-dropdown-item>
                        <el-dropdown-item command="en">English</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="navClick"
            style="float: right; height: 69px;"
            router
        >
            <template v-for="item in navData">
                <el-menu-item
                    :index="item.name"
                    style="height: 69px; line-height: 69px; user-select: none;"
                >{{ $lang(item.name) || item.name }}</el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import logout from "@/mixin/logout";
import saveConfig from "@/mixin/saveConfig";
export default {
    name: "pageHeader",
    mixins: [logout, saveConfig],
    data() {
        return {
            activeIndex: "",
            username: "",
            langMap: {
                zh: "简体中文",
                en: "English"
            },
            saveVisible: false,
            userVisible: false
        };
    },
    props: {
        navData: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["lang"])
    },
    created() {
        this.username = sessionStorage.getItem("uname");
    },
    mounted() {},
    methods: {
        ...mapMutations(["updateLang"]),
        changeLang(lang) {
            if (lang === this.lang) {
                return;
            }
            this.$i18n.locale = lang;
            this.updateLang(lang);
        },
        navClick(path, subPath) {
            sessionStorage.setItem("nav", path);
        },
        changeView(path) {
            this.userVisible = false;
        },
        showTips() {
            this.saveVisible = true;
        },
        hideTips() {
            this.saveVisible = false;
        }
    },
    watch: {
        navData() {
            if (this.navData[0]) {
                this.activeIndex = this.navData[0].name;
            }
        }
    }
};
</script>

<style lang="less" scoped>
#logo {
    height: 70px;
    float: left;
    line-height: 70px;
    margin: 0 20px;
    max-width: 240px;
    overflow: hidden;
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