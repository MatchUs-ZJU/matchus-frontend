import {HOME_SAVE} from "../constants";
import {getBanners, getRecommends} from "../services/home";

export const fetchBanners = () => {
  return dispatch => {
    getBanners()
      .then((res) => {
        if (res) {
          dispatch(save(res))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

export const fetchRecommends = () => {
  return dispatch => {
    getRecommends()
      .then((res) => {
        if (res) {
          dispatch(save(res))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

export const save = (payload) => {
  return {
    type: HOME_SAVE,
    payload: payload
  }
}
