import request from "@/utils/request";
import { object2FormData } from "@/utils/utils.js";

/**
 * 议题数量
 */
export async function queryOrgTopicNum(orgId) {
  const { object } = await request({
    url: `/statistics/orgTopicNum/${orgId}`,
    method: "post",
  });
  return object || [];
}

/**
 * 议题分析
 */
export async function orgTopicGroupByMonth(data) {
  const { object } = await request({
    url: `/statistics/orgTopicGroupByMonth`,
    method: "post",
    data: object2FormData(data),
  });
  return object || [];
}

/**
 * 议题类型分析
 */
export async function orgTopicGroupByType(data) {
  const { object } = await request({
    url: `/statistics/orgTopicGroupByType`,
    method: "post",
    data: object2FormData(data),
  });
  return object || [];
}
