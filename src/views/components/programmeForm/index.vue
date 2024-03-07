<template>
  <div :class="['pro',{ publish: !see }, { seeModel: see }]">
    <el-form
      ref="formRef"
      :model="form"
      :rules="!see ? rules : {}"
      label-width="140px"
    >
      <el-form-item label="议事主题" prop="topicName" v-if="!programmeFlag">
        <!-- <span>{{ form.topicName }}</span> -->
        <el-input v-model="form.topicName "  />
      </el-form-item>
      <el-form-item label="议事形式" prop="scheme" v-if="!pollType">
        <el-radio-group v-model="form.scheme" :disabled="schemeEd">
          <el-radio label="0">发起会议</el-radio>
          <el-radio label="1">发起投票</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="会议时间" prop="startTime" v-if="schemeFlag">
        <el-date-picker
          :key="1"
          :append-to-body="false"
          class="overTime"
          v-model="form.startTime"
          format="yyyy-MM-dd HH:mm" 
          :default-value="this.$moment()"
          type="datetime"
          placeholder="开始时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="投票时间"
        prop="voteTime"
        v-if="!schemeFlag && !pollType"
      >
        <el-date-picker
          :key="2"
          :append-to-body="false"
          style="width: 100%"
          v-model="form.voteTime"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="临期提醒时间" prop="remindSetting" v-if="!pollType">
        <el-select
          v-model="form.remindSetting"
          placeholder="请选择临期提醒时间"
          v-if="!see"
        >
          <el-option label="1小时" value="1" />
          <el-option label="6小时" value="6" />
          <el-option label="12小时" value="12" />
          <el-option label="24小时" value="24" />
          <el-option label="48小时" value="48" />
          <el-option label="无" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="投票对象" v-if="!schemeFlag" prop="voteObject">
        <el-button
          style="margin-bottom: 10px"
          v-show="form.voteObject == ''"
          @click="visible = true"
          >+ 添加</el-button
        >
        <el-input
          v-show="form.voteObject != ''"
          class="showNameBox"
          :value="form.voteObject"
          @click.native="see?visible2 = true:visible=true"
        />
      </el-form-item>
      <el-form-item label="投票方式" prop="voteWay" v-if="!schemeFlag">
        <el-radio-group v-model="form.voteWay">
          <el-radio label="0">单选</el-radio>
          <el-radio label="1">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="!schemeFlag">
        <el-form-item
          v-for="(item, index) in form.statisticalReqDTOList"
          :key="index"
          :label="'投票项' + str[index]"
        >
          <el-input v-model="item.optionDescribe" style="width: 80%" />
          <i
            class="el-icon el-icon-delete"
            v-if="index > 1"
            style="
              padding-left: 10px;
              color: #409eff;
              cursor: pointer;
              font-size: 1rem;
            "
            @click="form.statisticalReqDTOList.splice(index, 1)"
          ></i>
        </el-form-item>
        <div style="padding-left: 140px;margin-bottom:20px">
          <el-button
            style="background: #f1f2f3"
            v-if="
              form.statisticalReqDTOList &&
              form.statisticalReqDTOList.length < 10
            "
            @click="
              () => {
                form.statisticalReqDTOList.push({ optionDescribe: '' });
              }
            "
            >+ 添加选项</el-button
          >
        </div>
      </div>
      <el-form-item label="会议地址" prop="meetingAddr" v-if="schemeFlag">
        <el-input
          v-model="form.meetingAddr"
          placeholder="线上或线下具体会议室地址"
        />
      </el-form-item>
      <el-form-item label="参会对象" v-if="schemeFlag" prop="attendObject">
        <el-button
          style="margin-bottom: 10px"
          @click="visible = true"
          v-show="form.attendObject == ''"
          >+ 添加</el-button
        >
        <el-input
          v-show="form.attendObject != ''"
          class="showNameBox"
          :value="form.attendObject"
          @click.native="visible = true"
        />
      </el-form-item>
      <el-form-item label="材料上传" v-show="schemeFlag && !pollType">
        <formUpload
          :buttonName="'+'"
          :upType="1"
          :fileList="programmeFileList"
          @changeFileList="changeFileList"
          @pushRemove="pushRemove"
        />
      </el-form-item>
      <el-form-item
        v-show="
          schemeFlag &&
          !pollType &&
          programmeFileList.length < 1 &&
          form.isSeak == '1'
        "
      >
        <div style="margin-top: -5px; font-size: 12px; color: red">
          请下载意见汇总表审核确认后作为材料上传.
        </div>
      </el-form-item>
      <el-form-item label="议事内容" prop="noteDetail" v-if="schemeFlag">
        <el-input
          type="textarea"
          :rows="4"
          v-model="form.noteDetail"
          maxlength="300"
          :show-word-limit="true"
        >
        </el-input>
      </el-form-item>
       <el-form-item label="投票内容" prop="voteContent" v-if="!schemeFlag">
        <el-input
          type="textarea"
          :rows="4"
          v-model="form.voteContent"
          maxlength="300"
          :show-word-limit="true"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <join-objects
      ref="join"
      v-if="visible"
      :side="noSide"
      :visible.sync="visible"
      :tagIdList="tagList"
      :checkedObjectList="checkedObjectList"
      @editChange="editChange"
    />
    <ShowJoin :visible.sync="visible2" :checkedObjectList="checkedObjectList" />
  </div>
</template>

<script>
import formUpload from "../formUpload.vue";
import JoinObjects from "@/components/JoinObjects/index.vue";
import ShowJoin from "@/components/ShowJoin";
export default {
  components: {
    formUpload,
    JoinObjects,
    ShowJoin,
  },
  computed: {
    schemeFlag: function () {
      let temp;
      this.form.scheme == "0" ? (temp = true) : (temp = false);
      return temp;
    },
  },
  name: "formComponent",
  props: {
    see: {
      type: Boolean,
      default: false,
    },
    noSide: {
      type: Boolean,
      default: true,
    },
    programmeFlag: {
      type: Boolean,
      default: false,
    },
    schemeEd: {
      type: Boolean,
      default: false,
    },
    pollType: {
      type: Boolean,
      default: false,
    },
    form: { type: [Object], default: () => null },
    programmeFileList: { type: Array, default: () => [] },
  },
  data() {
    return {
      str: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
      rules: {
        topicName: [
          { required: true, message: "请输入主题", trigger: "blur" },
        ],
        scheme: [{ required: true }],
        voteWay: [{ required: true }],
        meetingAddr: [
          {
            required: true,
            message: "请输入线上或线下具体会议室地址",
            trigger: "blur",
          },
        ],
        startTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        voteTime: [
          { required: true, message: "请选择投票时间", trigger: "change" },
        ],
        remindSetting: [
          { required: true, message: "请选择临期提醒时间", trigger: "change" },
        ],
        voteObject: [
          { required: true, message: "请选择投票对象", trigger: "change" },
        ],
        attendObject: [
          { required: true, message: "请选择参会对象", trigger: "blur" },
        ],
      },
      visible: false,
      visible2: false,
      checkedObjectList: [],
      tagList: [],
      personList: [],
      orgList: [],
    };
  },
  watch: {
    form: {
      handler(val) {
        console.log(val);
      },
      immediate: true,
    },
    "form.scheme"(val) {
      this.$refs.formRef.clearValidate();
      this.form.remindSetting = "48";
      this.form.attendObject = "";
      this.form.voteObject = "";
      this.orgList = [];
      this.tagList = [];
      this.checkedObjectList = [];
      this.personList = [];
    },
    "form.checkedObjectList"(val) {
      this.checkedObjectList = val;
    },
  },
  mounted() {},
  methods: {
    changeFileList(arry) {
      this.$emit("changeFileList", arry);
    },
    pushRemove(val) {
      this.$emit("pushRemove", val);
    },
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    editChange(val) {
      console.log(val);
      this.checkedObjectList=val.checkedObjects
      if (this.schemeFlag) {
        this.form.attendObject = val.objectsNameString;
      } else {
        this.form.voteObject = val.objectsNameString;
      }
      this.orgList = val.orgList;
      this.personList = val.personList;
      this.tagList = val.tagList;
    },
    // 表单验证
    formCheck() {
      let nowStamp = this.$moment().format("x");
      // if (
      //   this.$moment(this.form.startTime).format("x") - nowStamp <
      //     this.form.remindSetting * 3600000 &&
      //   this.schemeFlag
      // ) {
      //   this.$message({
      //     message: "开始时间必须大于当前时间加上临期提醒时间",
      //     type: "warning",
      //   });
      //   return;
      // }
      // if (
      //   this.$moment(this.form.voteTime[0]).format("x") - nowStamp <
      //     this.form.remindSetting * 3600000 &&
      //   !this.schemeFlag
      // ) {
      //   this.$message({
      //     message: "投票开始时间必须大于当前时间加上临期提醒时间",
      //     type: "warning",
      //   });
      //   return;
      // }
      if (this.form.scheme == 1) {
        let tip;
        this.form.statisticalReqDTOList.map((item) => {
          if (item.optionDescribe.trim() == "") {
            tip = true;
            return;
          }
        });
        if (tip) {
          this.$message({
            message: "投票项不能为空，请查看",
            type: "warning",
          });
          return;
        }
        let temp = this.form.statisticalReqDTOList.map((item) => {
          return item.optionDescribe.trim();
        });
        let setArr = Array.from(new Set(temp));
        if (setArr.length < temp.length) {
          this.$message({
            message: "投票项中含有重复项，请查看",
            type: "warning",
          });
          return;
        }
      }
      let that = this;
      this.$refs.formRef.validate((val) => {
        if (val) {
          console.log("验证通过");
          that.$emit("changeCheck");
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-upload-list {
    width: 16rem;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-form-item__label {
    color: #333;
    font-family: PingFang SC Regular;
  }
  .choose {
    background: #c9ddfd;
  }
  .publish {
    .el-input,
    .el-select,
    .el-date-editor,
    .el-textarea__inner,
    .tag-box {
      width: 40vw;
    }
  }
  .el-date-editor .el-range__icon {
    display: none;
  }
  .el-date-editor--datetimerange.el-input__inner {
    width: calc(30vw - 140px);
  }
  .el-date-editor .el-range__close-icon {
    line-height: 24px;
  }
  .seeModel {
    .el-form-item {
      width: 40vw !important;
    }
  }
  .commonPagination {
    .el-input,
    .el-select {
      width: 5.5rem;
    }
  }
  textarea {
    height: 96px;
  }
}
.tree-box {
  position: absolute;
  z-index: 10;
  background: #fff;
  width: 100%;
}
</style>

