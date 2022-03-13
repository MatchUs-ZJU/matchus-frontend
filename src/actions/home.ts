import {HOME_SAVE} from "../constants";
import {getBanners, getRecommends} from "../services/home";

export const fetchBanners = () => {
  return dispatch => {
    console.log("首页：获取广告横幅")
    try {
      let res = getBanners()
      if(res) {
        console.log("首页：获取广告横幅成功")
        dispatch(homeSave(res))
      } else {
        console.log("首页：获取广告横幅失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchRecommends = () => {
  return dispatch => {
    console.log("首页：获取推荐内容")
    try {
      let res = getRecommends()
      if(res) {
        console.log("首页：获取推荐内容成功")
        dispatch(homeSave(res))
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
