<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in menu"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
      <div class="open-menu" @click="openMenu">
        <i class="el-icon el-icon-arrow-right"></i>
        <!-- 这里建议修改图标 -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
// import routerArr from "@/router/index.js";
export default {
  components: { SidebarItem, Logo },
  inject: ["updateLayoutShowBlink"],
  data() {
    return {
      collapse: true,
      menu: [
        {
          path: "/myTopics",
          name: "myTopics",
          component: () => import("@/views/myTopics/index"),
          meta: { title: "我的议题", icon: "el-icon-s-management" },
        },
        {
          path: "/publishTopics",
          name: "publishTopics",
          component: () => import("@/views/publishTopics/index"),
          meta: { title: "发起议题", icon: "el-icon-edit-outline" },
        },
        {
          path: "/statisticalAnalysis",
          name: "statisticalAnalysis",
          component: () => import("@/views/StatisticalAnalysis/index.vue"),
          meta: { title: "统计分析", icon: "el-icon-s-data" },
        },
      ],
    };
  },
  mounted() {
    console.log(this.$route);
  },
  computed: {
    ...mapGetters(["sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    setAllHidden(sett) {
      for (const item of sett) {
        item.hidden = true;
        if (Array.isArray(item.children)) {
          this.setAllHidden(item.children);
        }
      }
    },
    updateShowBlink(status) {
      if (typeof this.updateLayoutShowBlink) {
        this.updateLayoutShowBlink(status);
      }
    },
    openMenu() {
      this.$store.state.app.sidebar.opened =
        !this.$store.state.app.sidebar.opened;
    },
    initMenu(menu, list) {
      console.log("现在菜单是：" + menu);
      if (!list.sort) {
        list.sort = 0;
      }
      if (list.path == menu.url || list.path == "/" + menu.url) {
        list.meta.title = menu.menuName ?? "";
        list.meta.iconfont = menu.pic;
        list.hidden = false;
        const children = menu.children;
        if (Array.isArray(children) && children.length <= 0) {
          // 有children且children为数组代表这玩意是父菜单，但是长度为0，所以也给它隐藏起来
          list.hidden = true;
        }
        list.sort = menu.sort;
        list.alwaysShow = true;
      }

      var children = menu.children;
      var child = list.children;
      if (
        children != null &&
        children != undefined &&
        children.length > 0 &&
        child
      ) {
        for (var k = 0; k < children.length; k++) {
          if (!children[k].sort) {
            children[k] = 0;
          }
          for (var j = 0; j < child.length; j++) {
            if (
              children[k].url == child[j].path ||
              "/" + children[k].url == child[j].path ||
              children[k].url == "/" + child[j].path
            ) {
              child[j].hidden = false;
              child[j].meta.title = children[k].menuName;
              child[j].meta.iconfont = children[k].pic;
              child[j].sort = children[k].sort;
              list.hidden = false; //子节点如果显示，则父节点也显示
              list.alwaysShow = true;
              break;
            }
          }
          var secondChildren = children[k].children;
          if (secondChildren && secondChildren.length > 0) {
            this.initMenu(children[k], secondChildren);
          }
        }
      } else if (child) {
        var c = child;
        if (c) {
          for (var k = 0; k < c.length; k++) {
            if (!c[k].sort) {
              c[k].sort = 0;
            }
            if (c[k].path == menu.url || c[k].path == "/" + menu.url) {
              c[k].hidden = false;
              c[k].meta.title = menu.menuName;
              c[k].meta.iconfont = menu.pic;
              c[k].sort = menu.sort;
              list.hidden = false; //子节点如果显示，则父节点也显示

              break;
            }
            var secondChildren = c[k].children;
            if (secondChildren && secondChildren.length > 0) {
              this.initMenu(menu, secondChildren);
            }
          }
        }
      }
    },
    sortList(settingList) {
      settingList.sort(this.compare("sort"));
      var menuList = [];
      for (var i = 0; i < settingList.length; i++) {
        var menu = settingList[i];
        var children = menu.children;
        if (children && children.length > 0) {
          this.sortList(children);
        }
      }
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        if (!value1) {
          value1 = 0;
        }
        var value2 = b[property];
        if (!value2) {
          value2 = 0;
        }
        return value1 - value2;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.open-menu {
  position: absolute;
  top: 48%;
  left: 64px;
  width: 16px;
  height: 44px;
  background: #e0e6ec;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  transition: all 0.3s;
  &:before,
  &:after {
    content: "";
    display: inline-block;
    position: absolute;
    left: 0;
    width: 0;
    height: 0;
    border: 16px solid transparent;
  }
  &:before {
    top: -16px;
    border-left-color: #e0e6ec;
    transform: skew(0, -19deg);
  }
  &:after {
    bottom: -16px;
    border-left-color: #e0e6ec;
    transform: skew(0, 19deg);
  }
  .el-icon {
    color: #aaacad;
    font-size: 20px;
  }
  // .iconfont {
  //   transform: rotate(180deg);
  // }
}
</style>
