import Taro from "@tarojs/taro";

import {GLOBAL_SAVE} from "../constants";

export interface IGlobalState {
  showLoginModal: boolean;
  showIdentifyModal: boolean;

  page: number;
  pageStack: number;

  systemInfo?: Taro.getSystemInfo.Result;
}

const INITIAL_STATE: IGlobalState = {
  showLoginModal: false,
  showIdentifyModal: false,

  pageStack: 0,
  page: 0,
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
