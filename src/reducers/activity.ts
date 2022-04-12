import {
  ACTIVITY_FILL_FORM_SAVE,
  ACTIVITY_CHOOSE_SAVE,
  ACTIVITY_MATCH_SAVE,
  ACTIVITY_SAVE,
  ACTIVITY_SIGN_UP_SAVE
} from "@/constants";
import {IParticipateState} from "@/typings/types";

export interface IActivityState {
  // basic
  id: string,
  name: string,

  // about activity content
  price: number,
  wjxPath: string,
  wjxAppId: string,

  // time
  signUpStartTime?: number,
  matchResultShowTime?: number,
  twoWayChooseStartTime?: number,
  twoWayChooseEndTime?: number,
  twoWayChooseResultShowTime?: number,

  // resource
  imageUrl: string

  // participate information
  participate: IParticipateState
}

const INITIAL_STATE: IActivityState = {
  participate: {
    state: 'NOT_ACTIVE',

    signUp: {
      state: 'NOT_START',
      paid: false,
      participated: false
    },

    fillForm: {
      state: 'NOT_START',
      filled: false
    },

    match: {
      state: 'NOT_START',
      matchResult: false,
      favor: 0,
      lastChoose: 0,
      left: 0, // TODO
    },

    choose: {
      state: 'NOT_START',
      choice: false,
      message: '',
      hasResult: false,
      chooseResult: false,
    },
  },
  wjxAppId: "wxd947200f82267e58",
  wjxPath: "pages/wjxqList/wjxqList?activityId=PfjBWtQ",
  imageUrl: "",
  id: "",
  name: "",
  price: 0,
}

export default function activity(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTIVITY_SAVE:
      return {
        ...state,
        ...action.payload
      }
    case ACTIVITY_SIGN_UP_SAVE: {
      let newState = state
      newState.participate.signUp = {
        ...newState.participate.signUp,
        ...action.payload
      }
      return newState
    }
    case ACTIVITY_FILL_FORM_SAVE: {
      let newState = state
      newState.participate.fillForm = {
        ...newState.participate.fillForm,
        ...action.payload
      }
      return newState
    }
    case ACTIVITY_CHOOSE_SAVE: {
      let newState = state
      newState.participate.choose = {
        ...newState.participate.choose,
        ...action.payload
      }
      return newState
    }
    case ACTIVITY_MATCH_SAVE: {
      let newState = state
      newState.participate.match = {
        ...newState.participate.match,
        ...action.payload
      }
      return newState
    }
    default:
      return state
  }
}
