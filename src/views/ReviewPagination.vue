<template>
    <div style="margin-top: 10px;text-align: center">
        <el-pagination
                :current-page="index"
                :page-sizes="[10, 20, 50, 100,200]"
                :page-size="size"
                background
                @size-change="sizeChange"
                @prev-click="indexChange"
                @next-click="indexChange"
                @current-change="indexChange"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "ReviewPagination",
        props: {
            pageIndex: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 10
            },
            itemsTotal: {
                type: Number,
                default: 0
            }
        },
        computed: {
            index: function () {
                return this.pageIndex + 1;
            },
            size: function () {
                return this.pageSize
            },
            total: function () {
                return this.itemsTotal
            }
        },
        methods: {
            sizeChange: function (pageSize) {
                console.log(pageSize);
                this.$emit('update:pageSize', pageSize);
                this.$emit("refresh");
            },
            indexChange: function (index) {
                console.log(index);
                this.$emit('update:pageIndex', index - 1);
                this.$emit("refresh");
            }
        }
    }
</script>

<style scoped>

</style>
