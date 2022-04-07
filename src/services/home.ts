import request from "./request";
import {getJWT} from "./jwt";

export const getBanners = async () => {
  console.log('网络请求：获取广告')
  return await request.get(`/banners`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const getRecommends = async () => {
  console.log('网络请求：获取推荐文章')
  return request.get(`/recommends`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const getHomeData = async () => {
  console.log('网络请求：获取推荐文章')
  return request.get(`/activity/data`, {
    header: {
      Authorization: getJWT(),
    },
  });
}
