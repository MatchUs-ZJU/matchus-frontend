import {USER_LOGOUT, USER_SAVE} from "../constants";
import {getUserInfo, register} from "../services/user";
import Taro from "_@tarojs_taro@3.4.1@@tarojs/taro";

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
  return async dispatch => {
    try {
      console.log("用户注册：授权获取个人信息并完成注册")
      const {userInfo} = await Taro.getUserInfo()
      // store user info
      dispatch(userSave(userInfo))

      // register
      await register({
        ...userInfo,
        'openid': openid
      })
    } catch (e) {
      Taro.showToast({
        icon: 'none',
        title: '授权失败! 您将无法参加我们的活动',
        duration: 5000,
      });
    }
  }
}
