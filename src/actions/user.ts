import Taro from "@tarojs/taro";
import {USER_IMAGE_DELETE, USER_IMAGE_SAVE, USER_PERSONINFO_SAVE, USER_SAVE} from "@/constants";
import {
  decodePhoneNumber, delPersonalImage, getPersonalImage,
  getPersonInfo,
  getSurveyInfo,
  getUserInfo,
  identifyUserInfo,
  login, personalUserInfo, postPersonalImage, postPersonalInfo, putPersonalImage,
  register,
  updateUserInfo
} from "@/services/user";
import {removeJWT, setJWT} from "@/services/jwt";
import {
  CONSUMPTION,
  FUTURE_BASE,
  GENDER,
  GRADUATE_INCOME,
  INDUSTRY,
  INTEREST,
  TEMPERAMENT,
  TOAST_SHOW_TIME
} from "@/utils/constant";
import {deletePersonInfoImage, getTmpUrl, uploadIdentificationImage, uploadPersonInfoImage} from "@/utils/taro-utils";
import {IPhotoUrls} from "@/typings/types";
import {completeChoices} from "@/utils/fcheck";

export const userSave = (payload,saveType=USER_SAVE) => {
  return {
    type: saveType,
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
        dispatch(userSave({...res.data, receivedData: true}))
      } else {
        console.log('用户登录：从服务器获取个人信息失败')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchPersonInfo = () => {
  return async dispatch => {
    try {
      console.log('用户信息：从服务器获取用户个人信息')
      const res = await getPersonInfo()

      if(res && res.code === 0){
        if(res.data.images){
          console.log('用户信息：获得个人照片临时链接')
          const images = res.data.images
          const tmpUrl = await getTmpUrl(images)
          if(tmpUrl && tmpUrl.errMsg !== 'cloud.getTempFileURL:ok'){
            console.log('用户信息：获得个人照片临时链接失败')
          }
          const photoUrls = images.map((item,idx)=>{
            return {...item,imageUrl:tmpUrl.fileList[idx].fileID,tmpUrl:tmpUrl.fileList[idx].tempFileURL}
          })
          dispatch(userSave({images: photoUrls}))
        }

        if(res.data.personInfo){
            const completeInterest = completeChoices(res.data.personInfo.interest,INTEREST)
            const completeFutureBase = completeChoices(res.data.personInfo.futureBase,FUTURE_BASE)
            const completeTemper = completeChoices(res.data.personInfo.temperament, res.data.userInfo.gender === GENDER.MALE? TEMPERAMENT.male:TEMPERAMENT.female)
            const completeIndustry = completeChoices(res.data.personInfo.industry,INDUSTRY)
            const completeConsumption = completeChoices(res.data.personInfo.consumption,CONSUMPTION)
            const completeGraduateIncome = completeChoices(res.data.personInfo.graduateIncome,GRADUATE_INCOME)
            dispatch(userSave({
              personInfo: {...res.data.personInfo,interest:completeInterest,futureBase:completeFutureBase,temperament:completeTemper,industry:completeIndustry,consumption:completeConsumption,graduateIncome:completeGraduateIncome},
              isComplete: res.data.isComplete,
              isChangeable: res.data.isChangeable,
              isOldUser:res.data.isOldUser
            }))
          }

      }
      else{
        console.log('用户信息：从服务器获取用户个人信息失败')
      }
    } catch(e){
      console.log(e)
    }
  }
}

export const fetchSurveyInfo = () => {
  return async dispatch => {
    try {
      console.log('用户信息：从服务器获取用户填写的最新问卷信息')
      const res = await getSurveyInfo()
      if (res && res.code === 0) {
        console.log('用户信息：从服务器获取用户填写的最新问卷信息成功')
        dispatch(userSave({
          surveyInfo: res.data
        }))
      } else {
        console.log('用户信息：从服务器获取用户填写的最新问卷信息失败')
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
          title: '提交用户身份验证信息失败',
          duration: TOAST_SHOW_TIME,
        });
      }
    } catch (e) {
      await Taro.showToast({
        icon: 'none',
        title: '提交个人信息失败，请重新尝试',
        duration: TOAST_SHOW_TIME,
      });
    }
  }
}

// 单张照片上传 data:{realName,stuNum,image}
export const uploadSinglePersonalImages = async (data)=>{
  console.log("用户个人照片：提交用户个人照片")
  const uploadRes = await uploadPersonInfoImage(data.realName, data.studentNumber, data.image)
  if (uploadRes.errMsg !== 'cloud.uploadFile:ok') {
    await Taro.showToast({
      icon: 'none',
      title: '更新个人照片失败',
      duration: TOAST_SHOW_TIME,
    });
  }

  return uploadRes
}

// 多张照片上传 data:{realName,stuNum,imageS}
export const uploadMultiPersonImages = async (data) => {
  // 上传照片到云托管
  let photoUrls : IPhotoUrls[] = []
  let promisePhotos : Promise<Taro.cloud.UploadFileResult>[] = []

  data.images.forEach((item)=>{
    if(item.id) photoUrls.push(item)
    else{
      const p = uploadSinglePersonalImages({realName:data.realName,studentNumber:data.studentNumber, image:item})
      promisePhotos.push(p)
    }
  })

  await Promise.all(promisePhotos).then(res => {
    res.map(async (uploadRes)=>{
      if (uploadRes.errMsg !== 'cloud.uploadFile:ok') {
        await Taro.showToast({
          icon: 'none',
          title: '提交个人照片失败',
          duration: TOAST_SHOW_TIME,
        });
      }
      else{
        photoUrls.push({imageUrl:uploadRes.fileID,delete:false})
      }
    })
  })

  return photoUrls
}

// 单张
export const  deletePersonalImages = (data) => {
  return async dispatch => {
    console.log("用户个人照片：删除用户个人照片")
    try{
      const delRes = await deletePersonInfoImage(data.imageUrl)
      console.log('删除云文件照片')
      if(delRes.errMsg !== 'cloud.deleteFile:ok'){
        console.log("用户信息：删除用户个人照片失败")
        dispatch(userSave({...data,delete:false},USER_IMAGE_DELETE))
      }else{
        const res = await delPersonalImage(data)
        if (res && res.code === 0){
          console.log("用户信息：删除用户个人照片成功")
          dispatch(userSave(data,USER_IMAGE_DELETE))
        }
        else{
          console.log("用户信息：删除个人照片失败")
          await Taro.showToast({
            icon: 'none',
            title: '删除个人照片失败',
            duration: TOAST_SHOW_TIME,
          });
        }
      }
    } catch (e) {
      await Taro.showToast({
        icon: 'none',
        title: '删除个人照片失败，请重新尝试',
        duration: TOAST_SHOW_TIME,
      });
    }
  }

}

// 单张
export const  editPersonalImages = (data) => {
  return async dispatch => {
    console.log("用户个人照片：更新用户个人照片")
    try{
      const uploadRes = await uploadSinglePersonalImages(data)
      console.log('edit photo res',uploadRes)
      if (uploadRes.errMsg !== 'cloud.uploadFile:ok') {
        await Taro.showToast({
          icon: 'none',
          title: '更新个人照片失败',
          duration: TOAST_SHOW_TIME,
        });
      }
      else{
        const res = await putPersonalImage({...data.image,imageUrl:uploadRes.fileID})
        if (res && res.code === 0){
          console.log("用户信息：更新用户个人照片成功")
          dispatch(fetchPersonInfo())
        }
        else{
          console.log("用户信息：更新个人照片失败")
          await Taro.showToast({
            icon: 'none',
            title: '更新个人照片失败',
            duration: TOAST_SHOW_TIME,
          });
        }
      }
    } catch (e) {
      await Taro.showToast({
        icon: 'none',
        title: '更新个人照片失败，请重新尝试',
        duration: TOAST_SHOW_TIME,
      });
    }
  }

}

// 提交多张照片提交到后端 data:{realName,stuNum,imageS}
export const submitMultiPersonalImage=(data)=>{
  return async dispatch => {
    console.log("用户个人信息：提交多张用户个人照片",data)
    try {
      let images:IPhotoUrls[]
      if(data.images){
        images = await uploadMultiPersonImages(data.images)
      }
      else{
        images = []
      }

      const res = await postPersonalInfo({personInfo:null,images:[...images]})
      if (res && res.code === 0) {
        console.log("用户个人信息：提交用户个人照片成功")
        dispatch(fetchPersonInfo())

        await Taro.showToast({
          icon: 'none',
          title: '提交个人照片成功',
          duration: TOAST_SHOW_TIME,
        });
      } else if(res && res.code === 13){
        await Taro.showToast({
          icon: 'none',
          title: '已进入匹配暂时不能修改',
          duration: TOAST_SHOW_TIME,
        });
      } else {
        console.log("用户信息：提交个人照片失败")
        await Taro.showToast({
          icon: 'none',
          title: '提交个人照片失败',
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

// data: {personInfo,images{realName,stuNum,images}}
export const submitPersonalInfo=(data)=>{
  return async dispatch => {
    console.log("用户个人信息：提交用户个人信息")
    try {
      let images:IPhotoUrls[]
      if(data.images){
        images = await uploadMultiPersonImages(data.images)
      }
      else{
        images = []
      }

      const res = await postPersonalInfo({personInfo:data.personInfo,images:[...images]})
      if (res && res.code === 0) {
        console.log("用户个人信息：提交用户个人信息成功")
        // if(!data.images){
        //   dispatch(userSave({personInfo:data.personInfo},USER_PERSONINFO_SAVE))
        //
        // } else{
        //   dispatch(fetchPersonInfo())
        // }
        dispatch(fetchPersonInfo())

        await Taro.showToast({
          icon: 'none',
          title: '提交个人信息成功',
          duration: TOAST_SHOW_TIME,
        });

      } else if(res && res.code === 13){
        await Taro.showToast({
          icon: 'none',
          title: '已进入匹配暂时无法修改',
          duration: TOAST_SHOW_TIME,
        });
      } else {
        console.log("用户信息：提交个人信息失败")
        await Taro.showToast({
          icon: 'none',
          title: '提交个人信息失败',
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
