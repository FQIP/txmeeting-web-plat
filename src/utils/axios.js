/**
 * Created by 63446 on 2019/8/5.
 */

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from "@/router/index"

// http request 拦截器
axios.interceptors.request.use(
  config => {

    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    const requestURL = response.config.url;
    const responseURL = response.request.responseURL;
    if(responseURL.indexOf(requestURL)== -1){ //说明登录超时，请求重定向了
      router.push({ path: '/login' })
    }else {
      return response;
    }
  },
  error => {
    // Message.closeAll();
    // debugger;
    // Message({
    //   type: 'error',
    //   message: error.message
    // });
    // router.push({ path: '/login' })
  });
export default axios
