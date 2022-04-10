import {HOME_SAVE} from "@/constants";
import {IArticle, IBanner, IHomeData} from "@/typings/types";

export interface IHomeState {
  banners: IBanner[],
  articles: IArticle[],
  data: IHomeData,
}

const INITIAL_STATE: IHomeState = {
  data: {
    startTime: new Date().getTime(),
    endTime: new Date().getTime(),
    signUpStartTime: new Date().getTime(),
    signUpEndTime: new Date().getTime(),

    currentParticipant: 0,
    currentTerm: 0,

    totalTerm: 0,
    matched: 0,
    unavailable: 0,
  },
  banners: [],
  articles: []
}

export default function home(state = INITIAL_STATE, action) {
  switch (action.type) {
    case HOME_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
