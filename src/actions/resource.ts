import {RESOURCE_SAVE} from "@/constants";
import {getFaculties, getHelpsInfo} from "@/services/resource";

export const resourceSave = (payload) => {
  return {
    type: RESOURCE_SAVE,
    payload
  }
}

export const fetchHelpsInfo = () => {
  return async dispatch => {
    console.log("用户页面：获取常见帮助信息")
    try {
      let res = await getHelpsInfo()
      if(res && res.code === 0) {
        console.log("用户页面：获取常见帮助信息成功")
        dispatch(resourceSave({
          help: res.data
        }))
      } else {
        console.log("用户页面：获取常见帮助信息失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchFaculties = () => {
  return async dispatch => {
    console.log("用户信息：获取院系信息")
    try {
      let res = await getFaculties()
      if(res && res.code === 0) {
        console.log("用户信息：获取院系信息成功")
        dispatch(resourceSave({
          faculties: res.data
        }))
      } else {
        console.log("用户信息：获取院系信息失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}
