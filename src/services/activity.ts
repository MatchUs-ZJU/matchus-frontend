import request from "./request";
import {getJWT} from "./jwt";

export const getLatestActivityInfo = async () => {
  console.log('网络请求：获取最新一期活动信息和当前用户的参与情况')
  return request.get(`/activity/info`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const getActivityInfoId = async (data) => {
  console.log('网络请求：获取最新一期活动信息')
  return request.get(`/activity/info?term=${data.term}`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const postPreJoinActivity = async (data) => {
  console.log('网络请求：加入活动预处理')
  return request.post(`/activity/join`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
}

export const postFilledOverSurvey = async (data) => {
  console.log('网络请求：用户完成问卷')
  return request.post(`/activity/survey/finish`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
}

export const getMatchResult = async (data) => {
  console.log('网络请求：获取匹配结果')
  return request.get(`/activity/match`, {
    header: {
      Authorization: getJWT(),
    },
  })
}

export const postSatisfiedFeedback = async (data) => {
  console.log('网络请求：上传匹配满意程度')
  return request.post(`/activity/match/feedback`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}

export const postFeedback = async (data) => {
  console.log('网络请求：上传匹配后反馈')
  return request.post(`/activity/match/feedback`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}

export const getFeedbackContent = async () => {
  console.log('网络请求：获取反馈问题内容')
  return request.get(`/activity/match/feedback`, {
    header: {
      Authorization: getJWT(),
    },
  })
}

export const postSendTwcResult = async (data) => {
  console.log('网络请求：发送用户双选结果')
  return request.post(`/activity/twc`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}

export const getTwcResult = async () => {
  console.log('网络请求：获取双选结果')
  return request.get(`/activity/twc`, {
    header: {
      Authorization: getJWT(),
    },
  })
}
