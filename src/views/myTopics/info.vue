<template>
  <div class="info">
    <div class="collapse-box">
      <div class="item-tit" @click="changeShow(1)">
        基本信息
        <arrowIcon :num="1" :activeNames="activeNames" />
        <div class="line"></div>
      </div>
      <div class="item" v-show="activeNames.indexOf(1) > -1">
        <formComponent
          :see="true"
          ref="checkFormRef"
          :form="checkForm"
          :tagArry="checkForm.tagArry"
          :publishFile="publishFile"
          :loading="publishFileFnLoading"
          @downPublishFile="downPublishFileFn"
        />
      </div>
    </div>
    <div class="collapse-box" v-if="checkForm.isSeak == 1">
      <div class="item-tit" @click="changeShow(2)">
        意见信息
        <arrowIcon :num="2" :activeNames="activeNames" />
        <div class="line"></div>
      </div>
      <div class="item" v-show="activeNames.indexOf(2) > -1">
        <div class="numTip" v-if="checkObj">
          征集对象共计{{ checkObj.adviceUser }}，已完成共计{{
            checkObj.confirmAdvice
          }}， 未完成{{ checkObj.notConfirmAdvice }}人
        </div>
        <el-button
          v-if="adviceFile"
          type="primary"
          style="margin-top: 10px"
          :loading="adviceFileLoading"
          @click="downloadAdviceFn"
          >意见汇总表下载</el-button
        >
        <el-upload
          v-if="adviceFile"
          class="upload-demo"
          action="#"
          :file-list="adviceFile"
          :auto-upload="false"
          disabled
        >
        </el-upload>
      </div>
    </div>
    <div class="collapse-box" v-if="attendData.length > 0 && showProgramme">
      <div class="item-tit" @click="changeShow(3)">
        参会信息
        <arrowIcon :num="3" :activeNames="activeNames" />
        <div class="line"></div>
      </div>
      <div class="item" v-show="activeNames.indexOf(3) > -1">
        <!-- 参会的 -->
        <lookProgramme
          :form="lookProgrammeFrom"
          :topicFile="topicFile"
          :loading="topicFileLoading"
          @downTopic="downloadTopicFileFn"
        />
        <div class="numTip" v-if="confirmObj">
          {{ confirmObj.desc }}
        </div>
        <custom-table
          class="my-table check-table"
          :pagerCount="5"
          :isIndex="true"
          :isPagination="true"
          :tableData="attendData"
          :tableCols="attendCols"
          :pagination="attendPagination"
          @reloadTable="changeAttendData"
        />
      </div>
    </div>
    <div
      class="collapse-box"
      v-if="voteObj && voteObj.total > 0 && summaryShow && showProgramme"
    >
      <div class="item-tit" @click="changeShow(4)">
        投票信息
        <arrowIcon :num="4" :activeNames="activeNames" />
        <div class="line"></div>
      </div>

      <div class="item vote" v-show="activeNames.indexOf(4) > -1">
        <div v-if="lookProgrammeFrom.scheme != '0'">
          <lookProgramme :see="true" :form="lookProgrammeFrom" />
        </div>
        <div v-else>
          <meetingVote v-if="voteInfo" :form="voteInfo" />
        </div>
        <div class="numTip" v-if="voteObj">
          线上参与投票共计{{ voteObj.total }}人，已完成{{
            voteObj.hasVote
          }}人，未完成{{ Number(voteObj.total) - Number(voteObj.hasVote) }}人
        </div>
        <custom-table
          class="my-table check-table"
          :isPagination="false"
          :tableData="voteData"
          :tableCols="voteTableCols"
        />
        <formUpload
          style="margin-top: 10px"
          :buttonName="'线下投票证明下载'"
          :loading="voteLoading"
          @downAll="downLoadAllFilesFn"
          :fileList="fileList"
          :see="true"
          :voteDownFlag="voteDownFlag"
        />
      </div>
    </div>
    <div
      class="collapse-box"
      v-if="summaryObj && summaryShow && lookProgrammeFrom.scheme == 0"
    >
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
          :readFlag="true"
          v-if="summaryObj"
        />
      </div>
    </div>
  </div>
</template>

<script>
import arrowIcon from "./arrowIcon.vue";
import formUpload from "@/views/components/formUpload.vue";
import summaryUEditor from "@/views/components/summaryUEditor.vue";
import CustomTable from "../../components/Table/CustomTable";
import {
  downloadTopicFile,
  downloadAdvice,
  downTopicAdviceFiles,
} from "@/api/myTopics";
import { downLoadAllFiles } from "@/api/vote/index";
import formComponent from "@/views/components/formComponent/index.vue";
import lookProgramme from "@/views/components/lookProgramme/index.vue";
import meetingVote from "@/views/components/meetingVote/index.vue";
export default {
  components: {
    CustomTable,
    formComponent,
    formUpload,
    summaryUEditor,
    arrowIcon,
    lookProgramme,
    meetingVote,
  },
  props: {
    // 投票是否可下载
    voteDownFlag: { type: Boolean, default: false },
    // 会议纪要下载加载
    summaryLoading: { type: Boolean, default: false },
    // 显示会议纪要
    summaryShow: { type: Boolean, default: true },
    // 显示参会信息
    showProgramme: { type: Boolean, default: true },
    // 是否全展开
    all: { type: Boolean, default: false },
    // 议题ID
    activeTopicId: { type: [Number, String], default: "" },
    // 议题名字
    activeTopicName: { type: String, default: "" },
    // 基本信息表单
    checkForm: { type: Object, default: () => null },
    // 会议材料
    topicFile: { type: Array, default: () => [] },
    // 发布议题相关材料
    publishFile: { type: Array, default: () => [] },
    // 意见材料
    adviceFile: { type: Array, default: () => [] },
    // 投票证明材料
    fileList: { type: Array, default: () => [] },
    // 参会对象表格数据
    attendData: { type: Array, default: () => [] },
    // 参会对象表格页码
    attendPagination: { type: Object, default: () => null },
    // 参会对象from表单
    lookProgrammeFrom: { type: Object, default: () => null },
    // 会中发起投票from表单
    voteInfo: { type: Object, default: () => null },
    // 投票表格列
    voteTableCols: { type: Array, default: () => [] },
    // 投票表格数据
    voteData: { type: Array, default: () => [] },
    // 确认参会信息
    confirmObj: { type: Object, default: () => null },
    // 征集对象信息
    checkObj: { type: Object, default: () => null },
    // 投票信息
    voteObj: { type: Object, default: () => null },
    // 会议纪要对象信息
    summaryObj: { type: String, default: () => null },
  },
  data() {
    return {
      activeNames: this.all ? [1, 2, 3, 4, 5] : [],
      attendCols: [
        {
          label: "姓名",
          prop: "username",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "参会确认结果",
          prop: "attendConfirm",
          headerAlign: "center",
          align: "center",
          type: "Html",
          html: (row) => {
            let html = "";
            switch (row.attendConfirm) {
              case "" || null:
                html = '<span class="table-label-status ">未确认</span>';
                break;
              case "0":
                html = '<span class="table-label-status ">线上参加</span>';
                break;
              case "1":
                html = '<span class="table-label-status">线下参加</span>';
                break;
              case "2":
                html = '<span class="table-label-status">不参加</span>';
                break;
            }
            return html;
          },
        },
        {
          label: "备注",
          prop: "reason",
          headerAlign: "center",
          align: "center",
        },
      ],
      adviceFileLoading: false,
      topicFileLoading: false,
      publishFileFnLoading: false,
      voteLoading: false,
    };
  },
  methods: {
    changeShow(item) {
      let index = this.activeNames.indexOf(item);
      index > -1
        ? this.activeNames.splice(index, 1)
        : this.activeNames.push(item);
    },
    changeAttendData() {
      this.$emit("changeAttendData");
    },
    activeNamesFn(index) {
      this.activeNames = [index];
      console.log(this.activeNames);
    },
    // 会议材料下载
    downloadTopicFileFn() {
      let params = new URLSearchParams();
      params.append("topicId", this.activeTopicId);
      this.topicFileLoading = true;
      downloadTopicFile(this.activeTopicId).then((res) => {
        let blob = new Blob([res], {
          type: "application/zip",
        });
        this.topicFileLoading = false;
        this.downFn(blob, this.activeTopicName + "会议材料");
      });
    },
    // 相关材料下载
    downPublishFileFn() {
      let params = new URLSearchParams();
      params.append("topicId", this.activeTopicId);
      this.publishFileFnLoading = true;
      downTopicAdviceFiles(this.activeTopicId).then((res) => {
        let blob = new Blob([res], {
          type: "application/zip",
        });
        this.publishFileFnLoading = false;
        this.downFn(blob, this.activeTopicName + "相关材料");
      });
    },
    // 意见下载
    downloadAdviceFn() {
      let params = new URLSearchParams();
      params.append("topicId", this.activeTopicId);
      this.adviceFileLoading = true;
      downloadAdvice(this.activeTopicId).then((res) => {
        let blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        this.adviceFileLoading = false;
        this.downFn(blob, this.activeTopicName + "的意见汇总表");
      });
    },
    // 线下投票下载
    downLoadAllFilesFn() {
      let params = new URLSearchParams();
      this.voteLoading = true;
      params.append("topicId", this.activeTopicId);
      downLoadAllFiles(params).then((res) => {
        let blob = new Blob([res], {
          type: "application/zip",
        });
        this.voteLoading = false;
        this.downFn(blob, "线下投票材料");
      });
    },
    downFn(blob, downloadName) {
      const tmpLink = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      tmpLink.href = objectUrl;
      tmpLink.download = downloadName;
      tmpLink.click();
    },
    downloadSummaryFn(){
      this.$emit("downloadSummaryFn")
    }
  },
};
</script>

<style lang="scss" scoped>
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
.summaryItem {
  width: 100%;
}
</style>
