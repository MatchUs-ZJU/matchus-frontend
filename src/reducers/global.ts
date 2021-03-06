import Taro from "@tarojs/taro";

import {GLOBAL_SAVE} from "@/constants";

export interface IGlobalState {
  page: number;
  pageStack: number;

  pushFillForm: boolean

  systemInfo?: Taro.getSystemInfo.Result;
}

const INITIAL_STATE: IGlobalState = {
  pageStack: 0,
  page: 0,
  pushFillForm: false
}

export default function global(state: IGlobalState = INITIAL_STATE, action) {
  switch (action.type) {
    case GLOBAL_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
