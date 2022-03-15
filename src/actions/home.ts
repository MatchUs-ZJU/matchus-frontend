import {HOME_SAVE} from "../constants";
import {getBanners, getRecommends} from "../services/home";

export const fetchBanners = () => {
  return async dispatch => {
    console.log("首页：获取广告横幅")
    try {
      let res = await getBanners()
      if(res && res.code === 0) {
        console.log("首页：获取广告横幅成功")
        dispatch(homeSave({
          banners: res.data
        }))
      } else {
        console.log("首页：获取广告横幅失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchRecommends = () => {
  return async dispatch => {
    console.log("首页：获取推荐内容")
    try {
      let res = await getRecommends()
      if(res && res.code === 0) {
        console.log("首页：获取推荐内容成功")
        dispatch(homeSave({
          recommends: res.data
        }))
      } else {
        console.log("首页：获取推荐内容失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const homeSave = (payload) => {
  return {
    type: HOME_SAVE,
    payload: payload
  }
}
