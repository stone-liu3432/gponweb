<template>
    <div id="app">
        <!-- <transition :name="transitionName"> -->
        <router-view />
        <!-- </transition> -->
    </div>
</template>

<script>
import { isUndef, isDef } from "@/utils/common";
import { mapMutations, mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "HSGQ",
    created() {
        // 刷新时
        const lang = sessionStorage.getItem("lang");
        // sessionStorage的值会转换为 string类型
        // 防止用户手动修改sessionStroage的内容并刷新页面
        if (!["zh", "en"].includes(lang)) {
            this.getLang();
        } else {
            this.updateLang(lang);
        }
    },
    computed: {
        ...mapState(["lang"]),
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            transitionName: ""
        };
    },
    mounted() {},
    methods: {
        ...mapMutations(["updateLang"]),
        getLang() {
            this.$http
                .get("/system_lang")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.updateLang(res.data.data.lang || "en");
                            sessionStorage.setItem(
                                "lang",
                                res.data.data.lang || "en"
                            );
                        }
                    }
                })
                .catch(err => {});
        }
    },
    watch: {
        // 路由切换时的过渡效果(左滑动或右滑动)
        // $route(to, from) {
        //     const tIdx = to.meta.index,
        //         fIdx = from.meta.index;
        //     if (isDef(tIdx) && isDef(fIdx)) {
        //         this.transitionName =
        //             tIdx > fIdx
        //                 ? "slide-right"
        //                 : tIdx < fIdx
        //                 ? "slide-left"
        //                 : "";
        //     }
        // }
    }
};
</script>

<style lang="less">
body {
    margin: 0;
    // background: @bodyBg;
    min-width: 1280px;
}
// .slide-right-enter-active,
// .slide-right-leave-active,
// .slide-left-enter-active,
// .slide-left-leave-active {
//     will-change: transform;
//     transition: all 300ms;
//     height: 100%;
//     top: 0px;
//     position: absolute;
//     backface-visibility: hidden;
//     perspective: 1000;
// }
// .slide-left-enter {
//     transform: translate3d(-100%, 0, 0);
// }
// .slide-left-leave-active {
//     transform: translate3d(0, 0, 0);
// }
// .slide-right-enter {
//     transform: translate3d(100%, 0, 0);
// }
// .slide-right-leave-active {
//     transform: translate3d(0, 0, 0);
// }
</style>
