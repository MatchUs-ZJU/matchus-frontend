import {HOME_SAVE} from "../constants";

export interface IBanner {
  url: string;
}

export interface IRecommendItem {
  url: string   // link to url
  title: string
  notes: string
  date: string
}

export interface IHomeState {
  banners: IBanner[],
  recommends: IRecommendItem[],
}

const INITIAL_STATE: IHomeState = {
  banners: [],
  recommends: [],
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
