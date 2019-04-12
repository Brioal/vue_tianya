<template>
    <div>
        <!--操作栏-->
        <div class="flex">
            <!--阅读量阈值-->
            <el-select
                    @change="refresh"
                    v-model="queryBean.intValue1">
                <el-option
                        v-for="item in read_stages"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input
                    class="left_10"
                    style="width: 400px"
                    v-model="queryBean.key"
                    placeholder="关键字">

            </el-input>
            <el-button
                    @keypress.enter.native="refresh"
                    style="margin-left: 10px"
                    type="primary"
                    class="left_10"
                    @click="getList"
            >
                搜索
            </el-button>
            <!--            抓取按钮-->
            <el-button class="left_10" type="success" @click="handleBook" v-if="!states.book">爬书单</el-button>
            <el-button type="danger" :loading="true" v-if="states.book">正在爬书单{{states.index}}页</el-button>
            <el-button type="danger" @click="handleStopBook" v-if="states.book">停止刷新书单</el-button>
        </div>
        <ReviewPagination
                :page-size.sync="queryBean.size"
                :page-index.sync="queryBean.page"
                :items-total="itemTotal"
                @refresh="refresh">
        </ReviewPagination>
        <!--        表格-->
        <el-table
                style="font-size: 14px"
                border
                v-loading="tableLoading"
                header-cell-class-name="cell_class_name"
                :data="list"
                class="el_table_style">
            <el-table-column
                    width="60px"
                    label="爬取状态"
            >
                <template slot-scope="scope" style="text-align: center">
                    <el-button type="success" icon="el-icon-check" size="mini" circle v-if="scope.row.done"></el-button>
                </template>
            </el-table-column>
            <el-table-column
                    width="60px"
                    label="下载状态"
            >
                <template slot-scope="scope" style="text-align: center">
                    <el-button type="success" icon="el-icon-check" size="mini" circle v-if="scope.row.send"></el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
            >
                <template slot-scope="scope" style="text-align: center">
                    <a :href="'http://bbs.tianya.cn'+scope.row.address" target="view_window">{{scope.row.title}}</a>
                </template>
            </el-table-column>
            <el-table-column
                    prop="people"
                    label="作者"
                    width="120">
            </el-table-column>
            <el-table-column
                    width="100px"
                    prop="readCount"
                    label="阅读">
            </el-table-column>
            <el-table-column
                    width="100px"
                    prop="reviewCount"
                    label="评论">
            </el-table-column>
            <el-table-column
                    width="150px"
                    prop="time"
                    label="更新时间">
            </el-table-column>
            <el-table-column
                    width="160px"
                    prop="editTimeStr"
                    label="刷新时间">
            </el-table-column>
            <el-table-column
                    width="100px"
                    prop="size"
                    label="文本大小">
            </el-table-column>
            <el-table-column
                    width="250px"
                    label="操作">
                <template slot-scope="scope" style="text-align: center">
                    <el-button-group>
                        <el-button type="success" size="mini" v-if="!states.txt" @click="handleStartTxt(scope.row.id)">
                            爬文本
                        </el-button>
                        <el-button type="danger" :loading="true" size="mini"
                                   v-if="states.txt&&states.txt_id==scope.row.id">正在爬{{states.index}}页
                        </el-button>
                        <el-button type="danger" size="mini"
                                   @click="handleStopTxt"
                                   v-if="states.txt&&states.txt_id==scope.row.id">取消爬
                        </el-button>
                        <el-button type="primary" size="mini" v-if="scope.row.done" @click="handleSender(scope.row.id)">
                            推送
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script lang="ts">
    import ReviewPagination from "@/views/ReviewPagination.vue";

    export default {
        name: "Home",
        components: {ReviewPagination},
        data() {
            return {
                // 阅读量阈值列表
                read_stages: [
                    {
                        label: "全部",
                        value: 0
                    }, {
                        label: "1k阅读量",
                        value: 1000
                    },
                    {
                        label: "5k阅读量",
                        value: 5000
                    },
                    {
                        label: "1w阅读量",
                        value: 10000
                    },
                    {
                        label: "2w阅读量",
                        value: 20000
                    },
                    {
                        label: "5w阅读量",
                        value: 50000
                    },
                    {
                        label: "10w阅读量",
                        value: 100000
                    }, {
                        label: "50w阅读量",
                        value: 500000
                    }, {
                        label: "100w阅读量",
                        value: 1000000
                    },
                ],
                // 表格记载
                tableLoading: false,
                // 数据列表
                list: [],
                // 状态
                states: {
                    book: false,
                    txt: false,
                    txt_id: -1,
                    index: -1,
                },
                // 查询参数
                queryBean: {
                    page: 0,
                    size: 10,
                    intValue1: 0,
                    key: ""
                },
                // 总数
                itemTotal: 0
            };
        },
        mounted: function() {
            this.refresh();
        },
        methods: {
            refresh: function() {
                this.getList();
                this.refreshState();
            },
            // 获取数据
            getList: function() {
                this.tableLoading = true;
                this.$http.post("/api/book/list", this.queryBean).then(response => {
                    this.tableLoading = false;
                    this.list = response.body.data.content;
                    this.itemTotal = response.body.data.totalElements;
                }, response => {
                    this.tableLoading = false;
                    this.list = [];
                    this.itemTotal = 0;
                });
            },
            // 抓取书单
            handleBook: function() {
                this.$http.post("/api/book/craw_book", null).then(response => {
                    console.log(response);
                }, response => {

                });
                this.states.book = true;
                this.refresh();
            },
            // 获取状态
            refreshState: function() {
                this.$http.post("/api/book/state", null).then(response => {
                    console.log(response);
                    this.states = response.body.data;
                    if (this.states.book || this.states.txt) {
                        var that = this;
                        setTimeout(function() {
                            that.refresh();
                        }, 2000);
                    }
                }, response => {

                });
            },
            // 停止抓取书单
            handleStopBook: function() {
                this.$http.post("/api/book/stop_menu", null).then(response => {
                    this.refresh();
                }, response => {
                    this.refresh();
                });
            },
            // 停止抓取txt
            handleStopTxt: function() {
                this.$http.post("/api/book/stop_txt", null).then(response => {
                    this.refresh();
                }, response => {
                    this.refresh();
                });
            },
            // 开始抓取文本
            handleStartTxt: function(id) {
                this.queryBean.page = 0;
                this.$http.post("/api/book/craw_txt/" + id, null).then(response => {
                    this.refresh();
                }, response => {
                    this.refresh();
                });
            },
            // 推送文件
            handleSender: function(id) {
                this.showLoading("正在推送");
                this.$http.post("/api/book/sender/" + id, null).then(response => {
                    this.showLoadDone("推送成功");
                    this.refresh();
                }, response => {
                    this.showLoadFailed("推送失败");
                    this.refresh();
                });
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
