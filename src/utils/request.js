import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getSessionStorage, setSessionStorage } from "@/utils/auth";

axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8"; // 设置header头
axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest"; // 设置header头
axios.defaults.baseURL = "/"; // 配置接口地址

// 获取token
export async function fetchToken() {
  let params = new URLSearchParams();
  params.append("userId", sessionStorage.getItem("userId"));
  params.append("type", sessionStorage.getItem("type"));
  const { object } = await service({
    method: "post",
    url: "/fetchLogin",
    data: params,
  });
  return object.token;
}
let firstInvalidTimestamp = 0;
let fetchTokenPromise = null;
// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
  baseURL: process.env.VUE_APP_BASE_API,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   // config.headers['accessToken'] = getToken()
    //   config.headers['accessToken'] = getToken()
    // }
    config.headers["accessToken"] = getSessionStorage();
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response;
    // if (res.data.result == 401 || typeof getToken() == "undefined") {
    //   return new Promise((resolve) => {
    //     // let temp = res.config;
    //     // let params = new URLSearchParams();
    //     // params.append("phone", 13564251245);
    //     // axios({
    //     //   method: "post",
    //     //   url: process.env.VUE_APP_BASE_API + "/fetchLogin",
    //     //   data: params,
    //     // }).then((res) => {
    //     //   setToken(res.object.token);
    //     //   temp.headers["accessToken"] =  getToken();
    //     //   axios(temp).then((res) => {
    //     //     resolve(res);
    //     //   });
    //     // });
    //     async function check() {
    //       let temp = res.config;
    //       let params = new URLSearchParams();
    //       params.append("userId",  sessionStorage.getItem('userId'));
    //       let obj = await axios({
    //         method: "post",
    //         url: process.env.VUE_APP_BASE_API + "/fetchLogin",
    //         data: params,
    //       });
    //       setToken(obj.object.token);
    //       temp.headers["accessToken"] = getToken();
    //       return axios(temp);
    //     }
    //      resolve(check());
    //   });
    // }
    const { data, config } = response;
    if (data.result == 401|| process.env.NODE_ENV === "development" && data.result === 500) {
      /*
        记录并发请求中的第一个返回401的时间戳
        如果上一次请求时token失效的时间和再次请求成功的时间间隔超过5分钟，
        就认为token失效时发出的所有请求都已经得到正常响应了，
        这就需要对firstInvalidTimestamp、fetchTokenPromise置为初始值。
      */
      if (Date.now() - firstInvalidTimestamp > 1 * 60 * 1000) {
        firstInvalidTimestamp = Date.now();
        fetchTokenPromise = fetchToken();
      }
      return new Promise(async (resolve) => {
        try {
          const token = await fetchTokenPromise;
          setSessionStorage(token);
          config.headers["accessToken"] = getSessionStorage();
          resolve(service(config));
        } catch (err) {
          console.log(err);
          fetchTokenPromise = null;
        }
      });
    }
    if (res.status !== 200) {
      Message({
        message: res.message || "请求异常",
        type: "error",
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      return Promise.reject(new Error(res.message || "请求异常"));
    } else {
      if (!data.success && data.resultMsg) {
        Message({
          message: data.resultMsg,
          type: "error",
        });
      }
      return data;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
