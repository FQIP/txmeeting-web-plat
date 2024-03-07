<template>
  <div :class="[{ publish: !see }, { seeModel: see }]">
    <el-form
      ref="formRef"
      :model="form"
      :rules="!see ? rules : {}"
      label-width="140px"
    >
      <el-form-item label="议事主题" prop="topicName">
        <el-input
          v-model.trim="form.topicName"
          maxlength="50"
          :show-word-limit="true"
          :disabled="see"
        />
      </el-form-item>
      <el-form-item label="议事类型" prop="topicType">
        <el-select
          :disabled="see"
          v-model="form.topicType"
          placeholder="请选择议事类型"
          @change="setTopicType"
        >
          <el-option
            v-for="(item, index) in topicTypeArry"
            :key="index"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="会前是否征集意见" prop="isSeak">
        <el-radio-group v-model="form.isSeak" :disabled="see">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="征集意见对象" v-if="isSeakFlag" prop="seakObject">
        <el-button
          v-if="!see && form.seakObject == ''"
          style="margin-bottom: 10px"
          @click="visible = true"
          >+ 添加</el-button
        >
        <el-input
          :disabled="see"
          v-show="form.seakObject != ''"
          class="showNameBox"
          :value="form.seakObject"
          @click.native="see ? (visible2 = true) : (visible = true)"
        />
      </el-form-item>
      <el-form-item label="征集截止时间" prop="seakTime" v-if="isSeakFlag">
        <el-date-picker
          :disabled="see"
          class="overTime"
          v-model="form.seakTime"
          format="yyyy-MM-dd HH:mm" 
          type="datetime"
          placeholder="截止时间"
          style="width: 100%"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="临期提醒时间" v-if="isSeakFlag" prop="remindSetting">
        <el-select
          :disabled="see"
          v-model="form.remindSetting"
          placeholder="请选择临期提醒时间"
        >
          <el-option label="1小时" value="1" />
          <el-option label="6小时" value="6" />
          <el-option label="12小时" value="12" />
          <el-option label="24小时" value="24" />
          <el-option label="48小时" value="48" />
          <el-option label="无" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tag" v-if="!see">
        <div class="tag-box">
          <el-tag
            :class="form.tag.indexOf(item.code) > -1 ? 'choose' : ''"
            v-for="(item, index) in tagArry"
            :key="index"
            @click="
              () => {
                if (see) {
                  return;
                }
                form.tag.indexOf(item.code) < 0
                  ? form.tag.push(item.code)
                  : (form.tag = form.tag.filter((ite) => {
                      if (ite != item.code) {
                        return ite;
                      }
                    }));
              }
            "
            >{{ item.labelName }}</el-tag
          >
        </div>
      </el-form-item>
      <el-form-item label="标签" prop="tag" v-if="see">
        <div class="tag-box">
          <el-tag
            class="choose"
            v-for="(item, index) in form.labelName"
            :key="index"
            >{{ item }}</el-tag
          >
        </div>
      </el-form-item>
      <el-form-item label="材料上传" v-show="isSeakFlag && !see">
        <formUpload
          :buttonName="'+'"
          :upType="1"
          :fileList="fileList"
          @changeFileList="changeFileList"
        />
      </el-form-item>
      <el-form-item label="议事内容" prop="note" v-show="isSeakFlag">
        <el-input
          :disabled="see"
          type="textarea"
          :rows="4"
          v-model="form.note"
          maxlength="300"
          :show-word-limit="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="议事形式" prop="scheme" v-if="see && form.scheme">
        <el-radio-group v-model="form.scheme" :disabled="see">
          <el-radio label="0">发起会议</el-radio>
          <el-radio label="1">发起投票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="peopleData.length && !see">
        <peopleTable
          :tableData="peopleData"
          :see="see"
          @handleDelec="handleDelec"
        >
        </peopleTable>
      </el-form-item>
      <el-form-item v-if="see && publishFile.length > 0" class="downBtn">
        <formUpload
          :buttonName="'相关材料下载'"
          @downPublishFile="downPublishFile"
          :fileList="publishFile"
          :loading="loading"
          :see="see"
        />
      </el-form-item>
      <el-form-item v-if="!see && isSeakFlag">
        <div style="text-align: center">
          <el-button @click="onCancel">重置</el-button>
          <el-button type="primary" @click="confimFlagFn"> 提交 </el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      title="确认"
      :visible.sync="confimFlag"
      width="10rem"
      center
      custom-class="confirm-box"
    >
      <span>{{
        form.isSeak == 1 ? "点击提交后立即开始征集意见，确认提交？" : "确认提交"
      }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confimFlag = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <join-objects
      ref="join"
      v-if="visible"
      :visible.sync="visible"
      :tagIdList="tagList"
      :checkedObjectList="checkedObjectList"
      @editChange="editChange"
    />
    <ShowJoin :visible.sync="visible2" :checkedObjectList="checkedObjectList" />
  </div>
</template>

<script>
import { queryTopicTypeList } from "@/api/programme";
import { addTopicAdvice } from "@/api/publishTopics";
import peopleTable from "../peopleTable.vue";
import formUpload from "../formUpload.vue";
import JoinObjects from "@/components/JoinObjects/index.vue";
import ShowJoin from "@/components/ShowJoin";
export default {
  components: {
    peopleTable,
    formUpload,
    JoinObjects,
    ShowJoin,
  },
  computed: {
    isSeakFlag: function () {
      let temp;
      this.form.isSeak == "1" ? (temp = true) : (temp = false);
      return temp;
    },
  },
  name: "formComponent",
  props: {
    see: {
      type: Boolean,
      default: false,
    },
    codeFlag: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    form: { type: [Object], default: () => null },
    tagArry: { type: [Array], default: () => [] },
    publishFile: { type: Array, default: () => [] },
  },
  data() {
    return {
      confimFlag: false,
      topicTypeArry: [],
      peopleData: [],
      fileList: [],
      rules: {
        topicName: [
          { required: true, message: "请输入议题主题", trigger: "blur" },
        ],
        isSeak: [{ required: true }],
        seakObject: [
          { required: true, message: "请选择意见对象", trigger: "change" },
        ],
        seakTime: [
          { required: true, message: "请选择截止时间", trigger: "change" },
        ],
        topicType: [
          { required: true, message: "请选择议题类型", trigger: "blur" },
        ],
        remindSetting: [
          { required: true, message: "请选择临期提醒时间", trigger: "change" },
        ],
        tag: [{ required: true, message: "请选择标签", trigger: "change" }],
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
    isSeakFlag(val) {
      if (!val) {
        this.$emit("programmeShow", {
          name: this.form.topicName,
        });
      } else {
        this.$emit("programmeNone");
      }
    },
    "form.checkedObjectList"(val) {
      this.checkedObjectList = val;
    },
    "form.tagList"(val) {
      this.tagList = val;
    },
  },
  mounted() {
    if (!this.see) {
      setTimeout(() => {
        this.getQueryLis(), 2000;
      });
    } else {
      let params = new FormData();
      params.append("type", sessionStorage.getItem("type"));
      queryTopicTypeList(params).then((res) => {
        this.topicTypeArry = res.object || [];
      });
    }
  },
  methods: {
    getQueryLis() {
      let params = new FormData();
      params.append("type", sessionStorage.getItem("type"));
      if (this.codeFlag) {
        params.append("code", 13);
      }
      queryTopicTypeList(params).then((res) => {
        this.topicTypeArry = res.object || [];
        if (this.topicTypeArry.length > 0) {
          this.$set(this.form, "topicType", this.topicTypeArry[0].code);
          this.$store.commit("user/SET_TOPIC_TYPE", this.form.topicType);
          sessionStorage.setItem("topicType", this.form.topicType);
        } else {
          this.$emit("showTip");
          this.$store.commit("user/SET_TOPIC_TYPE", "");
          sessionStorage.setItem("topicType", "");
        }
      });
    },
    setTopicType(val) {
      this.$store.commit("user/SET_TOPIC_TYPE", val);
      sessionStorage.setItem("topicType", val);
    },
    editChange(val) {
      console.log(val);
      this.checkedObjectList = val.checkedObjects;
      this.form.seakObject = val.objectsNameString;
      this.orgList = val.orgList;
      this.personList = val.personList;
      this.tagList = val.tagList;
    },
    // 改变上传材料
    changeFileList(arry) {
      this.fileList = arry;
    },
    confimFlagFn() {
      this.$refs.formRef.validate((val) => {
        if (val) {
          this.confimFlag = true;
        }
      });
    },
    onSubmit() {
      // console.log(this.$moment(this.form.seakTime).format("x"))
      // console.log(this.form.remindSetting*3600000)
      // 判断时间
      console.log(this.form.seakTime);
      // if (
      //   this.$moment(this.form.seakTime).format("x") -
      //     this.$moment().format("x") <
      //     this.form.remindSetting * 3600000 &&
      //   this.isSeakFlag
      // ) {
      //   this.$message({
      //     message: "征集截止时间必须大于当前时间加上临期提醒时间",
      //     type: "warning",
      //   });
      //   return;
      // }
      this.$refs.formRef.validate((val) => {
        if (val) {
          let params = new FormData();
          params.append("topicName", this.form.topicName);
          params.append("topicStatus", 1);
          params.append("isSeak", this.form.isSeak);
          params.append("note", this.form.note);
          params.append("topicType", this.form.topicType);
          // params.append("seakObject", this.form.seakObject);
          if (this.form.isSeak == 1) {
            params.append("remindSetting", this.form.remindSetting);
            params.append(
              "seakTime",
              this.$moment(this.form.seakTime).format("YYYY-MM-DD HH:mm:ss")
            );
            this.fileList.forEach((item) => {
              if (item.raw) {
                params.append("files", item.raw);
              }
            });
            params.append("tagList", this.tagList);
            params.append("personList", this.personList);
            params.append("orgList", this.orgList);
          }
          params.append("categoryLabels", this.form.tag.join(","));
          addTopicAdvice(params).then((res) => {
            this.confimFlag = false;
            if (res.resultMsg) {
              this.$emit("close");
              return;
            } else {
              this.isSeakFlag
                ? this.$message({
                    message: "提交成功",
                    type: "success",
                    duration: 1000,
                    onClose: () => {
                      if (this.codeFlag) {
                        this.onCancel();
                      } else {
                        this.$router.push("myTopics");
                      }
                    },
                  })
                : this.$emit("getId", {
                    name: this.form.topicName,
                    id: res.object,
                  });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 表单验证
    formCheck() {
      let that = this;
      this.$refs.formRef.validate((val) => {
        if (val) {
          console.log("验证通过,11111");
          that.$emit("changeCheck", true);
        } else {
          that.$emit("changeCheck", false);
        }
      });
    },
    onCancel() {
      this.$emit("cancel");
    },
    downPublishFile() {
      this.$emit("downPublishFile");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-upload-list {
    width: 16rem;
  }
  .el-form-item__label {
    color: #333;
    font-family: PingFang SC Regular;
  }
  .tag-box {
    .el-tag {
      background: #fff;
      color: #333;
      font-size: 14px;
      margin-right: 6px;
      cursor: pointer;
    }
    .choose {
      background: #cbe3fb;
    }
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
::v-deep {
  .confirm-box {
    .el-dialog__title {
      font-size: 16px;
      padding-top: 5px;
    }
    .el-dialog__headerbtn {
      margin-top: -5px;
    }
    border-radius: 4px;
    .el-dialog__header {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
    }
  }
}
</style>
<style lang="scss">
.overTime {
  padding: 0;
  &::v-deep {
    .el-input__inner {
      padding: 0 13px;
    }
  }
}
.showNameBox {
  input {
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
</style>
