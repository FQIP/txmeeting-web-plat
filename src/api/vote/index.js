import request from "@/utils/request";

//投票汇总查询
export function queryVoteStatistics(data) {
  return request({
    url: "/topicVote/querySummary",
    method: "post",
    data,
  });
}

//投票汇总线下证明下载
export function downLoadAllFiles(data) {
  return request({
    url: "/topicVote/downLoadAllFiles",
    method: "post",
    data,
    responseType:"blob"
  });
}
// 投票汇总提交/保存
export function saveSummary(data) {
  return request({
    url: "/topicVote/saveSummary",
    method: "post",
    data,
  });
}
