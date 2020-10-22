<template>
    <el-container :style="{ overflow: 'hidden', height: `${height}px` }">
        <el-aside width="220px" style="margin-left: 20px;">
            <el-scrollbar
                :native="false"
                :noresize="true"
                :viewStyle="{ height: `${height}px` }"
                ref="adv-aside-scrollbar"
            >
                <adv-aside></adv-aside>
            </el-scrollbar>
        </el-aside>
        <el-main style="overflow: hidden; padding: 0;">
            <el-scrollbar
                :native="false"
                :noresize="true"
                wrapClass="backtop-target"
                :viewStyle="{ height: `${height}px` }"
                ref="adv-main-scrollbar"
                style="z-index: 10;"
            >
                <adv-content></adv-content>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script>
import advContent from "@/views/advSetting/content";
import advAside from "@/views/advSetting/aside";
export default {
    name: "advancedSetting",
    components: { advContent, advAside },
    data() {
        return {
            height: 0
        };
    },
    inject: ["updateNavScrollbar"],
    provide() {
        return {
            updateAdvAsideScrollbar: this.updateAdvAsideScrollbar,
            updateAdvMainScrollbar: this.updateAdvMainScrollbar,
            // 有需要添加 backtop组件的 target
            backTopTarget: ".backtop-target"
        };
    },
    mounted() {
        const height = document.documentElement.clientHeight;
        // menu高度，屏高 - header高度 - main的内padding
        // content区域，屏高 - header高度 - main的内padding - content的内padding
        this.height = height - 71;

        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    methods: {
        updateAdvAsideScrollbar() {
            this.$refs["adv-aside-scrollbar"].update();
        },
        updateAdvMainScrollbar() {
            this.$refs["adv-main-scrollbar"].update();
        }
    }
};
</script>

<style lane="less" scoped>
</style>