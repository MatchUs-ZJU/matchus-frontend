import {
  ACTIVITY_FILL_FORM_SAVE,
  ACTIVITY_CHOOSE_SAVE,
  ACTIVITY_MATCH_SAVE,
  ACTIVITY_SAVE,
  ACTIVITY_SIGN_UP_SAVE,
  ACTIVITY_DAILYQA_SAVE,
  ACTIVITY_APPROVE_SAVE
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

  // participated information
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
      left: 0,
      refund: false,
      message: 0
    },

    dailyQuestion:{
      approval: [{index: 0,approval:false},{index:1,approval:false},{index:2,approval:false},{index:3,approval:false}],
      before: {id:-1,index: 0,question:'',value:'',approval:false},
      today: {id:-1,index: 0,question:'',value:'',approval:false}
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
        ...action.payload,
        participate: {
          ...state.participate,
          ...action.payload.participate
        }
      }
    case ACTIVITY_SIGN_UP_SAVE:
      return {
        ...state,
        participate: {
          ...state.participate,
          signUp: {
            ...state.participate.signUp,
            ...action.payload
          }
        }
      }
    case ACTIVITY_FILL_FORM_SAVE:
      return {
        ...state,
        participate: {
          ...state.participate,
          fillForm: {
            ...state.participate.fillForm,
            ...action.payload
          }
        }
      }
    case ACTIVITY_CHOOSE_SAVE:
      return {
        ...state,
        participate: {
          ...state.participate,
          choose: {
            ...state.participate.choose,
            ...action.payload
          }
        }
      }
    case ACTIVITY_MATCH_SAVE:
      return {
        ...state,
        participate: {
          ...state.participate,
          match: {
            ...state.participate.match,
            ...action.payload
          }
        }
      }
    case ACTIVITY_DAILYQA_SAVE:
      return {
        ...state,
        participate: {
          ...state.participate,
          dailyQuestion:{
            ...state.participate.dailyQuestion,
            ...action.payload
          }
        }
      }
    case ACTIVITY_APPROVE_SAVE:
      return {
        ...state,
        participate:{
          ...state.participate,
          dailyQuestion: {
            ...state.participate.dailyQuestion,
            before: {
              ...state.participate.dailyQuestion.before,
              ...action.payload.before
            }
          }
        }
      }
    default:
      return state
  }
}
