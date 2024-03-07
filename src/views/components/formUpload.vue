<template>
  <el-upload
    class="upload-demo"
    action="#"
    accept=".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.txt"
    :on-change="handleChange"
    :on-remove="hadnleRemove"
    :before-upload="beforeFn"
    :file-list="fileList"
    :auto-upload="false"
    :disabled="see"
    multiple
  >
    <el-button type="primary" v-show="upType == 3">线下投票证明上传</el-button>
    <el-button class="upBtn" v-show="upType == 1" >{{ buttonName }}</el-button>
    <el-button
      :style="upType == 3 ? 'margin-left:10px' : 'margin:0'"
      :type="voteDownFlag ? 'primary' : 'info'"
      v-show="upType !== 1"
      :loading="loading"
      @click.stop="down()"
      >{{ buttonName }}</el-button
    >
  </el-upload>
</template>

<script>
export default {
  props: {
    buttonName: {
      type: String,
      default: "",
    },
    downName: {
      type: String,
      default: "",
    },
    fileList: { type: Array, default: () => [] },
    upType: {
      type: Number,
      default: 0,
    },
    voteDownFlag: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    see: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  watch: {
    fileList(val) {
      console.log("fileList===", val);
    },
  },
  methods: {
    beforeFn() {},
    handleChange(file, fileList) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      console.log('fileSuffix',fileSuffix)
      const whiteList = ["jpg","jpeg","png","doc","docx","xls","xlsx","pdf","ppt","pptx","txt"];
      if (whiteList.indexOf(fileSuffix) < 0) {
        this.$message({
          message: "上传文件只允许jpg,jpeg,png,doc,docx,xls,xlsx,pdf,ppt,pptx,txt格式",
          type: "warning",
        });
        this.fileList=this.fileList.filter(item=>{
          item.uuid==!file.uuid
          return item
        })
        return false;
      }
      console.log("1", file);
      console.log("---", fileList);
      console.log(this.fileList);
      this.$emit("changeFileList", fileList);
    },
    hadnleRemove(file,fileList) {
      if (!file.raw) {
        this.$emit("pushRemove", file);
      }else{
         this.$emit("changeFileList", fileList);
      }
    },
    down() {
      if (this.buttonName == "会议材料下载") {
        this.$emit("downTopic");
      } else if(this.buttonName == "相关材料下载"){
         this.$emit("downPublishFile");
      } else {
        if (!this.voteDownFlag && this.buttonName == "线下投票证明下载") {
          return;
        }
        this.$emit("downAll");
      }

      console.log("下载");
    },
  },
};
</script>

<style lang="scss" scoped>
.upBtn {
  width: 6.25rem;
}
</style>
<style lang="scss">
</style>
