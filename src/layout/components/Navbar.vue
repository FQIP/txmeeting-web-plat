<template>
  <div>
    <div class="navbar">
      <!--    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />-->
 <iframe :src="headerSrc" width="100%;"></iframe>
      <!--    <breadcrumb class="breadcrumb-container" />-->
      <!-- <span class="logo-container">
        <span class="title"
          >四治融合平台-{{
            this.getLocation("type") == 1 ? "百姓议事" : "乡贤参事"
          }}</span
        >
      </span> -->

      <div class="right-menu">
        <!-- <el-dropdown class="avatar-container" trigger="click"> -->

        <div class="avatar-wrapper">
          <!-- <span class="user-name" style="color: #fff;">欢迎，<span id="userName">{{realName}}</span>登录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <img :src="avatar ? avatar+'?imageView2/1/w/80/h/80' : defaultImg" class="user-avatar"> -->
          <!--            <i class="el-icon-caret-bottom" />-->
          <span style="margin-right: 15px; cursor: pointer" @click="goBack">
            <img src="@/assets/img/back.png" style="width: 1rem" />
            返回</span
          >

          <i class="el-icon-user-solid" style="margin-right: 5px"></i
          >{{ this.getName("tname") }}
        </div>
        <!-- <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link :to="{path:'/meeting', query: {index: '1'}}">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>

            <el-dropdown-item>
              <span style="display:block;" @click="editPasswordDialog = true">修改密码</span>
            </el-dropdown-item>

            <el-dropdown-item>
              <span style="display:block;" @click="logout">安全退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { queryAddres } from "@/api/login/index";
window.addEventListener('message',function(e){
  if(e.data.message=="szrhadmin"){
    this.window.open(e.data.url,e.data.message);
    this.window.close()
  }
})
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    headerSrc(){
      return `https://szrh.txtapp.cn/szrhadminweb/headerCommon?orgName=${this.getName('showName')}&userName=${this.getName('tname')}&typeName=${this.getName('type')==1?"百姓议事" : "乡贤参事"}`
    }
  },

  data() {
    var pwdCheck = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9][\w]{0,8}[a-zA-Z0-9]$/;
      value = value.trim();
      if (!value) {
        callback(new Error("密码不能为空且不能包含空格"));
      } else if (value.length < 6 || value.length > 10) {
        callback(new Error("密码不能包含空格且不能少于6位,最长10位"));
      } else if (!reg.test(value)) {
        callback(new Error("由字母,数字组成"));
      } else {
        callback();
      }
    };
    const validateOPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入旧密码"));
      } else if (this.objectOk != "ok") {
        callback(new Error("旧密码不正确"));
      } else {
        callback();
      }
    };
    const formData = {
      oldPassword: "", //旧密码
      password: "", //密码
      comfirmPassword: "", //确认密码
    };
    const formDataRules = {
      oldPassword: [
        { required: true, trigger: "blur", validator: validateOPassword },
      ],
      password: [{ required: true, trigger: "blur", validator: pwdCheck }],
      comfirmPassword: [
        { required: true, trigger: "blur", message: "确认密码不能为空" },
        {
          trigger: "blur",
          validator(rule, value, callback) {
            if (value !== formData.password) {
              callback(new Error("两次密码不一致"));
            } else {
              callback();
            }
          },
        },
      ],
    };
    return {
      defaultImg: require("@/assets/login/sjy-user.jpg"),
      objectOk: "ok",
      realName: "",
      formData,
      formDataRules,
      editPasswordDialog: false,
      addres: "",
    };
  },
  created() {
    var params = new URLSearchParams();
    params.append("paramCodeType", "FGM_RETURN_URL");
    queryAddres(params).then((res) => { 
      this.addres=res.object[0].paramCode
    });
  },
  mounted() {
    this.realName = this.GLOBAL.realName;
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      //      await this.$store.dispatch('user/logout')
      //      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$axios({
        method: "post",
        url: this.$settings.apis + "/logout",
      }).then((res) => {
        this.$router.push({ path: "/login" });
        //        if(res.data.randomNo){
        //            this.randomNo = res.data.randomNo
        //        }
        console.log(res);
      });
    },
    getName(name) {
      return sessionStorage.getItem(name);
    },
    updatePassword() {
      var params = new URLSearchParams();
      params.append("userId", this.GLOBAL.userId);
      params.append("password", this.formData.password);
      var $this = this;
      this.$refs["passwordInfoForm"].validate((valid) => {
        if (valid) {
          this.$axios({
            method: "post",
            url: this.$settings.apis + "/resetpwd",
            data: params,
          })
            .then((res) => {
              if (res.data.result == 0) {
                this.$myMessage({
                  type: "success",
                  message: "密码修改成功",
                });
                $this.closePasswordEditDia();
              }
            })
            .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closePasswordEditDia() {
      this.$refs["passwordInfoForm"].resetFields();
      this.editPasswordDialog = false;
    },
    checkpwd(value) {
      var params = new URLSearchParams();
      params.append("password", value);
      this.$axios({
        method: "post",
        url: this.$settings.apis + "/checkpwd",
        data: params,
      })
        .then((res) => {
          this.objectOk = res.object;
        })
        .catch(() => {});
    },
    goBack() {
      window.location.href = this.addres;
    },
  },
};
</script>

<style lang="scss" scoped>
.user-dropdown {
  padding: 0;
  li:hover {
    color: rgb(82, 117, 245);
    background: rgb(82, 117, 245, 0.2);
  }
}

.navbar {
  $fontSize: 1.2rem;
  overflow: hidden;
  color: #fff;
  position: relative;
  background: rgb(20, 142, 248);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .logo-container {
    display: flex;
    align-items: center;
    width: 400px;
    float: left;
    font-weight: 400;
    font-style: normal;
  }

  .logo-img {
    width: $fontSize * 1.6;
    height: $fontSize * 1.6;
    object-fit: contain;
    object-position: center center;
    vertical-align: center;
    margin-right: 0.5rem;
  }

  .title {
    font-size: $fontSize;
  }

  .right-menu {
    float: right;
    height: 100%;
    // margin-right: 1.5rem;
    // line-height: 50px;
    color: #fff;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      height: 100%;
      margin-right: 30px;

      .avatar-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
          margin-left: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
