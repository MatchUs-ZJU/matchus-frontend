import {CHOOSE_SAVE} from "@/constants";

export interface IChooseState {
  female: {
    nickName: string,
    avatarUrl: string,
  }

  male: {
    nickName: string,
    avatarUrl: string,
  }

  success: boolean,
  message: string,
  info: {
    index: number,
    key: string,
    value: string
  }[],
}

const INITIAL_STATE: IChooseState = {
  female: {
    nickName: '',
    avatarUrl: '',
  },

  male: {
    nickName: '',
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

