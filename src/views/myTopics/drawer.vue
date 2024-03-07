<template>
  <el-drawer
    :append-to-body="true"
    :visible.sync="infoDiglogOpen"
    :with-header="false"
    :wrapperClosable="false"
    size="60%"
  >
    <!-- 关闭按钮 -->
    <div class="close-icon" @click="infoDiglogOpen = false">
      <i class="el-icon-close"></i>
    </div>
    <div class="btn-box" v-show="checkType != 1">
      <el-button @click="infoDiglogOpen = false">返回</el-button>
      <el-button type="primary" v-show="checkType != 6" @click="submitConfim"
        >提交</el-button
      >
    </div>
    <!-- 头部信息 -->
    <div class="header-box">
      <div class="tit">{{ titleName }}</div>
      <span></span>
    </div>
    <!-- 弹窗确认 -->
    <confimBox
      :programmeType="programmeType"
      :checkType="checkType"
      :voteState="voteState"
      :confimFlag="confimFlag"
      @cancel="confimFlag = false"
      @submit="submit"
    />
    <!-- 主题内容 -->
    <div class="formMain">
      <!-- 查看 -->
      <div v-if="checkType == 1">
        <info
          ref="infoRef"
          :all="true"
          :lookProgrammeFrom="programmeFormObj"
          :voteInfo="voteInfo"
          :voteData="voteData"
          :activeTopicName="activeTopicName"
          :checkForm="checkForm"
          :topicFile="topicFile"
          :publishFile="publishFile"
          :attendPagination="attendPagination"
          :checkObj="checkObj"
          :adviceFile="adviceFile"
          :attendData="attendData"
          :fileList="fileList"
          :voteObj="voteObj"
          :summaryLoading="summaryLoading"
          :voteDownFlag="voteDownFlag"
          :summaryObj="summaryObj"
          :confirmObj="confirmObj"
          :activeTopicId="activeTopicId"
          @changeAttendData="changeAttendData"
          @downloadSummaryFn="downloadSummaryFn"
          :voteTableCols="voteTableCols"
        />
      </div>
      <!-- 会议通知 -->
      <div v-if="checkType == 2">
        <info
          ref="notAllinfo"
          :lookProgrammeFrom="programmeFormObj"
          :showProgramme="false"
          :voteData="voteData"
          :activeTopicName="activeTopicName"
          :checkForm="checkForm"
          :topicFile="topicFile"
          :publishFile="publishFile"
          :attendPagination="attendPagination"
          :checkObj="checkObj"
          :adviceFile="adviceFile"
          :attendData="attendData"
          :fileList="fileList"
          :voteObj="voteObj"
          :voteDownFlag="voteDownFlag"
          :confirmObj="confirmObj"
          :activeTopicId="activeTopicId"
          @changeAttendData="changeAttendData"
          :voteTableCols="voteTableCols"
        />
        <div class="item-tit">
          {{ titleName }}
          <arrowIcon :down="true" />
          <div class="line"></div>
        </div>
        <programmeForm
          :form="programmeFormObj"
          :programmeFileList="programmeFileList"
          :schemeEd="schemeEd"
          ref="programme"
          @changeCheck="checkFlag = true"
          @changeFileList="
            (val) => {
              programmeFileList = val;
            }
          "
          @pushRemove="
            (val) => {
              this.deleteFiles.push(val);
            }
          "
        />
      </div>
      <!-- 发起投票 -->
      <div v-if="checkType == 3">
        <info
          ref="notAllinfo"
          :lookProgrammeFrom="programmeFormObj"
          :voteData="voteData"
          :activeTopicName="activeTopicName"
          :checkForm="checkForm"
          :topicFile="topicFile"
          :publishFile="publishFile"
          :attendPagination="attendPagination"
          :checkObj="checkObj"
          :adviceFile="adviceFile"
          :attendData="attendData"
          :fileList="fileList"
          :voteObj="voteObj"
          :voteDownFlag="voteDownFlag"
          :confirmObj="confirmObj"
          :activeTopicId="activeTopicId"
          @changeAttendData="changeAttendData"
          :voteTableCols="voteTableCols"
        />
        <div class="item-tit">
          {{ titleName }}
          <arrowIcon :down="true" />
          <div class="line"></div>
        </div>
        <programmeForm
          :form="voteFormObj"
          :pollType="true"
          ref="voteRef"
          @changeCheck="checkFlag = true"
        />
      </div>
      <!-- 投票汇总 -->
      <div v-if="checkType == 4">
        <info
          ref="notAllinfo"
          :lookProgrammeFrom="programmeFormObj"
          :showProgramme="false"
          :voteData="voteData"
          :activeTopicName="activeTopicName"
          :checkForm="checkForm"
          :topicFile="topicFile"
          :publishFile="publishFile"
          :attendPagination="attendPagination"
          :checkObj="checkObj"
          :adviceFile="adviceFile"
          :attendData="attendData"
          :fileList="fileList"
          :voteObj="voteObj"
          :voteDownFlag="voteDownFlag"
          :summaryObj="summaryObj"
          :confirmObj="confirmObj"
          :activeTopicId="activeTopicId"
          @changeAttendData="changeAttendData"
          :voteTableCols="voteTableCols"
        />
        <div class="item-tit">
          {{ titleName }}
          <arrowIcon :down="true" />
          <div class="line"></div>
        </div>
        <div class="voteCollect collect-box">
          <el-form style="width: 100%">
            <el-form-item label="议事主题" :rules="[{ required: true }]">
              <span style="color: #333">{{ activeTopicName }}</span>
            </el-form-item>
          </el-form>
          <peopleTable
            :tableType="4"
            :noPage="true"
            :tableData="voteData"
            :voteObj="voteObj"
          />
          <formUpload
            :fileList="fileList"
            :voteDownFlag="voteDownFlag"
            style="margin-top: 10px"
            @pushRemove="
              (val) => {
                this.deleteFiles.push(val);
              }
            "
            @changeFileList="
              (val) => {
                fileList = val;
              }
            "
            :loading="voteLoading"
            :buttonName="'线下投票证明下载'"
            @downAll="downLoadAllFilesFn"
            :upType="3"
          />
        </div>
      </div>
      <!-- 会议纪要 -->
      <div v-if="checkType == 5">
        <el-form style="width: 35vw">
          <el-form-item label="议事主题" :rules="[{ required: true }]">
            <span>关于{{ activeTopicName }}</span>
          </el-form-item>
        </el-form>
        <div class="collapse-box" v-if="voteObj">
          <div class="item-tit" @click="changeShow(6)">
            投票信息
            <arrowIcon :num="6" :activeNames="activeNames" />
            <div class="line"></div>
          </div>
          <div
            class="voteCollect collect-box"
            v-show="activeNames.indexOf(6) > -1"
          >
            <peopleTable
              :tableType="4"
              :noPage="true"
              :tableData="voteData"
              :voteObj="voteObj"
            />
            <formUpload
              :fileList="fileList"
              :voteDownFlag="voteDownFlag"
              style="margin-top: 10px"
              @pushRemove="
                (val) => {
                  this.deleteFiles.push(val);
                }
              "
              @changeFileList="
                (val) => {
                  fileList = val;
                }
              "
              :loading="voteLoading"
              :buttonName="'线下投票证明下载'"
              @downAll="downLoadAllFilesFn"
              :upType="3"
            />
            <!-- <custom-table
              class="my-table check-table"
              :isPagination="false"
              :tableData="voteData"
              :tableCols="voteTableCols"
            />
            <formUpload
              style="margin-top: 10px"
              :upType="3"
              :loading="voteLoading"
              :buttonName="'线下投票证明下载'"
              @downAll="downLoadAllFilesFn"
              :fileList="fileList"
              :voteDownFlag="voteDownFlag"
              @pushRemove="
                (val) => {
                  this.deleteFiles.push(val);
                }
              "
              @changeFileList="
                (val) => {
                  fileList = val;
                }
              "
            /> -->
          </div>
        </div>
        <div class="collapse-box">
          <div class="item-tit" @click="changeShow(5)">
            会议纪要
            <arrowIcon :num="5" :activeNames="activeNames" />
            <div class="line"></div>
          </div>
          <div class="item summaryItem" v-show="activeNames.indexOf(5) > -1">
            <div style="margin: -20px 0 5px 0; text-align: right">
              <el-button
                type="primary"
                @click="downloadSummaryFn"
                :loading="summaryLoading"
                >会议纪要下载</el-button
              >
            </div>
            <summaryUEditor
              :topicId="activeTopicId"
              :summaryObj="summaryObj"
              ref="meetingSummary"
              v-if="checkType == 5 && summaryObj"
            />
          </div>
        </div>
      </div>
      <!-- 修改参会确认结果 -->
      <div v-if="checkType == 6">
        <!-- <el-form style="width: 35vw">
          <el-form-item label="议事主题" :rules="[{ required: true }]">
            <span>{{ activeTopicName }}</span>
          </el-form-item>
        </el-form> -->
        <el-form style="width: 100%" :inline="true">
          <div class="search-container">
            <div>
              <el-form-item class="topics-name-container">
                姓名
                <el-input
                  label="姓名"
                  placeholder="请输入姓名"
                  v-model.trim="confirmSearch.userName"
                  @keydown.enter.native="searchCofirmPeople"
                  style="width: 12rem"
                ></el-input>
              </el-form-item>
              <el-form-item>
                确认状态
                <el-select
                  v-model="confirmSearch.confirmStatus"
                  style="width: 12rem"
                >
                  <el-option label="请选择" value="">请选择</el-option>
                  <el-option label="未确认" value="0">未确认</el-option>
                  <el-option label="已确认" value="1">已确认</el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="search-buttons">
                <el-form-item style="text-align: right; width: 100%">
                  <el-button @click="confirmReset">重置</el-button>
                  <el-button style="color: #3590ff; border-color: #3590ff"  @click="searchCofirmPeople"
                    >查询</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <custom-table
          class="my-table change-people-table"
          :pagerCount="5"
          :isIndex="true"
          :isPagination="true"
          :tableData="confirmData"
          :tableCols="confirmCols"
          :pagination="confirmPagination"
          @operateRow="operateRow"
          @reloadTable="changeConfirmData"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
const option = {
  lock: true,
  text: "Loading",
  spinner: "el-icon-loading",
  background: "rgba(0, 0, 0, 0.5)",
};
import {
  queryAdviceByTopicId,
  queryConfirmPage,
  getVcfMeetingUrl,
  queryConfirmsByMeeting,
  confrimMeeting,
} from "@/api/myTopics";
import {
  createScheme,
  queryScheme,
  updateScheme,
  initiateVote,
  queryVoteInfo,
} from "@/api/programme/index";
import { downLoadAllFiles } from "@/api/vote/index";
import { queryVoteStatistics, saveSummary } from "@/api/vote/index";
import {
  querySummary,
  summaryManageSave,
  downloadSummary,
} from "@/api/summary/index";
import CustomTable from "../../components/Table/CustomTable";
import formComponent from "@/views/components/formComponent/index.vue";
import programmeForm from "@/views/components/programmeForm/index.vue";
import peopleTable from "@/views/components/peopleTable.vue";
import formUpload from "@/views/components/formUpload.vue";
import summaryUEditor from "@/views/components/summaryUEditor.vue";
import arrowIcon from "./arrowIcon.vue";
import confimBox from "./confimBox.vue";
import { Loading } from "element-ui";
import info from "./info.vue";
export default {
  name: "drawer",
  components: {
    CustomTable,
    formComponent,
    peopleTable,
    formUpload,
    summaryUEditor,
    programmeForm,
    arrowIcon,
    confimBox,
    info,
  },
  data() {
    return {
      confimFlag: false,
      checkFlag: false,
      schemeEd: false,
      voteLoading: false,
      summaryLoading: false,
      programmeType: "",
      voteState: "",
      activeNames: [1],
      checkType: 1,
      saveTimeType: 0,
      titleName: "",
      activeTopicId: "",
      activeTopicName: "",
      activeIndex: "1",
      meetingId: "",
      voteId: "",
      activeTopStatus: null,
      activeScheme: null,
      showList: "",
      checkObj: null,
      confirmObj: null,
      summaryObj: null,
      voteInfo: null,
      checkForm: {
        seakObject: "东方红村",
        topicName: "",
        isSeak: "1",
        askTargetOrg: [],
        callAttention: "48",
        tagArry: [],
        note: "",
        scheme: "",
      },
      topicFile: [],
      publishFile: [],
      adviceFile: null,
      attendData: [],
      confirmData: [],
      voteTableCols: [
        {
          label: "投票项",
          prop: "optionDescribe",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "线上票数",
          prop: "onlineVotes",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "线下票数",
          prop: "offlineVotes",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "总票数",
          prop: "totalVotes",
          headerAlign: "center",
          align: "center",
        },
      ],
      selectList: [
        { label: "线上参会", value: 1 },
        { label: "线下参会", value: 2 },
        { label: "不参会", value: 0 },
      ],
      confirmCols: [
        {
          label: "姓名",
          prop: "userName",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "参会确认结果",
          prop: "attendConfirm",
          headerAlign: "center",
          align: "center",
          type: "Select",
          options: [
            { label: "线上参会", value: "0" },
            { label: "线下参会", value: "1" },
            { label: "不参会", value: "2" },
            { label: "未确认", value: "3" },
          ],
          special: true,
          change: (row) => this.changeSelect(row),
          optionsProp: { label: "label", value: "value" },
        },
        {
          label: "备注",
          type: "Input",
          prop: "reason",
          headerAlign: "center",
          align: "center",
          maxLength:100,
          isDisabled: (row) => {
            return row.attendConfirm != 2;
          },
          change: (row) => this.changeSelect(row),
        },
        {
          label: "操作",
          headerAlign: "center",
          align: "center",
          type: "Text",
          getBtnList: (row) => {
            let btnList = [];
            btnList.push({
              type: "primary",
              func: "confirmSubmit",
              label: "提交",
              isDisabled: (row) => {
                return !row.flag;
              },
            });
            return btnList;
          },
        },
      ],
      programmeFormObj: {
        statisticalReqDTOList: [
          { optionDescribe: "同意" },
          { optionDescribe: "不同意" },
          { optionDescribe: "弃权" },
        ],
        isSeak: "",
        voteTime: [],
        meetingType: "",
        status: "",
        topicName: "",
        scheme: "0",
        voteWay: "0",
        remindSetting: "48",
        attendObject: "",
        voteObject: "",
        noteDetail: "",
        voteContent:"",
      },
      voteFormObj: {
        statisticalReqDTOList: [
          { optionDescribe: "同意" },
          { optionDescribe: "不同意" },
          { optionDescribe: "弃权" },
        ],
        voteObject: "",
        voteTime: [],
        status: "",
        topicName: "",
        scheme: "1",
        voteWay: "0",
      },
      voteObj: null,
      voteData: [],
      voteDownFlag: true,
      fileList: [],
      programmeFileList: [],
      deleteFiles: [],
      peoplePagination: {
        pageSize: 5,
        pageNum: 1,
        total: 123,
      },
      confirmPagination: {
        pageSize: 20,
        pageNum: 1,
        total: 123,
        layout: "total, sizes, prev, pager, next",
      },
      attendPagination: {
        pageSize: 5,
        pageNum: 1,
        total: 123,
        layout: "total, sizes, prev, pager, next",
      },
      tableLoading: false,
      infoDiglogOpen: false,
      confirmSearch: {
        userName: "",
        confirmStatus: "",
      },
    };
  },
  watch: {
    infoDiglogOpen: {
      handler(val) {
        if (!val) {
          this.resetInfo();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    changeShow(item) {
      let index = this.activeNames.indexOf(item);
      index > -1
        ? this.activeNames.splice(index, 1)
        : this.activeNames.push(item);
    },
    // 参会人员翻页
    changeAttendData() {
      console.log(this.attendPagination);
      var params = new URLSearchParams();
      params.append("pageIndex", this.attendPagination.pageNum);
      params.append("pageSize", this.attendPagination.pageSize);
      params.append("topicId", this.activeTopicId);
      queryConfirmPage(params).then((res) => {
        this.attendData = res.object.result;
        this.attendPagination.total = res.object.total;
      });
    },
    // 获取数据设置对象
    setArry(obj) {
      let temp1 = [],
        temp2 = [];
      if (obj.orgList) {
        temp1 = obj.orgList.map((item) => {
          item.showName = item.name;
          item.isOrg = true;
          return item;
        });
      }
      if (obj.personList) {
        temp2 = obj.personList.map((item) => {
          item.showName = item.username;
          item.isPeople = true;
          return item;
        });
      }
      console.log(temp1, temp2);
      return [...temp1, ...temp2];
    },
    // 获取数据设置标签数组的
    setTagArry(str) {
      if (str) {
        let temp = str.split(",").map((item) => {
          item = Number(item);
          return item;
        });
        return temp;
      } else {
        return [];
      }
    },
    /**
     * 议事详情
     */
    handleDetail(row) {
      this.activeTopicId = row.id;
      this.getInfo(this.activeTopicId, row).then((detailInfo) => {
        if (this.titleName == "议题详情" && this.showList == "") {
          this.$refs.infoRef.activeNames = [1, 2, 3, 4, 5];
        } else if (this.titleName == "议题详情" && this.showList != "") {
          this.$refs.infoRef.activeNamesFn(this.showList);
        } else {
          this.$refs.notAllinfo.activeNames = [];
        }
        console.log("detailInfo===", detailInfo);
        let checkAdviceByTopicId = detailInfo[0].object.topic;
        this.checkForm = { ...checkAdviceByTopicId };
        this.checkForm.checkedObjectList = this.setArry(this.checkForm);
        this.checkForm.tagList = this.setTagArry(this.checkForm.seakTags);
        this.checkObj = detailInfo[0].object;
        this.activeTopicName = detailInfo[0].object.topic.topicName;
        if (detailInfo[0].object.adviceFile) {
          this.adviceFile = detailInfo[0].object.adviceFile.map((item) => {
            item.name = this.activeTopicName + "的意见汇总表.xlsx";
            return item;
          });
        }
        if (detailInfo[0].object.fileList.length > 0) {
          this.publishFile = detailInfo[0].object.fileList.map((item) => {
            item.name = item.fileName;
            return item;
          });
        }
        if (detailInfo[0].object.topicFile) {
          this.topicFile = detailInfo[0].object.topicFile.map((item) => {
            item.name = item.fileName;
            return item;
          });
        }
        // 征集人员数组
        let checkConfirmPage = detailInfo[1].object;
        this.confirmObj = checkConfirmPage;
        if (checkConfirmPage) {
          this.attendData = checkConfirmPage.result;
        }
        this.attendPagination.total = checkConfirmPage.total;
        let checkVoteStatistics = detailInfo[2].object;
        if (checkVoteStatistics) {
          this.voteObj = checkVoteStatistics;
          if (checkVoteStatistics.statisticalList) {
            this.voteData = checkVoteStatistics.statisticalList;
          }
          this.fileList = checkVoteStatistics.fileList.map((item) => {
            item.name = item.fileName;
            return item;
          });
          this.voteDownFlag = this.setNoneDown(this.fileList);
        }
        if (row.topicStatus > 4) {
          this.summaryObj = this.setText(detailInfo[3].object);
        }
        // 视频会议链接
        if (detailInfo[4].object) {
          this.programmeFormObj.meetingLink = detailInfo[4].object;
        }
        if (detailInfo[5] && detailInfo[5].object) {
          this.voteInfo = detailInfo[5].object;
          this.voteInfo.checkedObjectList = this.setArry(detailInfo[5].object);
          console.log(this.voteInfo.checkedObjectList);
        }
        if (detailInfo[6] && detailInfo[6].object) {
          let obj = detailInfo[6].object;
          this.setQueryScheme(row, obj, false);
        }
      });
    },
    // 获取查看事详情的信息
    async getInfo(id, row) {
      console.log(row, "row---------");
      let params = new URLSearchParams();
      params.append("topicId", id);
      let params2 = new URLSearchParams();
      params2.append("topicId", id);
      params2.append("pageSize", 5);
      params2.append("pageNum", 1);
      let arr = [
        queryAdviceByTopicId(params),
        queryConfirmPage(params2),
        queryVoteStatistics(params),
        this.judgeSend(row, id),
        getVcfMeetingUrl(params),
        queryVoteInfo(params),
      ];
      if (row.scheme != null) {
        arr.push(queryScheme(params));
      }
      return Promise.all(arr).then((res) => {
        this.infoDiglogOpen = true;
        return res;
      });
    },
    // 判断是否需要请求
    judgeSend(row, id) {
      if (row.topicStatus == 5 || row.topicStatus == 6) {
        let params = new URLSearchParams();
        params.append("topicId", id);
        return querySummary(params);
      } else {
        return false;
      }
    },
    // 提交--表单验证
    submitConfim() {
      if (this.checkType == 2) {
        this.$refs.programme.formCheck();
        this.programmeType = this.programmeFormObj.scheme;
        this.confimFlag = this.checkFlag;
      }
      if (this.checkType == 3) {
        this.$refs.voteRef.formCheck();
        this.confimFlag = this.checkFlag;
      }
      if (this.checkType == 4) {
        this.confimFlag = true;
      }
      if (this.checkType == 5) {
        this.confimFlag = true;
      }
    },
    // 成功后打开详情
    succseTip(str) {
      this.$message({
        message: str,
        type: "success",
      });
      this.confimFlag = false;
      // this.infoDiglogOpen = false;
      this.titleName = "议题详情";
      this.handleDetail({
        id: this.activeTopicId,
        topicStatus: this.activeTopStatus,
      });
      this.checkType = 1;
      this.$emit("initTableData");
    },
    // 成功后打开详情会议通知的
    succseTipScheme(str, scheme) {
      this.$message({
        message: str,
        type: "success",
      });
      this.confimFlag = false;
      // this.infoDiglogOpen = false;
      this.titleName = "议题详情";
      this.handleDetail({
        id: this.activeTopicId,
        topicStatus: this.activeTopStatus,
        scheme: scheme,
      });
      this.checkType = 1;
      this.$emit("initTableData");
    },
    // 重置信息
    resetInfo() {
      this.programmeType = "";
      this.voteState = "";
      this.voteDownFlag = true;
      this.confimFlag = false;
      this.summaryObj = null;
      this.adviceFile = null;
      this.publishFile = [];
      this.topicFile = [];
      this.activeTopStatus = null;
      this.activeScheme = null;
      this.showList = "";
      this.activeNames = [5, 6];
      this.programmeFormObj = {
        statisticalReqDTOList: [
          { optionDescribe: "同意" },
          { optionDescribe: "不同意" },
          { optionDescribe: "弃权" },
        ],
        isSeak: "",
        voteTime: [],
        meetingType: "",
        status: "",
        topicName: "",
        scheme: "0",
        voteWay: "0",
        remindSetting: "48",
        attendObject: "",
        voteObject: "",
        noteDetail: "",
        voteContent:""
      };
      this.programmeFileList = [];
      this.deleteFiles = [];
      this.voteObj = null;
      this.voteInfo = null;
      if (this.checkType == 2) {
        this.$refs.programme.$refs.formRef.clearValidate();
      }
      if (this.checkType == 3) {
        this.voteFormObj = {
          statisticalReqDTOList: [
            { optionDescribe: "同意" },
            { optionDescribe: "不同意" },
            { optionDescribe: "弃权" },
          ],
          voteObject: "",
          voteTime: [],
          status: "",
          topicName: "",
          scheme: "1",
          voteWay: "0",
        };
      }
      if (this.checkFlag == 4) {
        this.deleteFiles = [];
      }
    },
    // 线下投票下载
    downLoadAllFilesFn() {
      this.voteLoading = true;
      let params = new URLSearchParams();
      params.append("topicId", this.activeTopicId);
      downLoadAllFiles(params).then((res) => {
        let blob = new Blob([res], {
          type: "application/zip",
        });
        this.voteLoading = false;
        this.downFn(blob, "线下投票材料");
      });
    },
    // 会议纪要下载
    downloadSummaryFn() {
      this.summaryLoading = true;
      let params = new URLSearchParams();
      params.append("topicId", this.activeTopicId);
      downloadSummary(params).then((res) => {
        this.summaryLoading = false;
        if ("download" in document.createElement("a")) {
          let url = window.URL.createObjectURL(res);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            this.activeTopicName + "会议纪要" + ".docx"
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },
    downFn(blob, downloadName) {
      const tmpLink = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      tmpLink.href = objectUrl;
      tmpLink.download = downloadName;
      tmpLink.click();
    },
    // 提交按钮
    submit(isPublish) {
      if (this.checkFlag && this.checkType == 2) {
        //  会议通知的
        this.confimFlag = true;
        let params = new FormData();
        let tempObj = this.programmeFormObj;
        let id = this.activeTopicId;
        let tagList = this.$refs.programme.tagList;
        let personList = this.$refs.programme.personList;
        let orgList = this.$refs.programme.orgList;
        let fgmMeetingReqDTO = {
          topicId: id,
          meetingTheme: tempObj.topicName,
          meetingType: tempObj.meetingType,
          startTime: this.$moment(tempObj.startTime).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          meetingAddr: tempObj.meetingAddr,
          remindSetting: tempObj.remindSetting,
          // attendObject: tempObj.attendObject,
          noteDetail: tempObj.noteDetail,
          tagList: tagList,
          personList: personList,
          orgList: orgList,
        };
        let fgmTopicVoteReqDTO = {
          topicId: id,
          voteTheme: tempObj.topicName,
          meetingType: tempObj.meetingType,
          beginTime: this.$moment(tempObj.voteTime[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          endTime: this.$moment(tempObj.voteTime[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          remindSetting: tempObj.remindSetting,
          voteWay: tempObj.voteWay,
          // voteObject: tempObj.voteObject,
          statisticalReqDTOList: tempObj.statisticalReqDTOList,
          tagList: tagList,
          personList: personList,
          orgList: orgList,
          voteContent:tempObj.voteContent
        };
        let scheme = {
          schemeType: tempObj.scheme,
          topicId: id,
        };
        if (tempObj.scheme == 0) {
          scheme.fgmMeetingReqDTO = fgmMeetingReqDTO;
        } else {
          scheme.fgmTopicVoteReqDTO = fgmTopicVoteReqDTO;
        }

        if (this.programmeFileList.length > 0) {
          console.log(this.programmeFileList);
          if (!this.upFileSize(this.programmeFileList)) {
            this.$message({
              message: "上传文件大小总和不得超过100M",
              type: "warning",
            });
            return;
          }
          this.programmeFileList.forEach((item) => {
            if (item.raw) {
              params.append("files", item.raw);
            }
          });
        }
        if (this.titleName == "会议通知") {
          params.append("scheme", JSON.stringify(scheme));
          let loadingInstance = Loading.service(option);
          createScheme(params)
            .then((res) => {
              if (res.success) {
                loadingInstance.close();
                this.succseTipScheme("提交成功", tempObj.scheme);
              } else {
                loadingInstance.close();
                this.confimFlag = false;
              }
            })
            .catch(() => {
              loadingInstance.close();
            });
        } else {
          // 修改赋予id
          if (tempObj.scheme == 0) {
            scheme.fgmMeetingReqDTO.id = this.meetingId;
            params.append("deleteFiles", JSON.stringify(this.deleteFiles));
          } else {
            scheme.fgmTopicVoteReqDTO.id = this.voteId;
          }
          params.append("scheme", JSON.stringify(scheme));
          let loadingInstance = Loading.service(option);
          updateScheme(params)
            .then((res) => {
              loadingInstance.close();
              if (res.success) {
                this.succseTipScheme("修改成功", tempObj.scheme);
              } else {
                this.confimFlag = false;
              }
            })
            .catch(() => {
              loadingInstance.close();
            });
        }
        // 提交后显示
        this.showList = tempObj.scheme == 0 ? 3 : 4;
      } else if (this.checkFlag && this.checkType == 3) {
        //发起投票
        let params = new URLSearchParams();
        let tempObj = this.voteFormObj;
        let tagList = this.$refs.voteRef.tagList;
        let personList = this.$refs.voteRef.personList;
        let orgList = this.$refs.voteRef.orgList;
        let fgmTopicVoteReqDTO = {
          topicId: this.activeTopicId,
          voteTheme: tempObj.topicName,
          voteWay: tempObj.voteWay,
          statisticalReqDTOList: tempObj.statisticalReqDTOList,
          tagList: tagList,
          personList: personList,
          orgList: orgList,
          voteContent:tempObj.voteContent
        };
        params.append("topicVote", JSON.stringify(fgmTopicVoteReqDTO));
        initiateVote(params).then((res) => {
          if (res.success) {
            this.succseTip("发起成功");
          } else {
            this.confimFlag = false;
          }
        });
        this.showList = 4;
      } else if (this.checkType == 4) {
        // 投票汇总提交/发布
        let params = new FormData();
        let statisticalReqDTOList = this.voteData;
        let summary = {
          topicId: this.activeTopicId,
          statisticalReqDTOList: statisticalReqDTOList,
        };
        params.append("isPublish", isPublish);
        if (this.fileList.length > 0) {
          if (!this.upFileSize(this.fileList)) {
            this.$message({
              message: "上传文件大小总和不得超过100M",
              type: "warning",
            });
            return;
          }
          this.fileList.forEach((item) => {
            if (item.raw) {
              params.append("files", item.raw);
            }
          });
        }
        params.append("deleteFiles", JSON.stringify(this.deleteFiles));
        params.append("summary", JSON.stringify(summary));
        let loadingInstance = Loading.service(option);
        saveSummary(params)
          .then((res) => {
            console.log(res);
            loadingInstance.close();
            if (res.success) {
              if (isPublish) {
                this.succseTip("提交发布成功");
              } else {
                this.succseTip("提交成功");
              }
            } else {
              this.confimFlag = false;
            }
          })
          .catch(() => {
            loadingInstance.close();
          });
        this.showList = 4;
      } else if (this.checkType == 5) {
        // 会议纪要提交/发布
        let params = new FormData();
        let statisticalReqDTOList = this.voteData;
        let summary = {
          topicId: this.activeTopicId,
          statisticalReqDTOList: statisticalReqDTOList,
        };
        let contentInfo = {
          topicId: this.activeTopicId,
          content: this.$refs.meetingSummary.$refs.ueditor
            .getUEContent()
            .replace(/<p><\/p>/g, ""),
        };
        params.append("isPublish", isPublish);
        if (this.fileList.length > 0) {
          if (!this.upFileSize(this.fileList)) {
            this.$message({
              message: "上传文件大小总和不得超过100M",
              type: "warning",
            });
            return;
          }
          this.fileList.forEach((item) => {
            if (item.raw) {
              params.append("files", item.raw);
            }
          });
        }
        params.append("deleteFiles", JSON.stringify(this.deleteFiles));
        params.append("contentInfo", JSON.stringify(contentInfo));
        params.append("summary", JSON.stringify(summary));
        let loadingInstance = Loading.service(option);
        summaryManageSave(params)
          .then((res) => {
            console.log(res);
            loadingInstance.close();
            if (res.success) {
              if (isPublish) {
                this.succseTipScheme("提交发布成功", this.activeScheme);
              } else {
                this.succseTipScheme("提交成功", this.activeScheme);
              }
            } else {
              this.confimFlag = false;
            }
          })
          .catch(() => {
            loadingInstance.close();
          });
        this.showList = 5;
      }
    },
    // 判断上传文件大小
    upFileSize(arr) {
      let num = 0;
      arr.map((item) => {
        if (item.size) {
          num += item.size;
        }
      });
      console.log(num, "文件大小");
      if (num / 1024 / 1024 / 100 < 1) {
        return true;
      } else {
        return false;
      }
    },
    // 发起投票
    poll(row) {
      this.voteFormObj.topicName = row.topicName;
      this.activeTopicId = row.id;
      this.$nextTick(() => {
        this.$refs.voteRef.checkedObjectList = [];
        this.$refs.voteRef.tagList = [];
        // this.$refs.voteRef.$refs.join.isAll = false;
        // this.$refs.voteRef.$refs.join.pathOrgs = [this.$store.getters.orgInfo];
      });
      this.handleDetail(row);
    },
    // 投票汇总
    pollCollect(row) {
      this.activeTopicId = row.id;
      this.activeTopicName = row.topicName;
      this.voteState = row.topicStatus;
      this.handleDetail(row);
      let params = new URLSearchParams();
      params.append("topicId", this.activeTopicId);
      queryVoteStatistics(params).then((res) => {
        this.voteObj = res.object;
        if (res.object.statisticalList) {
          this.voteData = res.object.statisticalList;
        }
        this.fileList = res.object.fileList.map((item) => {
          item.name = item.fileName;
          return item;
        });
        this.voteDownFlag = this.setNoneDown(this.fileList);
      });
    },
    // 设置没有投票按钮函数
    setNoneDown(arry) {
      if (arry && arry.length < 1) {
        return false;
      } else {
        return true;
      }
    },
    // 会议纪要的
    formSummary(row) {
      this.activeTopicId = row.id;
      this.activeTopicName = row.topicName;
      this.activeTopStatus = row.topicStatus;
      this.activeScheme = row.scheme;
      this.activeNames = [5, 6];
      this.getFormSummary(this.activeTopicId).then((res) => {
        console.log("formSummary===", res);
        this.voteObj = res[0].object;
        if (res[0].object) {
          this.voteData = res[0].object.statisticalList;
          this.fileList = res[0].object.fileList.map((item) => {
            item.name = item.fileName;
            return item;
          });
          this.voteDownFlag = this.setNoneDown(this.fileList);
        } else {
        }
        if (res[1].object) {
          this.summaryObj = this.setText(res[1].object);
        } else {
          this.summaryObj = null;
        }
      });
    },
    // 参会确认修改的
    changePeople(row) {
      this.activeTopicId = row.id;
      this.activeTopicName = row.topicName;
      this.activeTopStatus = row.topicStatus;
      this.activeScheme = row.scheme;
      this.searchCofirmPeople();
    },
    setText(text) {
      let temp = "";
      if (text.length == 0) return "";
      temp = text.replace(/&amp;/g, "&");
      temp = temp.replace(/nbsp;/g, "&nbsp;");
      temp = temp.replace(/&lt;/g, "<");
      temp = temp.replace(/&gt;/g, ">");
      temp = temp.replace(/&nbsp;/g, " ");
      temp = temp.replace(/&#39;/g, "'");
      temp = temp.replace(/&quot;/g, '"');
      return temp;
    },
    async getFormSummary(id) {
      let params = new URLSearchParams();
      params.append("topicId", id);
      return Promise.all([
        queryVoteStatistics(params),
        querySummary(params),
      ]).then((res) => {
        this.infoDiglogOpen = true;
        return res;
      });
    },
    // 查询会议的
    setQueryScheme(row, result, set = true) {
      if (result.fileList && result.fileList.length > 0) {
        this.programmeFileList = result.fileList.map((item) => {
          item.name = item.fileName;
          return item;
        });
      }
      console.log(result, "7897897");
      if (row.scheme == "0") {
        let tempTopic = result.fgmMeetingRespDTO;
        if (this.$refs.programme) {
          this.$refs.programme.orgList = this.getIdArr(tempTopic.orgList);
          this.$refs.programme.personList = this.getIdArr(tempTopic.personList);
        }
        this.meetingId = tempTopic.id;
        this.$set(
          this.programmeFormObj,
          "remindSetting",
          tempTopic.remindSetting
        );
        this.$set(
          this.programmeFormObj,
          "attendObject",
          tempTopic.attendObject
        );
        this.$set(
          this.programmeFormObj,
          "checkedObjectList",
          this.setArry(tempTopic)
        );
        this.$set(this.programmeFormObj, "meetingType", tempTopic.meetingType);
        this.$set(this.programmeFormObj, "meetingAddr", tempTopic.meetingAddr);
        this.$set(this.programmeFormObj, "noteDetail", tempTopic.noteDetail);
        this.$set(
          this.programmeFormObj,
          "startTime",
          new Date(tempTopic.startTime)
        );
      } else {
        let tempVote = result.fgmTopicVoteRespDTO;
        if (this.$refs.programme) {
          this.$refs.programme.orgList = this.getIdArr(tempVote.orgList);
          this.$refs.programme.personList = this.getIdArr(tempVote.personList);
        }
        this.voteId = tempVote.id;
        this.$set(
          this.programmeFormObj,
          "scheme",
          result.fgmTopicRespDTO.scheme
        );
        this.$set(
          this.programmeFormObj,
          "remindSetting",
          tempVote.remindSetting
        );
        this.$set(this.programmeFormObj, "voteObject", tempVote.voteObject);
        this.$set(this.programmeFormObj, "voteContent", tempVote.voteContent);
        this.$set(
          this.programmeFormObj,
          "checkedObjectList",
          this.setArry(tempVote)
        );
        this.$set(this.programmeFormObj, "voteWay", tempVote.voteWay);
        this.$set(
          this.programmeFormObj,
          "statisticalReqDTOList",
          tempVote.statisticalRespDTOList
        );
        this.$set(this.programmeFormObj, "voteTime", [
          new Date(tempVote.beginTime),
          new Date(tempVote.endTime),
        ]);
      }
    },
    // 会议通知/修改会议
    formPlan(row) {
      this.activeTopicId = row.id;
      this.programmeFormObj.topicName = row.topicName;
      this.programmeFormObj.isSeak = row.isSeak;
      this.handleDetail(row);
      if (row.scheme != null) {
        this.titleName = "修改会议";
        this.showList = 3;
        this.schemeEd = true;
        let params = new URLSearchParams();
        params.append("topicId", row.id);
        queryScheme(params).then((res) => {
          let result = res.object;
          this.setQueryScheme(row, result);
        });
      } else {
        this.titleName = "会议通知";
        this.schemeEd = false;
        this.$nextTick(() => {
          this.$refs.programme.checkedObjectList = [];
          this.$refs.programme.tagList = [];
          // this.$refs.programme.$refs.join.isAll = false;
          // this.$refs.programme.$refs.join.pathOrgs = [
          //   this.$store.getters.orgInfo,
          // ];
        });
      }
    },
    getIdArr(arr) {
      let temp;
      temp = arr.map((item) => {
        return item.id;
      });
      return temp;
    },
    // 获取参会确认人员列表
    searchCofirmPeople() {
      let params = new FormData();
      params.append("pageIndex", this.confirmPagination.pageNum);
      params.append("pageSize", this.confirmPagination.pageSize);
      params.append("topicId", this.activeTopicId);
      if (this.confirmSearch.confirmStatus != "") {
        params.append("confirmStatus", this.confirmSearch.confirmStatus);
      }
      params.append("userName", this.confirmSearch.userName);
      queryConfirmsByMeeting(params).then((res) => {
        this.confirmData = res.object.result;
        this.confirmPagination.total = res.object.total;
      });
    },
    // 重置参会确认人员请求参数
    confirmReset() {
      this.confirmSearch = {
        userName: "",
        confirmStatus: "",
      };
    },
    operateRow(func, row) {
      if (func == "confirmSubmit") {
        //确认修改提交
        let params = new FormData();
        params.append("meetingId", row.meetingId);
        params.append("attendConfirm", row.attendConfirm);
        params.append("reason", row.reason || "");
        params.append("userId", row.userId);
        confrimMeeting(params).then((res) => {
          this.$set(this.confirmData[row.tableIndex - 1], "flag", false);
        });
      }
    },
    // 确认参会人员修改表格
    changeConfirmData() {
      this.searchCofirmPeople();
    },
    changeSelect(row) {
      this.$set(this.confirmData[row.tableIndex - 1], "flag", true);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-drawer {
    overflow: visible;
  }
  .el-drawer__body {
    position: relative;
    .close-icon {
      position: absolute;
      top: 50%;
      left: -29px;
      color: #1492ff;
      padding-left: 15px;
      width: 58px;
      line-height: 58px;
      height: 58px;
      background: #ffffff;
      border-radius: 50%;
      cursor: pointer;
      ::v-deep {
        .el-icon-close {
          &::before {
            font-size: 1rem;
          }
        }
      }
    }
  }
  // .el-radio__input.is-disabled + span.el-radio__label {
  //   color: #333;
  // }
}
.btn-box {
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  z-index: 11005;
  transform: translate(-50%, 0);
}
.header-box {
  padding: 1.5rem;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  &::before {
    display: inline-block;
    content: "";
    width: 4px;
    height: 26px;
    background: #1492ff;
    border-radius: 0px 4px 4px 0px;
    position: absolute;
    transform: translate(-50%, 0);
    left: 0;
  }
  .tit {
    font-size: 1.25rem;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium;
    font-weight: 500;
    color: #333333;
  }
  ::v-deep {
    .el-button {
      &:first-child {
        &:focus {
          color: #606266;
          background: #fff;
          border-color: #dcdfe6;
        }
      }
    }
  }
}
.formMain {
  ::v-deep {
    .commonTablePage .el-table tbody td .cell {
      line-height: 16px;
    }
    .commonTablePage .el-table thead tr th .cell {
      line-height: 2.5rem;
    }
    .el-table--border::after {
      display: none;
    }
  }
  max-height: calc(100vh - 1.5rem - 54px);
  overflow-y: auto;
  padding: 0 3rem 40px 3rem;
  .item-tit {
    user-select: none;
    color: #333;
    font-size: 1rem;
    position: relative;
    margin: 20px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 0.5rem;
      height: 0.5rem;
      opacity: 0.48;
      background: #1492ff;
      position: absolute;
      border-radius: 50%;
      left: -1rem;
      // transform: translate(0, 50%);
    }
    .el-icon {
      padding-left: 5px 0;
    }
    .line {
      align-items: center;
      height: 1px;
      background: rgb(203, 226, 251);
      flex-grow: 1;
    }
  }
  .item,
  .collect-box {
    width: 35vw;
    margin: 0 auto;
    ::v-deep.emptyImg {
      zoom: 0.6;
    }
  }
  .summaryItem {
    width: 100%;
  }
  .upload-demo {
    width: 16rem;
  }
  .voteCollect {
    ::v-deep {
      .el-upload-list {
        width: 16rem;
      }
      .cell {
        text-overflow: clip;
      }
    }
    .upload-demo {
      width: 100%;
    }
  }
  &::v-deep .el-form {
    width: 41vw;
    margin: 0 auto;
    .downBtn {
      .el-form-item__content {
        margin: 0 !important;
      }
    }
  }
  .search-container {
    display: flex;
    justify-content: space-between;
  }
}
.check-table {
  ::v-deep {
    .el-table thead tr th {
      background: #fff;
      border-bottom: 1px solid #e5e7ed;
    }
  }
}
</style>
