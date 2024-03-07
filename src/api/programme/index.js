import request from "@/utils/request";

export function queryLabelList() {
  return request({
    url: "/dic/queryLabelList",
    method: "post"
  });
}
export function queryList(data) {
  return request({
    url: "/dic/queryList",
    method: "post",
    data
  });
}
export function queryTopicTypeList(data) {
  return request({
    url: "/dic/queryTopicTypeList",
    method: "post",
    data
  });
}
// 会议通知
export function createScheme(data) {
  return request({
    url: "/scheme/createScheme",
    method: "post",
    data,
  });
}
// 查询方案
export function queryScheme(data) {
  return request({
    url: "/scheme/queryScheme",
    method: "post",
    data,
  });
}
// 修改会议
export function updateScheme(data) {
  return request({
    url: "/scheme/updateScheme",
    method: "post",
    data,
  });
}
// 会中发起投票
export function initiateVote(data) {
  return request({
    url: "/topicVote/initiateVote",
    method: "post",
    data,
  });
}
// 会中发起投票查询
export function queryVoteInfo(data) {
  return request({
    url: "/topicVote/queryVoteInfo",
    method: "post",
    data,
  });
}



