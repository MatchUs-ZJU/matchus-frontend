import {
  ACTIVITY_FILL_FORM_SAVE,
  ACTIVITY_CHOOSE_SAVE,
  ACTIVITY_MATCH_SAVE,
  ACTIVITY_SAVE,
  SAVE_VOUCHER_READ_INFO,
  ACTIVITY_WALLET_SAVE,
  ACTIVITY_SIGN_UP_SAVE,
  ACTIVITY_DAILYQA_SAVE,
  ACTIVITY_APPROVE_SAVE, ACTIVITY_ANALYSIS_SAVE,
  ACTIVITY_BASIC_DATA_SAVE
} from "@/constants";
import { IMatchAnalysisState, IParticipateState } from "@/typings/types";

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
  signUpEndTime?: number,
  matchResultShowTime?: number,
  twoWayChooseStartTime?: number,
  twoWayChooseEndTime?: number,
  twoWayChooseResultShowTime?: number,

  // resource
  imageUrl: string

  // participated information
  participate: IParticipateState

  // analysis
  analysis: IMatchAnalysisState

  // activity data
  totalTerm: number,
  matched: number,
  totalParticipate: number,
  unavailable: number

  //voucher
  hasVoucher: boolean,
  isVoucherUnread: boolean,
}

const INITIAL_STATE: IActivityState = {
  analysis: {
    match: 0,
    matchSuccess: 0,
    lucky: 0,
    luckyAdd: 0,
    conditions: []
  },

  participate: {
    state: 'NOT_ACTIVE',

    signUp: {
      state: 'NOT_START',
      paid: false,
      participated: false
    },

    fillForm: {
      state: 'NOT_START',
      filled: false,
      percent: { total: 1, answer: 0 },
      // isComplete: false
    },

    match: {
      state: 'NOT_START',
      matchResult: false,
      favor: 0,
      lastChoose: 0,
      left: 0,
      refund: false,
      message: 0,
      subscribe: false
    },

    dailyQuestion: {
      approval: [{ index: 0, approval: false }, { index: 1, approval: false }, { index: 2, approval: false }, {
        index: 3,
        approval: false
      }],
      before: { id: -1, index: 0, question: '', value: '', approval: false },
      today: { id: -1, index: 0, question: '', value: '', approval: false }
    },

    choose: {
      state: 'NOT_START',
      choice: false,
      message: '',
      hasResult: false,
      chooseResult: false,
    },
    wallet: {
      state: 'NOT_START'
    }
  },
  wjxAppId: "wxd947200f82267e58",
  wjxPath: "pages/wjxqList/wjxqList?activityId=PfjBWtQ",
  imageUrl: "",
  id: "",
  name: "",
  price: 0,
  totalTerm: 0,
  matched: 0,
  totalParticipate: 0,
  unavailable: 0,
  hasVoucher: false,
  isVoucherUnread: false
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
    case SAVE_VOUCHER_READ_INFO:
      return {
        ...state,
        isVoucherUnread: action.payload
      }
    case ACTIVITY_WALLET_SAVE:
      return {
        ...state,
        participate: {
          ...state.participate,
          wallet: {
            ...state.participate.wallet,
          }
        }
      }
    case ACTIVITY_ANALYSIS_SAVE:
      return {
        ...state,
        analysis: {
          ...action.payload,
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
          dailyQuestion: {
            ...state.participate.dailyQuestion,
            ...action.payload
          }
        }
      }
    case ACTIVITY_APPROVE_SAVE:
      return {
        ...state,
        participate: {
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
    case ACTIVITY_BASIC_DATA_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
