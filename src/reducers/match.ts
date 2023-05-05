import { MATCH_FEEDBACK_SAVE, MATCH_SAVE } from "@/constants";
import { IMatchFeedback } from "@/typings/types";

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

    specialInfo: {
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

  feedback?: IMatchFeedback,

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
    specialInfo: [],
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
    case MATCH_FEEDBACK_SAVE:
      return {
        ...state,
        feedback: {
          ...action.payload
        }
      }
    default:
      return state
  }
}
