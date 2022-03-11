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

