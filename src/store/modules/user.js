import {getSessionStorageInfo} from "@/utils/auth"
const state = {
  orgInfo: {
    id: getSessionStorageInfo('orgId'),
    showName: getSessionStorageInfo('showName'),
  },
  topicType:getSessionStorageInfo('topicType')
};


const mutations = {
  SET_ORG_INFO(state, payload) {
    state.orgInfo = payload;
  },
  SET_TOPIC_TYPE(state, topicType) {
    state.topicType = topicType;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
