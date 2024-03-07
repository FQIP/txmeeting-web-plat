import Vue from 'vue'

import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import settings from '@/store/modules/settings'
import axios from "axios"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/404','example','/myTopics'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  let hasToken;

  // axios({
  //   method: 'post',
  //   url:settings.apis+"/fetchLogin"
  // }).then((res)=>{
  //   hasToken = res.data.username
  //   // console.log("fetchLogin",res)
  //   if (hasToken) {
  //     Vue.prototype.GLOBAL.userId = res.data.userId;
  //     Vue.prototype.GLOBAL.userName = res.data.username;
  //     Vue.prototype.GLOBAL.realName = res.data.realName;
  //     Vue.prototype.GLOBAL.userType = res.data.userType;
  //     Vue.prototype.GLOBAL.tenantId = res.data.tenantId;
  //     next()
  //   } else {
  //     /* has no token*/
  //     Vue.prototype.GLOBAL.userId = null;
  //     Vue.prototype.GLOBAL.userName = null;
  //     Vue.prototype.GLOBAL.realName = null;
  //     Vue.prototype.GLOBAL.userType = null;
  //     Vue.prototype.GLOBAL.tenantId = null;
  //     if (whiteList.indexOf(to.path) !== -1) {
  //       // in the free login whitelist, go directly
  //       next()
  //     } else {
  //       // other pages that do not have permission to access are redirected to the login page.
  //       next(`/login`)
  //       // window.location.href = SETTINGS.apis+'/loginPage'
  //       NProgress.done()
  //     }
  //   }
  // })
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
