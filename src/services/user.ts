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

export const getUserNeedUpdate = async () => {
  console.log('网络请求：获取用户是否更新')
  return request.get(`/user/needUpdate`,{
    header: {
      Authorization: getJWT(),
    }
  })
}

export const postUserNeedNotify = async ()=>{
  console.log('网络请求：通知已读')
  const data = {success:true}
  return request.post(`/user/notify`,{
    data,
    header: {
      Authorization: getJWT(),
    }
  })
}

export const updateUserAvatar = async (data) =>{
  console.log('网络请求：更新用户头像')
  return request.post(`/user/avatar`,{
    data,
    header:{
      Authorization: getJWT()
    }
  })
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

export const updateUserFaculty = async (data) => {
  console.log('网络请求：更新用户学院',data)
  return request.post(`/user/faculty`,{
    data,
    header: {
      Authorization: getJWT()
    }
  })
}

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

export const getPersonalImage = async () =>{
  console.log('网络请求：请求用户个人照片')
  return request.get(`/user/images`,{
    header:{
      Authorization: getJWT()
    }
  })
}

export const postPersonalImage = async (data) => {
  console.log('网络请求：上传用户个人照片',data)
  return request.post(`/user/images`,{
    data,
    header:{
      Authorization: getJWT()
    }
  })
}

export const putPersonalImage = async (data) => {
  console.log('网络请求：更改用户个人照片',data)
  return request.put(`/user/images`,{
    data,
    header:{
      Authorization: getJWT()
    }
  })
}

export const delPersonalImage = async (data) => {
  console.log('网络请求：删除用户个人照片')
  return request.delete(`/user/images`,{
    data,
    header:{
      Authorization: getJWT()
    }
  })
}


export const postPersonalInfo = async (data)=>{
  console.log('网络请求：上传用户个人信息')
  return request.post(`/user/personInfo`,{
    data,
    header:{
      Authorization: getJWT()
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

export const getSurveyDetail = async () => {
  console.log('网络请求：获取可编辑用户匹配问卷')
  return request.get(`/activity/matchRequest`,{
    header: {
      Authorization: getJWT()
    }
  })
}

export const postSurveyDetail = async (data) => {
  console.log('网络请求：编辑问卷信息')
  return request.post(`/activity/matchRequest`,{
    data,
    header: {
      Authorization: getJWT()
    }
  })
}

export const getPersonInfo = async ()=>{
  console.log('网络请求：获取用户个人信息')
  return request.get(`/user/personInfo`,{
    header: {
      Authorization: getJWT()
    }
  })
}
