import {MATCH_SAVE} from "@/constants";

export interface IMatchState {
  female: {
    realName: string,
    avatarUrl: string,
  }

  male: {
    realName: string,
    avatarUrl: string,
  }

  matchInfo: {
    basicInfo: {
      index: number,
      key: string,
      value: string
    }[],

    characteristics: {
      index: number,
      key: string,
      value: string
    }[],

    wechatNumber: string,
  }

  imagesUrl: string[]
  favor: number,
  hasFilled: boolean,
  isTwice: boolean,

}

const INITIAL_STATE: IMatchState = {
  female: {
    realName: '',
    avatarUrl: '',
  },

  male: {
    realName: '',
    avatarUrl: '',
  },

  matchInfo: {
    basicInfo: [],
    characteristics: [],
    wechatNumber: '',
  },

  imagesUrl: [],

  favor: 0,
  hasFilled: false,
  isTwice: false,

}

export default function match(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MATCH_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
