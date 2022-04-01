import {HOME_SAVE} from "@/constants";
import {getBanners, getHomeData, getRecommends} from "@/services/home";

export const fetchBanners = () => {
  return async dispatch => {
    console.log("首页：获取广告横幅")
    try {
      let res = await getBanners()
      if(res && res.code === 0) {
        console.log("首页：获取广告横幅成功")
        // TODO 完善获取逻辑
        if(res.data.records) {
          dispatch(homeSave({
            banners: res.data.records
          }))
        }
      } else {
        console.log("首页：获取广告横幅失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchHomeData = () => {
  return async dispatch => {
    console.log("首页：获取首页数据")
    try {
      let res = await getHomeData()
      console.log(res)
      if(res && res.code === 0) {
        console.log("首页：获取首页数据成功")
        dispatch(homeSave({
          data: res.data
        }))
      } else {
        console.log("首页：获取首页数据失败")
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
      console.log(res)
      if(res && res.code === 0) {
        console.log("首页：获取推荐内容成功")
        // TODO 完善获取逻辑
        if(res.data.records) {
          dispatch(homeSave({
            articles: res.data.records
          }))
        }
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
