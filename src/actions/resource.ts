import {RESOURCE_SAVE} from "@/constants";
import {getFaculties, getHelpsInfo, getResourceImages} from "@/services/resource";

export const resourceSave = (payload) => {
  return {
    type: RESOURCE_SAVE,
    payload
  }
}

export const fetchHelpsInfo = () => {
  return async dispatch => {
    console.log("资源信息：获取常见帮助信息")
    try {
      let res = await getHelpsInfo()
      if(res && res.code === 0) {
        console.log("资源信息：获取常见帮助信息成功")
        dispatch(resourceSave({
          help: res.data
        }))
      } else {
        console.log("资源信息：获取常见帮助信息失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchFaculties = () => {
  return async dispatch => {
    console.log("资源信息：获取院系信息")
    try {
      let res = await getFaculties()
      if(res && res.code === 0) {
        console.log("资源信息：获取院系信息成功")
        dispatch(resourceSave({
          faculties: res.data
        }))
      } else {
        console.log("资源信息：获取院系信息失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchResourceImages = () => {
  return async dispatch => {
    console.log("资源信息：获取图片资源")
    try {
      let res = await getResourceImages()
      if(res && res.code === 0) {
        console.log("资源信息：获取图片资源成功")
        dispatch(resourceSave({
          images: res.data
        }))
      } else {
        console.log("资源信息：获取图片资源失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}
