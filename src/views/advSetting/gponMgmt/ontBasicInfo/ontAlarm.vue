<template>
    <div>
        <ul>
            <template v-for="item in data">
                <li>{{ item }}</li>
            </template>
        </ul>
        <el-backtop :target="backTopTarget"></el-backtop>
    </div>
</template>

<script>
export default {
    name: "ontAlarm",
    props: {
        data: {
            type: Array
        }
    },
    inject: ["backTopTarget"]
};
</script>

<style lang="less" scoped>
li {
    .base-font-style;
    padding: 6px 0;
    font-size: 16px;
}
</style>