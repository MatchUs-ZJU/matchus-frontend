import Taro from "@tarojs/taro";
import {USER_LOGOUT, USER_SAVE} from "../constants";
import {getUserInfo, register} from "../services/user";

export const logout = () => {
  return {
    type: USER_LOGOUT
  }
}

export const userSave = (payload) => {
  return {
    type: USER_SAVE,
    payload
  }
}

export const fetchUserInfo = () => {
  return dispatch => {
    console.log('用户登录：从服务器获取用户信息')
    getUserInfo()
      .then((res) => {
        if (res) {
          console.log('用户登录：获取用户信息成功')
          dispatch(userSave(res))
        } else {
          console.log('用户登录：从服务器获取个人信息失败')
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

export const userRegister = (openid) => {
  return dispatch => {
    console.log("用户注册：授权获取个人信息并完成注册")
    // 该方法暂时不支持await异步调用
    Taro.getUserProfile({
      desc: "用于完善您的个人资料",
    }).then(async (res) => {
      const {userInfo} = res
      // store user info
      dispatch(userSave(userInfo))

      // register
      await register({
        ...userInfo,
        'openid': openid
      })
    }).catch(async e => {
      console.log(e)
      await Taro.showToast({
        icon: 'none',
        title: '授权失败! 您将无法参加我们的活动',
        duration: 5000,
      });
    })
  }
}
