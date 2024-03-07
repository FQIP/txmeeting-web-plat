import request from "@/utils/request";

//形成纪要
export function summaryManageSave(data) {
  return request({
    url: "/summaryManage/saveSummary",
    method: "post",
    data,
  });
}
//会议纪要查询
export function querySummary(data) {
  return request({
    url: "/topicManage/meeting/summary",
    method: "post",
    data
  });
}
//会议纪要下载
export function downloadSummary(data) {
  return request({
    url: "/topicManage/downloadSummary",
    method: "post",
    data,
    responseType:"blob"
  });
}


