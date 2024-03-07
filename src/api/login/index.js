import request from "@/utils/request";

export function thirdLogin(data) {
  return request({
    url: "/thirdLogin",
    method: "post",
    data,
  });
}
export function apiLogin(data) {
  return request({
    url: "/api/login",
    method: "post",
    data,
  });
}
export function queryAddres(data) {
  return request({
    url: "/dic/queryList",
    method: "post",
    data,
  });
}