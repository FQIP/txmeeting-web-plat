import request from "@/utils/request";

export function addTopicAdvice(data) {
  return request({
    url: "/topicAdviceManage/addTopicAdvice",
    method: "post",
    data,
  });
}

export function getTree(data) {
  return request({
    url: "/organizationManage/getTree",
    method: "post",
    data,
  });
}
export function getAllUser(data) {
  return request({
    url: "/organizationManage/getAllUser",
    method: "post",
    data,
  });
}
export function queryPageSelective(data) {
  return request({
    url: "/averageUserManage/queryPageSelective",
    method: "post",
    data,
  });
}
export function queryAllSelective(data) {
  return request({
    url: "/averageUserManage/queryAllSelective",
    method: "post",
    data,
  });
}
