<template>
    <el-row style="text-transform: capitalize;">
        <template v-for="(item, key) in data">
            <template v-if="key !== 'port_id'">
                <el-col :span="6" style="padding: 6px;">{{ key.replace(/_/g, ' ') }}:</el-col>
                <el-col :span="6" style="padding: 6px;">{{ item }}</el-col>
            </template>
        </template>
    </el-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "perfDetail",
    props: {
        data: {
            type: Object
        }
    },
    computed: {
        ...mapGetters(["$lang"])
    }
};
</script>

<style lang='less' scoped>
</style>