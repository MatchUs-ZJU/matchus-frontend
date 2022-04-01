import {ACTIVITY_MATCH_STATE_SAVE, ACTIVITY_SAVE, ACTIVITY_TWC_STATE_SAVE} from "@/constants";

export interface IActivityState {
  // basic
  id: string,
  name: string,

  // about activity content
  price: number,
  wjxPath: string,
  wjxAppId: string,

  // time
  startTime?: number,
  signUpStartTime?: number,
  signUpEndTime?: number,
  surveyEndTime?: number,
  matchResultShowTime?: number,
  twoWayChooseStartTime?: number,
  twoWayChooseEndTime?: number,
  twoWayChooseResultShowTime?: number,
  endTime?: number

  // resource
  imageUrl: string

  // participate information
  participate: IParticipateState
}

export interface IParticipateState {
  signUp: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    paid: boolean,
    participated: boolean
  };

  fillForm: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    filled: boolean
  };

  match: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    matchResult: boolean,
    favor: number,
    lastChoose: boolean,
    left: number,
    info: {

    }
  }

  choose: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    choice: boolean,
    message: string,
    hasResult: boolean,
    chooseResult: boolean
    info: {

    }
  }
}

const INITIAL_STATE: IActivityState = {
  participate: {
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
      lastChoose: false,
      left: 0, // TODO
      info: {

      }
    },

    choose: {
      state: 'NOT_START',
      choice: false,
      message: '',
      hasResult: false,
      chooseResult: false,
      info: {

      }
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
    case ACTIVITY_MATCH_STATE_SAVE: {
      let newState: IActivityState = state
      state.participate.match.info = action.payload
      return newState
    }
    case ACTIVITY_TWC_STATE_SAVE: {
      let newState: IActivityState = state
      state.participate.choose.info = action.payload
      return newState
    }
    default:
      return state
  }
}
