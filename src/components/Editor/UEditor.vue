<template>
  <div>
    <script id="editor" type="text/plain" />
  </div>
</template>

<script>
import "_p/static/ueditor/themes/default/css/customSubject.css";
import "_p/static/ueditor/themes/default/css/ueditor.css";
import "_p/static/ueditor/themes/iframe.css";

// 需要注册的自定义工具
const registerTools = [
  {
    name: "saveDoc", // 按钮的名字
    title: "保存", // 提示
    onclick(editor) {
      this.$emit("saveDoc", editor);
    },
  },
];

export default {
  name: "UEditor",
  props: {
    config: {
      type: Object,
    },
    readFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isReady: false,
      commandArr: [],
      editor: null,
    };
  },
  created() {
    window.UE = null;
    // 初始化UE
    this.loadCore();
  },
  destoryed() {
    this.editor.destory();
  },
  methods: {
    loadCore() {
      var self = this;
      return new Promise((resolve, reject) => {
        if (window.UE && window.UE.getEditor) {
          resolve();
          self.$nextTick(() => {
            self.initUE(self.config);
          });

          return;
        }
        const coreScript = document.createElement("script");
        coreScript.type = "text/javascript";

        coreScript.src =
          (process.env.VUE_APP_PUBLIC_PATH ?? process.env.VUE_APP_PUBLIC_PATH) +
          "static/ueditor/ueditor.all.js";
        document.getElementsByTagName("head")[0].appendChild(coreScript);
        coreScript.onload = function () {
          if (window.UE && window.UE.getEditor) {
            // 初始化UE
            self.initUE(self.config);
            resolve();
          } else {
            console.error(
              "加载ueditor.all.min.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!\n",
              coreScript.src
            );
          }
        };
      });
    },

    // 批量注册工具栏自定义功能
    registerCustomTools() {
      const vm = this;
      const { uiNameList, uiMap } = registerTools.reduce(
        (res, ui) => {
          const { name } = ui;
          res.uiNameList.push(name);
          res.uiMap[name] = ui;
          return res;
        },
        {
          uiNameList: [],
          uiMap: {},
        }
      );
      UE.registerUI(uiNameList.join(" "), function (editor, uiName) {
        // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
        const config = uiMap[uiName];
        const onclick = config.onclick;
        config.onclick =
          (typeof onclick === "function" && onclick.bind(vm, editor)) ||
          (() => {});
        editor.registerCommand(uiName, {
          execCommand: function () {
            alert("execCommand:" + uiName);
          },
        });
        // 创建并返回
        return new UE.ui.Button(config);
      });
    },

    // 初始化UE
    initUE(config) {
      this.isReady = true;
      const _this = this;
      var UE = window.UE;
      this.editor = UE.delEditor("editor");
      // this.registerCustomTools()
      this.editor = UE.getEditor("editor", config);
      var ue = UE.getEditor("editor");
      ue.ready(function () {
        // 添加点击事件
        _this.$emit("customUE");
        ue.body.style.height = "100%";
        if(_this.readFlag){
            ue.setDisabled();
        }
      });

      if (_this.commandArr.length) {
        let item = {};
        while ((item = _this.commandArr.shift())) {
          _this[item.fun](item.data);
        }
      }
    },

    getUEContent: function () {
      return this.editor.getContent();
    },

    getContentTxt: function () {
      return this.editor.getContentTxt();
    },

    setContent: function (content) {
      if (!this.isReady) {
        this.commandArr.push({ fun: "setContent", data: content });
        return;
      }

      const vm = this;
      var UE = window.UE;
      var ue = UE.getEditor("editor");
      ue.ready(function () {
        ue.setContent(content);
        vm.$nextTick(() => {
          ue.body.style.height = "100%";
        });
      });
    },

    execCommand(funcName) {
      if (!this.isReady) {
        this.commandArr.push({ fun: "execCommand", data: funcName });
        return;
      }

      var UE = window.UE;
      var ue = UE.getEditor("editor");
      // ue.focus();
      ue.execCommand("inserthtml", funcName, true);
    },
    // 获取光标坐在位置字体大小
    getFontSize() {
      var ue = UE.getEditor("editor");
      return ue.queryCommandValue("fontsize");
    },

    // 获取选区对应的Range
    getRange() {
      var UE = window.UE;
      var ue = UE.getEditor("editor");
      return ue.selection.getRange();
    },

    getElement() {
      var UE = window.UE;
      var ue = UE.getEditor("editor");
      return ue;
    },
    // 获取选区开始位置的父节点到body
    getStartElementPath() {
      var UE = window.UE;
      var ue = UE.getEditor("editor");
      return ue.selection.getStartElementPath();
    },

    // 添加自定义样式
    addCustomClass(_class) {
      var UE = window.UE;
      var ue = UE.getEditor("editor");
      ue.ready(function () {
        ue.body.setAttribute(
          "class",
          ue.body.getAttribute("class") + " " + _class
        );
      });
    },
  },
};
</script>
<style lang="scss">
#editor {
  height: 300px;
}
.edui-for-print:before {
  position: absolute;
  left: 0;
  top: 0;
  height: 2.4rem !important;
  width: 2.4rem !important;
  font-size: 1.4rem;
  line-height: 2.4rem;
  content: "\e633";
  color: #666;
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle;
  text-align: center;
  z-index: 2;
  pointer-events: none;
}
.edui-for-download:before {
  position: absolute;
  left: 0;
  top: 0;
  height: 2.4rem !important;
  width: 2.4rem !important;
  font-size: 1.4rem;
  line-height: 2.4rem;
  content: "\e6a0";
  color: #666;
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle;
  text-align: center;
  z-index: 2;
  pointer-events: none;
}
</style>
