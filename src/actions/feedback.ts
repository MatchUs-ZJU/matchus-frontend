import Taro from "@tarojs/taro";
import { USER_IMAGE_DELETE, USER_IMAGE_SAVE, USER_PERSONINFO_SAVE, USER_SAVE } from "@/constants";
import {
  decodePhoneNumber, delPersonalImage, getPersonalImage,
  getPersonInfo, getSurveyDetail,
  getSurveyInfo,
  getUserInfo, getUserNeedUpdate,
  identifyUserInfo,
  login, personalUserInfo, postPersonalImage, postPersonalInfo, postSurveyDetail, postUserNeedNotify, putPersonalImage,
  register, updateUserAvatar, updateUserFaculty,
  updateUserInfo, getVoucherReadInfo
} from "@/services/user";
import { removeJWT, setJWT } from "@/services/jwt";
import {
  CONSUMPTION,
  FUTURE_BASE,
  GENDER,
  GRADUATE_INCOME,
  INDUSTRY,
  INTEREST, QUESTION_TYPE,
  TEMPERAMENT,
  TOAST_SHOW_TIME
} from "@/utils/constant";
import {
  deletePersonInfoImage,
  uploadIdentificationImage,
  uploadPersonInfoImage,
  uploadUserAvatar
} from "@/utils/taro-utils";
import { IPhotoUrls } from "@/typings/types";
import { completeChoices, generateProperAnswer } from "@/utils/fcheck";
import { saveVoucherReadInfo } from "@/actions/activity"

export const userSave = (payload, saveType = USER_SAVE) => {
  return {
    type: saveType,
    payload
  }
}

// 单张照片上传 data:{realName,stuNum,image}
export const uploadSinglePersonalImages = async (data) => {
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
  let photoUrls: IPhotoUrls[] = []
  let promisePhotos: Promise<Taro.cloud.UploadFileResult>[] = []

  data.images.forEach((item) => {
    if (item.id) photoUrls.push(item)
    else {
      const p = uploadSinglePersonalImages({ realName: data.realName, studentNumber: data.studentNumber, image: item })
      promisePhotos.push(p)
    }
  })

  await Promise.all(promisePhotos).then(res => {
    res.map(async (uploadRes) => {
      if (uploadRes.errMsg !== 'cloud.uploadFile:ok') {
        await Taro.showToast({
          icon: 'none',
          title: '提交个人照片失败',
          duration: TOAST_SHOW_TIME,
        });
      }
      else {
        photoUrls.push({ imageUrl: uploadRes.fileID, delete: false })
      }
    })
  })

  return photoUrls
}
 
// 单张
export const deletePersonalImages = (data) => {
  return async dispatch => {
    console.log("用户个人照片：删除用户个人照片")
    try {
      const delRes = await deletePersonInfoImage(data.imageUrl)
      console.log('删除云文件照片')
      if (delRes.errMsg !== 'cloud.deleteFile:ok') {
        console.log("用户信息：删除用户个人照片失败")
        dispatch(userSave({ ...data, delete: false }, USER_IMAGE_DELETE))
      } else {
        const res = await delPersonalImage(data)
        if (res && res.code === 0) {
          console.log("用户信息：删除用户个人照片成功")
          dispatch(userSave(data, USER_IMAGE_DELETE))
        }
        else {
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
export const editPersonalImages = (data) => {
  return async dispatch => {
    console.log("用户个人照片：更新用户个人照片")
    try {
      const uploadRes = await uploadSinglePersonalImages(data)
      console.log('edit photo res', uploadRes)
      if (uploadRes.errMsg !== 'cloud.uploadFile:ok') {
        await Taro.showToast({
          icon: 'none',
          title: '更新个人照片失败',
          duration: TOAST_SHOW_TIME,
        });
      }
      else {
        const res = await putPersonalImage({ ...data.image, imageUrl: uploadRes.fileID })
        if (res && res.code === 0) {
          console.log("用户信息：更新用户个人照片成功")
          dispatch(fetchPersonInfo())
        }
        else {
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
export const submitMultiPersonalImage = (data) => {
  return async dispatch => {
    console.log("用户个人信息：提交多张用户个人照片", data)
    try {
      let images: IPhotoUrls[]
      if (data.images) {
        images = await uploadMultiPersonImages(data.images)
      }
      else {
        images = []
      }

      const res = await postPersonalInfo({ personInfo: null, images: [...images] })
      if (res && res.code === 0) {
        console.log("用户个人信息：提交用户个人照片成功")
        dispatch(fetchPersonInfo())

        await Taro.showToast({
          icon: 'none',
          title: '提交个人照片成功',
          duration: TOAST_SHOW_TIME,
        });
      } else if (res && res.code === 13) {
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







