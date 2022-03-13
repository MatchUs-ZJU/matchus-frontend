import {ACTIVITY_MATCH_STATE_SAVE, ACTIVITY_SAVE, ACTIVITY_TWC_STATE_SAVE} from "../constants";

export interface IActivityState {
  // basic
  id: string,
  name: string,
  term: number,

  // about activity content
  price: number,
  wjxPath: string,
  wjxAppId: string,

  // time
  startTime?: Date,
  signUpStartTime?: Date,
  signUpEndTime?: Date,
  matchStartTime?: Date,
  matchEndTime?: Date,
  matchResultShowTime?: Date,
  twoWayChooseStartTime?: Date,
  twoWayChooseEndTime?: Date
  endTime?: Date

  // resource
  imageUrl: string
  feedbackContent?: {}

  // participate information
  participate: IParticipateState
}

export interface IParticipateState {
  participate: boolean,
  paid: boolean
  filledSurvey: boolean,
  filledSatisfiedFeedback: boolean
  twcValue: '成功' | '失败' | '未选择'

  match?: IMatchState
  twc?: ITwoWayChooseState
}

export interface IMatchState {
  matched: boolean
  info?: {}
}

export interface ITwoWayChooseState {
  success: boolean
  info?: {}
}

const INITIAL_STATE: IActivityState = {
  wjxAppId: "wxd947200f82267e58",
  wjxPath: "pages/wjxqList/wjxqList?activityId=PfjBWtQ",
  participate: {
    participate: false,
    paid: false,
    filledSurvey: false,
    filledSatisfiedFeedback: false
  },
  term: 0,
  imageUrl: "",
  id: "",
  name: "",
  price: 0
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
      state.participate.match = action.payload
      return newState
    }
    case ACTIVITY_TWC_STATE_SAVE: {
      let newState: IActivityState = state
      state.participate.twc = action.payload
      return newState
    }
    default:
      return state
  }
}
