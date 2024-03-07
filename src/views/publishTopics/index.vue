<template>
  <div class="custom-main-container" v-if="!hidden">
    <div class="custom-main-container__content">
      <div style="margin: 0 auto">
        <formComponent
          ref="formTopics"
          :form="form"
          :codeFlag="codeFlag"
          :see="false"
          @cancel="cancel"
          @close="(confimFlag = false), (confimLoading = false)"
          @programmeShow="programmeShow"
          @programmeNone="programmeNone"
          @showTip="tipVisible = true"
          @changeCheck="
            (val) => {
              checkFirst = val;
            }
          "
          @getId="getId"
          :tagArry="tagArry"
          @changeFileList="
            (val) => {
              fileList = val;
            }
          "
        >
        </formComponent>
        <div v-if="programmeFlag">
          <programmeForm
            :noSide="false"
            :form="programmeFormObj"
            :programmeFileList="programmeFileList"
            :schemeEd="false"
            :programmeFlag="programmeFlag"
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
          <div class="footer">
            <el-button @click="rest">重置</el-button>
            <el-button type="primary" @click="confimFlagFn">提交</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗确认 -->
    <confimBox
      :programmeType="programmeFormObj.scheme"
      :checkType="2"
      :voteState="''"
      :confimFlag="confimFlag"
      :loading="confimLoading"
      @cancel="confimFlag = false"
      @submit="submit"
    />
    <el-dialog
      title="提示"
      :visible.sync="tipVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body
    >
      <div style="padding-bottom: 10px">权限不足，请联系管理员设置</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryLabelList } from "@/api/programme";
import { apiLogin } from "@/api/login";
import { deleteTopicById } from "@/api/myTopics";
import "@/styles/customMain/index.scss";
import formComponent from "@/views/components/formComponent/index.vue";
import programmeForm from "@/views/components/programmeForm/index.vue";
import { createScheme } from "@/api/programme/index";
import confimBox from "@/views/myTopics/confimBox.vue";
import { setSessionStorage } from "@/utils/auth";
export default {
  name: "publishTopics",
  components: { formComponent, programmeForm, confimBox },
  data() {
    return {
      hidden: false,
      form: {
        topicName: "",
        isSeak: "1",
        seakObject: "",
        remindSetting: "1",
        tag: [],
        note: "",
        seakTime: this.getTenDay(),
      },
      programmeFileList: [],
      deleteFiles: [],
      activeTopicId: "",
      checkFlag: false,
      programmeFormObj: {
        statisticalReqDTOList: [
          { optionDescribe: "同意" },
          { optionDescribe: "不同意" },
          { optionDescribe: "弃权" },
        ],
        isSeak: "",
        voteTime: [ this.$moment(),this.$moment().add(10,'days')],
        meetingType: "",
        status: "",
        topicName: "",
        scheme: "0",
        voteWay: "0",
        remindSetting: "1",
        attendObject: "",
        voteObject: "",
        noteDetail: "",
        voteContent: "",
      },
      tagArry: [],
      programmeFlag: false,
      confimFlag: false,
      checkFirst: false,
      codeFlag: false,
      confimLoading: false,
      tipVisible: false,
    };
  },
  methods: {
    handleClose() {
      this.tipVisible = false;
      this.$router.go(-1);
    },
    getTenDay() {
      return this.$moment(
        Number(this.$moment().format("x")) + 864000000
      ).format("YYYY-MM-DD HH:mm:ss");
    },
    cancel() {
      let isSeak = this.form.isSeak;
      this.confimLoading = false;
      this.form = {
        seakTime: "",
        topicName: "",
        isSeak: isSeak,
        seakObject: "",
        remindSetting: "48",
        tag: [],
        note: "",
      };
      this.$nextTick(() => {
        this.$refs.formTopics.checkedObjectList = [];
        this.$refs.formTopics.tagList = [];
        // this.$refs.formTopics.$refs.join.isAll = false;
        // this.$refs.formTopics.$refs.join.pathOrgs = [
        //   this.$store.getters.orgInfo,
        // ];
        // const id = this.$store.getters.orgInfo.id;
        // this.$refs.formTopics.$refs.join.loadOrgTree(id);
        // this.$refs.formTopics.$refs.formRef.clearValidate();
      });
      console.log(this.form);
    },
    // 获取ID后再去 请求会议的接口
    getId(val) {
      this.$set(this.programmeFormObj, "topicName", val.name);
      this.activeTopicId = val.id;
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
        statisticalReqDTOList: tempObj.statisticalReqDTOList,
        tagList: tagList,
        personList: personList,
        orgList: orgList,
        voteContent: tempObj.voteContent,
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
        this.programmeFileList.forEach((item) => {
          if (item.raw) {
            params.append("files", item.raw);
          }
        });
      }
      params.append("scheme", JSON.stringify(scheme));
      createScheme(params)
        .then((res) => {
          if (res.success) {
            this.$message({
              message: "提交成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                if (this.codeFlag) {
                  this.rest();
                  this.confimFlag = false;
                  this.confimLoading = false;
                } else {
                  this.$router.push("myTopics");
                }
              },
            });
          } else {
            deleteTopicById(this.activeTopicId);
            this.confimFlag = false;
            this.confimLoading = false;
          }
        })
        .catch(() => {
          deleteTopicById(this.activeTopicId);
        });
    },
    programmeShow(val) {
      this.$set(this.programmeFormObj, "topicName", val.name);
      this.$refs.formTopics.$refs.formRef.clearValidate();
      this.programmeFlag = true;
      // this.activeTopicId = val.id;
    },
    programmeNone() {
      this.programmeFlag = false;
      this.$refs.formTopics.$refs.formRef.clearValidate();
      // this.activeTopicId = val.id;
    },
    rest() {
      this.cancel();
      this.programmeFormObj = {
        statisticalReqDTOList: [
          { optionDescribe: "同意" },
          { optionDescribe: "不同意" },
          { optionDescribe: "弃权" },
        ],
        isSeak: "",
        voteTime: [this.$moment(),this.$moment().add(10,'days')],
        meetingType: "",
        status: "",
        topicName: "",
        scheme: "0",
        voteWay: "0",
        remindSetting: "48",
        attendObject: "",
        voteObject: "",
        noteDetail: "",
        voteContent: "",
      };
      this.$nextTick(() => {
        this.$refs.programme.checkedObjectList = [];
        this.$refs.programme.tagList = [];
        // this.$refs.programme.$refs.join.isAll = false;
        // this.$refs.programme.$refs.join.pathOrgs = [
        //   this.$store.getters.orgInfo,
        // ];
        // const id = this.$store.getters.orgInfo.id;
        // this.$refs.programme.$refs.join.loadOrgTree(id);
        // this.$refs.programme.$refs.formRef.clearValidate();
      });
    },
    confimFlagFn() {
      this.$refs.formTopics.formCheck();
      this.$refs.programme.formCheck();
      if (!this.checkFirst) {
        return;
      }
      this.confimFlag = this.checkFlag;
    },
    async submit() {
      this.confimLoading = true;
      await this.$refs.formTopics.onSubmit();
    },
  },
  created() {
    if (this.$route.path == "/cs/publishTopics") {
      this.codeFlag = true;
      this.hidden = true;
      let params = new FormData();
      params.append("key", this.$route.query.key);
      apiLogin(params)
        .then((res) => {
          if (res.resultMsg) {
            this.hidde = true;
          } else {
            console.log(res, "res--");
            this.$router.push({ query: {} });
            sessionStorage.setItem("userId", res.object.userInfo.id);
            sessionStorage.setItem("orgId", res.object.orgId);
            sessionStorage.setItem("showName", res.object.orgName);
            sessionStorage.setItem("type", 1);
            let obj = {
              id: res.object.orgId,
              showName: res.object.orgName,
            };
            this.$store.commit("user/SET_ORG_INFO", obj);
            setSessionStorage(res.object.token);
            this.hidden = false;
          }
        })
        .catch(() => {
          this.hidden = true;
        });
    }
  },
  mounted() {
    setTimeout(() => {
      queryLabelList().then((res) => {
        this.tagArry = res.object;
      });
    }, 500);
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table--border::after {
    display: none;
  }
  .el-form {
    width: 40vw;
  }
  .el-tag {
    margin-bottom: 5px;
  }
  .el-upload-list {
    width: 100%;
  }
}
.custom-main-container__content {
  display: flex;
  min-height: calc(100vh - 64px - 2rem);
  padding-top: 20px;
  .footer {
    text-align: center;
    margin-left: 140px;
  }
}
</style>
