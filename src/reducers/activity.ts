import {ACTIVITY_SAVE} from "../constants";

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

  // participate information
  participate: IParticipateState
}

export interface IParticipateState {
  participate: boolean,
  // TODO
  // phase
  paid: boolean
  filledSurvey: boolean,
}

const INITIAL_STATE: IActivityState = {
  wjxAppId: "wxd947200f82267e58",
  wjxPath: "pages/wjxqList/wjxqList?activityId=PfjBWtQ",
  participate: {
    participate: false,
    paid: false,
    filledSurvey: false,
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
    default:
      return state
  }
}
