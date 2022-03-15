import {ACTIVITY_MATCH_STATE_SAVE, ACTIVITY_SAVE, ACTIVITY_TWC_STATE_SAVE} from "../constants";

export interface IActivityState {
  // basic
  id: string,
  name: string,

  // about activity content
  price: number,
  wjxPath: string,
  wjxAppId: string,

  // time
  startTime?: Date,
  signUpStartTime?: Date,
  signUpEndTime?: Date,
  surveyEndTime?: Date,
  matchResultShowTime?: Date,
  twoWayChooseStartTime?: Date,
  twoWayChooseEndTime?: Date,
  twoWayChooseResultShowTime?: Date,
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
  success: boolean
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
    filledSatisfiedFeedback: false,
    twcValue: '未选择'
  },
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
