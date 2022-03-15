// TODO 思考接入多个学校以后接口设计
import request from "./request";
import {getJWT} from "./jwt";

export const getFaculties = async () => {
  console.log('网络请求：获取院系信息')
  return await request.get(`/faculty/getAll`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const getHelpsInfo = async () => {
  console.log('网络请求：获取帮助信息')
  return await request.get(`/help`, {
    header: {
      Authorization: getJWT(),
    },
  });
}
