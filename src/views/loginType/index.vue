<template>
  <div></div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import { setSessionStorage } from "@/utils/auth";
export default {
  name: "Login",
  data() {
    return {};
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    let code = "";
    var params = new URLSearchParams();
    code = this.$route.query.authCode;
    if (code == "" || code == undefined) {
      this.$message({
        message: "用户数据返回异常，请联系管理员",
        type: "error",
      });
    } else {
      params.append("code", code);
      params.append("type", 2);
      axios({
        method: "post",
        url: this.$settings.apis + "/thirdLogin",
        data: params,
      }).then((res) => {
        if (res.data.object == null) {
          this.$message({
            message: "用户数据返回异常，请联系管理员",
            type: "error",
          });
        } else {
          Vue.prototype.GLOBAL.userId = res.data.object.userInfo.id;
          sessionStorage.setItem("userId", res.data.object.userInfo.id);
          sessionStorage.setItem("tname", res.data.object.userInfo.tname);
          sessionStorage.setItem("orgId", res.data.object.orgId);
          sessionStorage.setItem("showName", res.data.object.orgName);
          sessionStorage.setItem("mobile", res.data.object.userInfo.mobile);
          sessionStorage.setItem("type", 2);
          let obj = {
            id: res.data.object.orgId,
            showName: res.data.object.orgName,
          };
          this.$store.commit("user/SET_ORG_INFO", obj);
          setSessionStorage(res.data.object.token);
          this.$router.push("/myTopics");
        }
        console.log("登录了");
      });
    }
  },
  methods: {},
};
</script>
