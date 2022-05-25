import {CHOOSE_SAVE} from "@/constants";

export interface IChooseState {
  female: {
    realName: string,
    avatarUrl: string,
  }

  male: {
    realName: string,
    avatarUrl: string,
  }

  info: {
    index: number,
    key: string,
    value: string
  }[]

  success: boolean,
  message: string,
}

const INITIAL_STATE: IChooseState = {
  female: {
    realName: '',
    avatarUrl: '',
  },

  male: {
    realName: '',
    avatarUrl: '',
  },

  success: false,
  message: '',

  info: []
}

export default function choose(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHOOSE_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

