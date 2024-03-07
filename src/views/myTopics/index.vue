<template>
  <div class="custom-main-container">
    <div class="custom-main-container__content">
      <div class="custom-main-container__form">
        <el-form :inline="true" class="demo-form-inline">
          <div class="search-container">
            <div>
              <el-form-item class="topics-name-container">
                主题
                <el-input
                  label="主题"
                  placeholder="请输入主题"
                  v-model="search.topicName"
                  @keydown.enter.native="queryData"
                ></el-input>
              </el-form-item>
              <el-form-item class="topics-status-container">
                状态
                <el-select
                  v-model="search.topicStatus"
                  class="select"
                  @change="queryData"
                >
                  <el-option
                    v-for="item of topicsStatusList"
                    :label="item.paramName"
                    :value="item.paramCode"
                    :key="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="search-buttons">
                <el-form-item style="text-align: right; width: 100%">
                  <el-button @click="reset">重置</el-button>
                  <el-button type="primary" @click="queryData">查询</el-button>
                </el-form-item>
              </div>
            </div>
          </div>
          <div style="margin: -10px 0 15px 0">
            <el-button
              type="warning"
              @click="
                () => {
                  this.$router.push('publishTopics');
                }
              "
              >发起议题</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="custom-main-container__table">
        <custom-table
          class="my-table topicsList-table"
          :isIndex="true"
          :isResizable="true"
          :isPagination="true"
          :isHandle="true"
          :tableData="tableData"
          :tableCols="tableCols"
          :pagination="pagination"
          :loading="tableLoading"
          @operateRow="operateRow"
          @reloadTable="initTableData"
          @sortChange="sortChange"
        />
      </div>
    </div>
    <Drawer ref="drawer" @initTableData="initTableData" />
  </div>
</template>

<script>
import "@/styles/customMain/index.scss";
import {
  queryTopic,
  endMeeting,
  getUserMeetingUrl,
  getMeetingVideoUrl,
  queryTopicById,
} from "@/api/myTopics";
import { queryList } from "@/api/programme/index";
import CustomTable from "../../components/Table/CustomTable";
import Drawer from "./drawer.vue";
export default {
  name: "myTopics",
  components: {
    CustomTable,
    Drawer,
  },
  computed: {},
  data() {
    return {
      search: {
        topicStatus: "",
        topicName: "",
        createTimeLiftFlag: "",
        updateTimeLiftFlag: "",
      },
      topicsStatusList: [],
      tableCols: [
        {
          label: "主题",
          minWidth: "150",
          prop: "topicName",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "议事类型",
          prop: "topicTypeName",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "发布人",
          prop: "createRealName",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "状态",
          headerAlign: "center",
          align: "center",
          prop: "topicStatusDesc",
        },
        {
          label: "创建时间",
          headerAlign: "center",
          align: "center",
          prop: "createTime",
          sort: true,
        },
        {
          label: "更新时间",
          headerAlign: "center",
          align: "center",
          prop: "updateTime",
          sort: true,
        },
        {
          label: "操作",
          type: "Text",
          minWidth: "200",
          headerAlign: "center",
          align: "right",
          fixed: "right",
          getBtnList: (row) => {
            // console.log("===", row);
            let btnList = [];
            if (row.createUser == sessionStorage.getItem("userId")) {
              if (row.topicStatus == 3) {
                btnList.push({
                  type: "primary",
                  func: "endMeetingFn",
                  label: "结束会议",
                });
                btnList.push({
                  type: "primary",
                  func: "enterMeeting",
                  label: "视频入会",
                });
                if (row.voteStaticalFlag != 1) {
                  btnList.push({
                    type: "primary",
                    func: "poll",
                    label: "发起投票",
                  });
                }
                btnList.push({
                  type: "primary",
                  func: "changePeople",
                  label: "参会确认",
                });
              }
              if (row.topicStatus == 2) {
                btnList.push({
                  type: "primary",
                  func: "formPlan",
                  label: row.scheme == null ? "会议通知" : "修改会议",
                });
                if (row.scheme == 0) {
                  btnList.push({
                    type: "primary",
                    func: "changePeople",
                    label: "参会确认",
                  });
                }
              }
              if (
                row.topicStatus == 4 ||
                (row.topicStatus == 5 && row.scheme == 1)
              ) {
                btnList.push({
                  type: "primary",
                  func: "pollCollect",
                  label: "投票汇总",
                });
              }
              if (row.topicStatus == 5 && row.scheme == 0) {
                // 测试开放
                // if (row.topicStatus == 5 ) {
                btnList.push({
                  type: "primary",
                  func: "changePeople",
                  label: "参会确认",
                });
                btnList.push({
                  type: "primary",
                  func: "formSummary",
                  label: "会议纪要",
                });
                if (row.vcfMeetingId) {
                  btnList.push({
                    type: "primary",
                    func: "enterViedo",
                    label: "录像回放",
                  });
                }
              }
            }
            if (row.topicStatus == 6 && row.vcfMeetingId) {
              btnList.push({
                type: "primary",
                func: "enterViedo",
                label: "录像回放",
              });
            }
            btnList.push({
              type: "primary",
              func: "topicDetail",
              label: "查看议题",
            });
            return btnList;
          },
        },
      ],
      tableData: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 123,
      },
      tableLoading: false,
      infoDiglogOpen: false,
    };
  },
  mounted() {
    this.initTableData(); //初始化表格数据
    var params = new URLSearchParams();
    params.append("paramCodeType", "FGM_TOPIC_STATUS");
    queryList(params).then((res) => {
      this.topicsStatusList = res.object;
    });
  },
  created() {},
  methods: {
    queryData() {
      this.pagination.pageNum = 1;
      this.initTableData();
    },
    /**
     * 初始化表格
     */
    initTableData() {
      this.tableLoading = true;
      var params = new URLSearchParams();
      params.append("pageIndex", this.pagination.pageNum);
      params.append("type", sessionStorage.getItem("type"));
      params.append("pageSize", this.pagination.pageSize);
      params.append("topicName", this.search.topicName);
      params.append("topicStatus", this.search.topicStatus);
      params.append("createTimeLiftFlag", this.search.createTimeLiftFlag);
      params.append("updateTimeLiftFlag", this.search.updateTimeLiftFlag);
      let id = sessionStorage.getItem("userId");
      params.append("createUser", id ? id : "");
      queryTopic(params).then((res) => {
        this.tableLoading = false;
        this.tableData = res.object.result;
        this.pagination.total = res.object.total;
      });
    },
    // 表格里的按钮函数集
    operateRow(func, row) {
      if (func == "enterMeeting") {
        //进入会议
        this.handleEnter(row);
      } else if (func == "topicDetail") {
        //查看
        this.$refs.drawer.titleName = "议题详情";
        this.$refs.drawer.checkType = 1;
        this.$refs.drawer.handleDetail(row);
        sessionStorage.setItem("topicType", row.topicType);
        this.$store.commit("user/SET_TOPIC_TYPE", row.topicType);
      } else if (func == "formPlan") {
        //会议通知
        if (row.scheme != null) {
          let params = new URLSearchParams();
          params.append("topicId", row.id);
          queryTopicById(params).then((res) => {
            console.log(res.object.object, "object");
            if (res.object.object.topicStatus != 2) {
              this.$message({
                message: "编辑时间已过，不可修改",
                type: "warning",
              });
              this.queryData();
            } else {
              this.$refs.drawer.infoDiglogOpen = true;
              this.$refs.drawer.checkType = 2;
              this.$refs.drawer.formPlan(row);
              sessionStorage.setItem("topicType", row.topicType);
              this.$store.commit("user/SET_TOPIC_TYPE", row.topicType);
            }
          });
        } else {
          this.$refs.drawer.infoDiglogOpen = true;
          this.$refs.drawer.checkType = 2;
          this.$refs.drawer.formPlan(row);
          sessionStorage.setItem("topicType", row.topicType);
          this.$store.commit("user/SET_TOPIC_TYPE", row.topicType);
        }
      } else if (func == "poll") {
        //发起投票
        this.$refs.drawer.titleName = "发起投票";
        this.$refs.drawer.infoDiglogOpen = true;
        this.$refs.drawer.checkType = 3;
        this.$refs.drawer.poll(row);
        sessionStorage.setItem("topicType", row.topicType);
        this.$store.commit("user/SET_TOPIC_TYPE", row.topicType);
      } else if (func == "endTopic") {
        //结束议题
        this.endTopic(row);
      } else if (func == "pollCollect") {
        //投票汇总
        this.$refs.drawer.titleName = "投票汇总";
        this.$refs.drawer.infoDiglogOpen = true;
        this.$refs.drawer.checkType = 4;
        this.$refs.drawer.pollCollect(row);
        sessionStorage.setItem("topicType", row.topicType);
        this.$store.commit("user/SET_TOPIC_TYPE", row.topicType);
      } else if (func == "formSummary") {
        //会议纪要
        this.$refs.drawer.titleName = "会议纪要";
        this.$refs.drawer.checkType = 5;
        this.$refs.drawer.formSummary(row);
        sessionStorage.setItem("topicType", row.topicType);
        this.$store.commit("user/SET_TOPIC_TYPE", row.topicType);
      } else if (func == "enterViedo") {
        //录像下载
        this.handleEnterViedo(row);
      } else if (func == "endMeetingFn") {
        //结束会议(改变状态)
        this.endMeetingFn(row);
      } else if (func == "changePeople") {
        this.$refs.drawer.titleName = "修改参会确认结果";
        this.$refs.drawer.checkType = 6;
        this.$refs.drawer.infoDiglogOpen = true;
        this.$refs.drawer.changePeople(row);
      }
    },
    // 结束会议
    endMeetingFn(row) {
      let params = new URLSearchParams();
      params.append("topicId", row.id);
      endMeeting(params).then((res) => {
        this.initTableData();
      });
    },
    // 视频入会
    handleEnter(row) {
      let params = new URLSearchParams();
      params.append("topicId", row.id);
      // 暂时需要手机号
      params.append("mobile", sessionStorage.getItem("mobile"));
      getUserMeetingUrl(params).then((res) => {
        console.log(res);
        if (res.result == 0) {
          window.location =
            res.object +
            `&leaveMeetingRedirect=${encodeURIComponent(window.location.href)}`;
        }
      });
    },
    // 进入录像
    handleEnterViedo(row) {
      let params = new URLSearchParams();
      params.append("topicId", row.id);
      getMeetingVideoUrl(params).then((res) => {
        console.log(res);
        if (res.result == 0) {
          window.location =
            res.object +
            `&leaveMeetingRedirect=${encodeURIComponent(window.location.href)}`;
        }
        // location.href(res.object)
      });
    },
    //排序
    sortChange(row) {
      let temp;
      if (row.order == "ascending") {
        temp = 0;
      } else if (row.order == "descending") {
        temp = 1;
      } else {
        temp = null;
      }
      if (temp == null) {
        this.$set(this.search, "createTimeLiftFlag", "");
        this.$set(this.search, "updateTimeLiftFlag", "");
      } else {
        if (row.prop == "createTime") {
          this.$set(this.search, "createTimeLiftFlag", temp);
          this.$set(this.search, "updateTimeLiftFlag", "");
        } else if (row.prop == "updateTime") {
          this.$set(this.search, "createTimeLiftFlag", "");
          this.$set(this.search, "updateTimeLiftFlag", temp);
        }
      }
      this.initTableData();
    },
    reset() {
      this.search = {
        status: "",
        topicName: "",
        topicStatus: "",
      };
      this.pagination.pageNum = 1;
      this.initTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
::v-deep {
  .el-table thead tr th {
    background: #fff;
    border-bottom: 1px solid #e5e7ed;
  }
}
</style>
