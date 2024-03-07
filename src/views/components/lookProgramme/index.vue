<template>
  <div :class="[{ seeModel: see }]">
    <el-form ref="formRef" :model="form" label-width="140px">
      <el-form-item label="会议时间" prop="startTime" v-if="schemeFlag">
        <el-date-picker
          :disabled="true"
          class="overTime"
          format="yyyy-MM-dd HH:mm"  
          v-model="form.startTime"
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
          style="width: 100%"
          v-model="form.voteTime"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"  
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="true"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会议地址" prop="meetingAddr" v-if="schemeFlag">
        <el-input
          v-model="form.meetingAddr"
          placeholder="线上或线下具体会议室地址"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="投票方式" prop="voteWay" v-if="!schemeFlag">
        <el-radio-group v-model="form.voteWay" :disabled="true">
          <el-radio label="0">单选</el-radio>
          <el-radio label="1">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="临期提醒时间" prop="remindSetting" v-if="!pollType">
        <el-select
          v-model="form.remindSetting"
          placeholder="请选择临期提醒时间"
          :disabled="true"
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
        <el-input
          disabled
          v-show="form.voteObject != ''"
          class="showNameBox"
          :value="form.voteObject"
          @click.native="
            see
              ? ((visible2 = true),
                (checkedObjectList = form.checkedObjectList))
              : (visible = true)
          "
        />
      </el-form-item>
      <el-form-item label="参会对象" v-if="schemeFlag" prop="attendObject">
        <el-input
          disabled
          v-show="form.attendObject != ''"
          class="showNameBox"
          :value="form.attendObject"
          @click.native="
            see
              ? ((visible2 = true),
                (checkedObjectList = form.checkedObjectList))
              : (visible = true)
          "
        />
      </el-form-item>
      <el-form-item
        label="议事内容"
        prop="noteDetail"
        v-if="schemeFlag && form.noteDetail != ''"
      >
        <el-input
          :disabled="true"
          type="textarea"
          :rows="4"
          v-model="form.noteDetail"
          maxlength="300"
          :show-word-limit="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="投票内容"
        prop="voteContent"
        v-if="!schemeFlag && form.voteContent != ''"
      >
        <el-input
          :disabled="true"
          type="textarea"
          :rows="4"
          v-model="form.voteContent"
          maxlength="300"
          :show-word-limit="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item v-if="form.meetingLink" label="会议邀请链接">
        <el-input
          ref="meetingLink"
          class="meetingLink"
          v-model="form.meetingLink"
          :disabled="true"
        >
          <el-button class="copy" slot="append" type="primary" @click="copy"
            >复制</el-button
          >
        </el-input>
      </el-form-item>
      <el-form-item v-if="topicFile.length > 0" class="downBtn">
        <formUpload
          :buttonName="'会议材料下载'"
          @downTopic="downloadTopicFile"
          :fileList="topicFile"
          :loading="loading"
          :see="true"
        />
      </el-form-item>
    </el-form>
    <join-objects
      ref="join"
      :visible.sync="visible"
      :tagIdList="tagList"
      :checkedObjectList="checkedObjectList"
    />
    <ShowJoin :visible.sync="visible2" :checkedObjectList="checkedObjectList" />
  </div>
</template>

<script>
import formUpload from "../formUpload.vue";
import Clipboard from "clipboard";
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
  name: "lookProgramme",
  props: {
    see: {
      type: Boolean,
      default: true,
    },
    pollType: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    form: { type: [Object], default: () => null },
    topicFile: { type: Array, default: () => [] },
  },
  data() {
    return {
      visible: false,
      visible2: false,
      tagList: [],
      checkedObjectList: [],
    };
  },
  watch: {
    form: {
      handler(val) {
        console.log(val);
      },
      immediate: true,
    },
    "form.checkedObjectList"(val) {
      this.checkedObjectList = val;
    },
  },
  mounted() {},
  methods: {
    // 复制视频会议链接
    copy() {
      var clipboard = new Clipboard(".copy", {
        text: () => {
          return this.form.meetingLink;
        },
      });
      clipboard.on("success", (e) => {
        this.$message({
          message: "复制成功",
          duration: 500,
          type: "success",
          onClose: () => {
            clipboard.destroy();
          },
        });
      });
      clipboard.on("error", (e) => {
        this.$message({
          message: "复制失败",
          duration: 500,
          type: "error",
          onClose: () => {
            clipboard.destroy();
          },
        });
      });
    },
    downloadTopicFile() {
      this.$emit("downTopic");
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
    color: #666;
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
