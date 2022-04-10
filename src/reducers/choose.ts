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
  sanguan: {
    index: number,
    question: string,
    answer: string
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
  sanguan: []
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

