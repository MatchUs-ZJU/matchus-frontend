import Taro from "@tarojs/taro";
import {BASE_URL} from "@/config";
import request from "./request";
import {getJWT} from "./jwt";

export const getUserInfo = async () => {
  console.log('网络请求：获取用户信息')
  return request.get(`/user/info`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const updateUserInfo = async (data) => {
  console.log('网络请求：更新用户信息')
  return request.post(`/user/info`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
};

export const identifyUserInfo = async (data) => {
  console.log('网络请求：上传用户身份验证')
  return request.post(`/user/identify`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}

export const uploadIdentificationImages = async (data) => {
  console.log('网络请求：上传用户身份识别照片')
  return Taro.uploadFile({
    url: `${BASE_URL}/user/identify/upload`,
    filePath: data.filePath,
    name: data.name,
    header: {
      Authorization: getJWT(),
    }
  })
}

export const login = async (data) => {
  console.log('网络请求：用户登录')
  return request.post(`/user/login`, {
    data,
  });
};

export const logout = async (data) => {
  console.log('网络请求：用户登出')
  return request.post(`/user/logout?id=${data.id}`, {
    header: {
      Authorization: getJWT(),
    },
  });
};

export const register = async (data) => {
  console.log('网络请求：用户注册')
  return request.post(`/user/register`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
};

export const decodePhoneNumber = async (data) => {
  console.log('网络请求：获取用户手机号')
  return request.post(`/user/phone`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
};

export const getSurveyInfo = async () => {
  console.log('网络请求：获取用户填写的问卷信息')
  return request.get(`/user/survey`, {
    header: {
      Authorization: getJWT(),
    },
  });
}
