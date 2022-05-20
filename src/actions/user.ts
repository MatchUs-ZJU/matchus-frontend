import Taro from "@tarojs/taro";
import {USER_SAVE} from "@/constants";
import {decodePhoneNumber, getUserInfo, identifyUserInfo, login, register, updateUserInfo} from "@/services/user";
import {removeJWT, setJWT} from "@/services/jwt";
import {TOAST_SHOW_TIME} from "@/utils/constant";
import {CLOUD_ENV} from "@/config";
import {uploadIdentificationImage} from "@/utils/taro-utils";

export const userSave = (payload) => {
  return {
    type: USER_SAVE,
    payload
  }
}

export const fetchUserInfo = () => {
  return async dispatch => {
    try {
      console.log('用户登录：从服务器获取用户信息')
      const res = await getUserInfo()
      if (res && res.code === 0) {
        console.log('用户登录：获取用户信息成功')
        dispatch(userSave(res.data))
      } else {
        console.log('用户登录：从服务器获取个人信息失败')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 初始化进入小程序的用户数据
export const initRegister = (openid) => {
  return async dispatch => {
    console.log("用户注册：初始化进入小程序的用户，完成注册工作")
    try {
      const res = await register({
        'openid': openid
      })

      if (res && res.code === 0) {
        console.log("用户注册：注册成功")
        dispatch(userSave({
          binded: true
        }))
      } else {
        console.log("用户注册：注册失败")
      }
    } catch (e) {
      console.log(e)
      await Taro.showToast({
        icon: 'none',
        title: '注册失败，请稍后再试',
        duration: 5000,
      });

      setTimeout(async () => {
        await Taro.exitMiniProgram()
      }, 3000)
    }
  }
}

export const fetchUserProfile = () => {
  return dispatch => {
    console.log("用户注册：授权获取个人信息并更新用户信息")
    // 该方法暂时不支持await异步调用
    Taro.getUserProfile({
      desc: "用于完善您的个人资料",
    }).then(async (e) => {
      const {userInfo} = e
      const res = await updateUserInfo({
        ...userInfo,
      })

      if (res && res.code === 0) {
        console.log("用户注册：更新用户信息成功")
        dispatch(userSave(userInfo))

        // 完成注册工作
        await Taro.navigateTo({
          url: '/pages/user/register/index'
        })
      } else {
        console.log("用户注册：更新用户信息失败")
      }
    }).catch(async () => {
      console.log("用户注册：用户拒绝授权")
      await Taro.showToast({
        icon: 'none',
        title: '授权失败! 您将无法参加我们的活动',
        duration: 5000,
      });
    })
  }
}

export const relogin = (func = () => {}) => {
  return async dispatch => {
    removeJWT()

    try {
      console.log("用户登录：用户重新登录")
      const res = await Taro.login()
      if (res.code) {
        console.log('用户登录：小程序登录成功，向服务器发送登录请求')
        let resp = await login({
          code: res.code
        })

        if (resp && resp.code === 0) {
          console.log('用户登录：向服务器发送登录请求成功，存储登录状态')
          dispatch(userSave({...resp.data, login: true}))
          setJWT(resp.data.token)

          if (resp.data.binded) {
            // 用户已经注册，直接获取个人信息
            console.log('用户登录：登录用户已经绑定个人信息')
            dispatch(fetchUserInfo())
          } else {
            console.log('用户登录：登录用户未注册和绑定信息，进行初始化注册')
            dispatch(initRegister(resp.data.openid))
          }
          // 执行后续逻辑
          func()
        } else {
          console.log('用户登录：向服务器发送登录请求失败')
        }
      } else {
        console.log('用户登录：小程序登录失败')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchPhoneNumber = (data: {iv: string, encryptedData: string, sessionKey: string}) => {
  return async dispatch => {
    console.log("用户信息：获取用户解密的手机号")
    try {
      const res = await decodePhoneNumber(data)
      if (res && res.code === 0) {
        console.log("用户信息：获取用户解密的手机号成功")
        dispatch(userSave(res.data))
      } else {
        console.log("用户信息：获取用户解密的手机号失败")
      }
    } catch (e) {
      console.log(e)
      await Taro.showToast({
        icon: 'none',
        title: '获取手机号失败',
        duration: 5000,
      });
    }
  }
}

export const submitIdentificationInfo = (data) => {
  return async dispatch => {
    console.log("用户信息：提交用户身份验证信息")
    try {
      // 上传照片到云托管
      console.log(data)
      const uploadRes = await uploadIdentificationImage(data.realName, data.studentNumber, data.imageFile.url)
      if(uploadRes.errMsg !== 'cloud.uploadFile:ok') {
        console.log("用户信息：提交用户身份验证照片到云托管失败")
        await Taro.showToast({
          icon: 'none',
          title: '提交身份认证照片失败',
          duration: TOAST_SHOW_TIME,
        });
        return
      }

      console.log("用户信息：提交用户身份验证照片到云托管成功")
      // 提交认证信息
      const res = await identifyUserInfo({
        ...data,
        faculty: data.facultyId, // faculty这里传的是id，不是名字
        material: uploadRes.fileID
      })
      if (res && res.code === 0) {
        console.log("用户信息：提交用户身份验证信息成功")
        dispatch(userSave({
          ...data,
          identified: '认证中'
        }))
        await Taro.showToast({
          icon: 'none',
          title: '提交身份信息成功',
          duration: TOAST_SHOW_TIME,
        });
        await Taro.switchTab({
          url: '/pages/activity/index/index'
        })
      } else {
        console.log("用户信息：提交用户身份验证信息失败")
        await Taro.showToast({
          icon: 'none',
          title: res.msg,
          duration: TOAST_SHOW_TIME,
        });
      }
    } catch (e) {
      console.log(e)
      await Taro.showToast({
        icon: 'none',
        title: '提交个人信息失败，请重新尝试',
        duration: TOAST_SHOW_TIME,
      });
    }
  }
}
