import { load, request, aPathTo } from "@/utils/list.js";
import UEditor from "@/components/Editor/UEditor";
import { querySummary, summaryManageSave } from "@/api/summary/index.js";
export default {
  data() {
    return {
      content: "",
      topicSummaryId: "",
      fontSizeValue: 1,
      config: {
        toolbars: [
          // 'print'先隐藏
          // "topicsummarysave",
          // "topicsummaryclear",
          [
            "fontfamily",
            "fontsize",
            "bold",
            "undo",
            "indent",
            "lineheight",
            "download",
          ],
        ],
        autoHeightEnabled:false,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        initialContent: this.content,
        autoClearinitialContent: false,
        BaseUrl: "",
        zIndex: 11000,
        UEDITOR_HOME_URL:
          (process.env.VUE_APP_PUBLIC_PATH ?? process.env.VUE_APP_PUBLIC_PATH) +
          "static/ueditor/",
      },
    };
  },
  computed: {},
  watch: {
    summaryObj(val) {
      setTimeout(() => {
        this.$refs["ueditor"].setContent(val);
      }, 500);
    },
  },
  components: {
    UEditor,
  },
  mounted() {
    if (this.summaryObj) {
      this.$refs["ueditor"].setContent(this.summaryObj);
    } else {
      this.topicSummary();
    }
  },
  methods: {
    customUE() {
      var me = this;
      // this.$nextTick(() => {
      //   let me = this;

      //   //手动保存
      //   UE.commands["topicsummarysave"] = {
      //     execCommand: function () {
      //       me.saveTopicSummar();
      //     },
      //   };

      //   //手动删除
      //   UE.commands["topicsummaryclear"] = {
      //     execCommand: function () {
      //       me.clearTopicSummar();
      //       //TOPIC_SUMMARY.clearTopicSummar();
      //     },
      //   };
      //   this.$refs["ueditor"]
      //     .getElement()
      //     .addListener("contentchange", function () {
      //       /*var me = this;
      //     me.incrUpdateFlag(me.options.contentChangeWeight);*/
      //       me.saveTopicSummar();
      //     });
      // });

      // UE.plugin.register("asrmarkplugin", function () {
      //   /**
      //    * 监听到编辑器内容发生改变时，整理集合
      //    */
      //   me.$refs["ueditor"]
      //     .getElement()
      //     .addListener("contentchange", function () {
      //       /*var me = this;
      //     me.incrUpdateFlag(me.options.contentChangeWeight);*/
      //       me.saveTopicSummar();
      //     });
      // });

      /**
       * 保存标识递增
       * @param num
       */
      // UE.Editor.prototype.incrUpdateFlag = function (num) {
      //   var me = this;
      //   if (!me.options.updateflag) {
      //     me.options.updateflag = 0.1;
      //   } else {
      //     var puls = 1;
      //     if (num) {
      //       puls = num;
      //     }
      //     me.options.updateflag = me.options.updateflag + puls;
      //   }
      // };

      // var lastRateTime = new Date().getTime();
      // //按照频率保存最小的时间间隔 200ms
      // var intervalMIN = 300;
      // //每个递增 200ms
      // var intervalINCR = 200;
      // //连续多少次连续保存
      // var intervalINCCOUNT = 5;
      // //保存次数计数
      // var intervalCurrentCount = 0;
      // //前一次保存时间
      // var intervalCurrentTime = new Date().getTime();
      /**
       * 一定频次保存html内容
       */
      // UE.Editor.prototype.saveHtmlByRate = function () {
      //   var me = this;
      //   // console.log("开始触发保存")
      //   var now = new Date().getTime();
      //   if (
      //     me.options.updateflag &&
      //     me.options.updateflag >= me.options.flushRateInterval &&
      //     now - lastRateTime > intervalMIN
      //   ) {
      //     intervalCurrentCount = intervalCurrentCount + 1;
      //     //频率保存的最小间隔是0.5s
      //     lastRateTime = now;
      //     // console.log("满足频次条件保存:" + me.options.updateflag)
      //     me.options.updateflag = 0;
      //     me.saveTopicSummar();
      //     //对于不超出按时间保存频率的按次保存，如果连续密集保存，则提升最低保存间隔降低服务压力
      //     if (
      //       intervalCurrentCount >= intervalINCCOUNT &&
      //       intervalMIN <= me.options.flushTimeInterval
      //     ) {
      //       var diff = intervalCurrentTime - now;
      //       if (diff <= (intervalINCCOUNT + 1) * intervalMIN) {
      //         // console.log("连续密集保存 提升最低保存时间间隔，降低降低保存密度");
      //         intervalMIN = intervalMIN + intervalINCR;
      //       }
      //       //重置次数和时间
      //       intervalCurrentCount = 0;
      //       intervalCurrentTime = now;
      //     }
      //   } else {
      //     // console.log("不满足频次条件不保存")
      //   }
      // };
    },
    saveTopicSummar() {
      //method, url, params, {success:successCallBack, fail:failCallBack, error:errorCallBack}
      let params = new URLSearchParams();
      // let obj={"topicId":this.topicId,"content":"会议纪要内容"}
      let str = this.$refs["ueditor"].getUEContent().replace(/<p><\/p>/g, "");
      let obj = { topicId: this.topicId, content: str };
      params.append("contentInfo", JSON.stringify(obj));
      summaryManageSave(params).then((res) => {
        console.log("保存成功", res);
      });
      // return request(
      //   "post",
      //   "/summary/meeting/saveContentText",
      //   {
      //     meetingId: this.meetingId,
      //     content: this.$refs["ueditor"]
      //       .getUEContent()
      //       .replace(/<p><\/p>/g, ""),
      //   },
      //   {
      //     success: (res) => {
      //       var object = res.object;
      //       if (object) {
      //         this.topicSummaryId = object.id ? object.id : "";
      //         console.log("保存查询个人笔记id" + this.topicSummaryId);
      //         console.log("保存查询个人笔记");
      //         console.log(object);
      //       }
      //     },
      //   }
      // );
    },
    topicSummary() {
      let params = new URLSearchParams();
      params.append("topicId", this.topicId);
      async function query() {
        let obj = await querySummary(params);
        return obj;
      }
      return query().then((res) => {
        let list = res?.object;
        this.$refs["ueditor"].setContent(list);
      });

      // return load('POST', "/summaryManage/querySummary", {meetingId:1}, {
      //   success: (res) => {
      //     let list = res?.object;
      //     console.log('会议名字',this.meetingName,'this.meetingName')
      //     let str =`<p>来自【${this.meetingName}】</p><h3>要点记录</h3><p>1.写点什么...</p><p>2.</p><p>3.</p>`
      //     if (list) {
      //       this.$refs["ueditor"].setContent(list.content ? list.content : str)
      //     }else{
      //       this.$refs["ueditor"].setContent(str)
      //     }
      //   }
      // })
    },
    clearTopicSummar() {
      this.$confirm("确认清空编辑内容？", "提交", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      })
        .then(() => {
          this.$refs["ueditor"].setContent("");
        })
        .catch(() => {});
    },

    //文件下载
    handleDownLoad(suffix) {
      suffix = suffix || "docx";
      let url = `${this.$settings.apis}/summary/user/download/${this.$route.query.meetingId}`;
      let fileName = "个人笔记." + suffix;
      console.log(url, fileName);
      aPathTo(url);
    },
    handlePrint() {
      document.getElementById("ueditor_0").contentWindow.print();
    },

    // async handleSaveDoc(editor) {
    //   await this.saveTopicSummar();
    //   var timer = null,
    //     uid = null;
    //   clearTimeout(timer);
    //   timer = setTimeout(function () {
    //     if (uid) {
    //       editor.trigger("hidemessage", uid);
    //     }
    //     uid = editor.trigger("showmessage", {
    //       content: editor.getLang("autosave.success"),
    //       timeout: 2000,
    //     });
    //   }, 100);
    // },
  },
};
