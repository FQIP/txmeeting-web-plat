import request from "@/utils/request";

// 删除议题
export function deleteTopicById(topicId) {
  return request({
    url: "/topicManage/deleteTopicById?topicId=" + topicId,
    method: "get",
  });
}

export function queryTopic(data) {
  return request({
    url: "/topicManage/queryTopic",
    method: "post",
    data,
  });
}
// 结束会议
export function endMeeting(data) {
  return request({
    url: "/meeting/endMeeting",
    method: "POST",
    data,
  });
}
// 下载意见
export function downloadAdvice(id) {
  return request({
    url: "/exportManage/downloadAdvice?topicId=" + id,
    method: "get",
    responseType: 'blob'
  });
}
// 下载会议材料
export function downloadTopicFile(id) {
  return request({
    url: "/topicManage/downloadTopicFile?topicId=" + id,
    method: "get",
    responseType: 'blob'
  });
}
// 下载发布议题的材料
export function downTopicAdviceFiles(id) {
  return request({
    url: "/topicAdviceManage/downTopicAdviceFiles?topicId=" + id,
    method: "get",
    responseType: 'blob'
  });
}

// 查询议题详情(多个不同的请求)

// 议题和征集意见展示
export function queryAdviceByTopicId(data) {
  return request({
    url: "/topicAdviceManage/queryAdviceByTopicId",
    method: "post",
    data,
  });
}
// 查看参会人表格
export function queryConfirmPage(data) {
  return request({
    url: "/meeting/queryConfirmPage",
    method: "post",
    data,
  });
}
// 视频邀请链接
export function getVcfMeetingUrl(data) {
  return request({
    url: "/meeting/getVcfMeetingUrl",
    method: "post",
    data,
  });
}
// 获取进入的视频邀请链接
export function getUserMeetingUrl(data) {
  return request({
    url: "/meeting/getUserMeetingUrl",
    method: "post",
    data,
  });
}
// 获取进入的视频回放链接
export function getMeetingVideoUrl(data) {
  return request({
    url: "/meeting/getMeetingVideoUrl",
    method: "post",
    data,
  });
}

// 查询某个会议的参会确认列表
export function queryConfirmsByMeeting(data) {
  return request({
    url: "/meeting/queryConfirmsByMeeting",
    method: "post",
    data,
  });
}
// 参会确认
export function confrimMeeting(data) {
  return request({
    url: "/meeting/confrim",
    method: "post",
    data,
  });
}
// 查询议题详情
export function queryTopicById(data) {
  return request({
    url: "/topicManage/queryTopicById",
    method: "post",
    data,
  });
}