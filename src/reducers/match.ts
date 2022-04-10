import {MATCH_SAVE} from "@/constants";

export interface IMatchState {
  female: {
    nickName: string,
    avatarUrl: string,
  }

  male: {
    nickName: string,
    avatarUrl: string,
  }

  realName: string,
  age: string,
  height: string,
  hometown: string,
  campus: string,
  faculty: string,
  major: string,

  characteristic: {
    question: string,
    answer: string
  }[],

  wechatNumber: string,
  photos: string[]

  favor: number,
  hasFavor: boolean
}

const INITIAL_STATE: IMatchState = {
  female: {
    nickName: '',
    avatarUrl: '',
  },

  male: {
    nickName: '',
    avatarUrl: '',
  },

  realName: '',
  age: '',
  height: '',
  hometown: '',
  campus: '',
  faculty: '',
  major: '',

  characteristic: [],

  wechatNumber: '',
  photos: [],

  favor: 0,
  hasFavor: false
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
