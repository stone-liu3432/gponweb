<template>
    <el-container>
        <el-aside width="220px">
            <adv-aside></adv-aside>
        </el-aside>
        <el-main>
            <adv-content></adv-content>
        </el-main>
    </el-container>
</template>

<script>
import advContent from "@/views/advSetting/content";
import advAside from "@/views/advSetting/aside";
export default {
    name: "advancedSetting",
    components: { advContent, advAside }
};
</script>

<style lane="less" scoped>
</style>