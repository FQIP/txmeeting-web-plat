import Vue from 'vue'
import "dayjs/locale/zh-cn" //将dayjs的时间设为国区

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import moment from 'moment'//导入文件
moment.locale('zh-cn');//需要汉化
Vue.prototype.$moment = moment;
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import localeZh  from'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import '@/assets/font/iconfont.css'; // iconfont
import '@/styles/reset.css';

import axios from "@/utils/axios";
import settings from '@/store/modules/settings';

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
axios.defaults.withCredentials = true
Vue.prototype.GLOBAL = {};

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$settings = settings
Vue.prototype.$myMessage = Option => {
  Vue.prototype.$message.closeAll();
  Vue.prototype.$message(Option);
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
