import request from "@/utils/request";
import { object2FormData } from "@/utils/utils.js";

/**
 * 获取组织结构树和用户
 */
export async function orgnizationTree(data) {
  const { object } = await request({
    url: `/organizationManage/getTree`,
    method: "post",
    data: object2FormData({ ...data }),
  });
  const { org, people } = object || {};
  let orgArr=[],peopleArr=[]
  if (Array.isArray(org) && org.length > 0) {
    orgArr= org.map((item) => {
      Object.assign(item, {
        showName: item.name,
        isOrg: true,
      });
      return item;
    });
  } 
   if (Array.isArray(people) && people.length > 0) {
    peopleArr=people.map((item) => {
      Object.assign(item, {
        showName: item.username,
        isPeople: true,
      });
      return item;
    });
  }
  return [...orgArr,...peopleArr]
}

/**
 * 参会对象获取分页人员
 */
export async function queryPeoples(data) {
  let { object } = await request({
    url: `/averageUserManage/queryPageSelective`,
    method: "post",
    data,
  });
  object = object || {};
  (object.result || []).map((user) => {
    user.isPeople = true;
    user.showName = user.username;
    return user;
  });
  return object;
}
export async function countTreeSelect(data) {
  let { object } = await request({
    url: `/averageUserManage/countTreeSelect`,
    method: "post",
    data,
  });
  object = object || 0;
  return object;
}
/**
 * 全选获取人员
 */
export async function orgnizationAllPeoples(data) {
  const { object } = await request({
    url: `/averageUserManage/queryAllSelective`,
    method: "post",
    data: object2FormData(data),
  });
  return object || [];
}

/**
 * 标签列表
 */
export async function queryTags(data) {
  const { object } = await request({
    url: `/dic/queryTypeTagList`,
    method: "post",
    data:object2FormData(data),
  });
  return object || [];
}
