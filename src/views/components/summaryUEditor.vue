<template>
  <div class="summary-box">
    <UEditor
      class="CusUEditor"
      ref="ueditor"
      :config="config"
      :readFlag="readFlag"
      @customUE="customUE"
      @download="handleDownLoad"
    ></UEditor>
  </div>
</template>

<script>
import UEditor from "@/components/Editor/UEditor";
import summaryMixin from "@/layout/mixin/editor/summary";
export default {
  name: "summaryUEditor",
  components: { UEditor },
  mixins: [summaryMixin],
  props: {
    topicId: {
      type: [Number, String],
      default: "",
    },
    summaryObj: {
      type: String,
      default: () => {
        null;
      },
    },
    readFlag:{
      type:Boolean,
      default:false
    },
  },
  model: {
    event: "change",
  },
  computed: {},
  data() {
    return {
      open: false,
    };
  },
  watch: {},
  methods: {
    close() {
      this.$emit("change", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.summary-box {
  // width: 44rem;
  color: #333;
  .CusUEditor {
    &::v-deep {
      #editor{
        height: 100%;
      }
      .edui-editor {
        background-color: #fff;
        border: 1px solid #eff1f2;
        height: 500px;
      }
      .edui-editor-toolbarboxouter {
        border-top: 1px solid rgb(208, 203, 203);
        background: rgb(235, 235, 235);
        border-radius: 0;
      }
      .edui-combox-body,
      .edui-default .edui-toolbar .edui-button .edui-icon,
      .edui-default .edui-toolbar .edui-menubutton .edui-icon,
      .edui-for-download:before {
        width: 2rem !important;
        height: 2rem !important;
      }
      .edui-for-download:before {
        font-size: 1.3rem;
        top: -0.2rem;
      }
      .edui-box {
        background-size: 1rem !important;
      }
    }
  }
}
</style>
