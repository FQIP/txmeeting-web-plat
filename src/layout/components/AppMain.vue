<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /*3.4rem = navbar  */
  $navbarHeight: 3.4rem;
  $leftPadding: 0.7rem;
  $bottomPadding: 26px;
  $topPadding: $navbarHeight + $leftPadding;
  min-height: calc(
    100vh - #{$navbarHeight} - #{$leftPadding} - #{$bottomPadding}
  );
  /* margin: 3.4rem 0.7rem 0; */
  /* margin-top: 3.4rem; */
  width: calc(100vw - 200px - 2rem);
  /* padding-top: 0.7rem; */
  padding-top: $topPadding;
  padding-left: 0;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  margin-top: 3.4rem;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
