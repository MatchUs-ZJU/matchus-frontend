import {USER_SAVE} from "@/constants";
import {ISurveyInfo} from "@/typings/types";

export interface IUserState {
  nickName: string;
  realName: string;
  id: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  language:string;
  identified: '未认证' | '认证成功' | '认证失败' | '认证中';
  userType: number;
  school: string;
  studentNumber: string;

  purePhoneNumber: string;
  phoneNumber: string;
  countryCode: string;

  faculty: string;
  createTime: number;

  openid: string;
  sessionKey: string;
  binded: boolean;

  login: boolean;

  surveyInfo?: ISurveyInfo;
}

const INITIAL_STATE: IUserState = {
  binded: false,
  createTime: 0,
  openid: "",
  sessionKey: "",
  countryCode: "",
  purePhoneNumber: "",
  phoneNumber: "",
  faculty: "",
  studentNumber: "",
  avatarUrl: "",
  country: "",
  gender: 0,
  language: "",
  province: "",
  realName: "",
  id: "",
  identified: '未认证',
  login: false,
  nickName: "",
  school: "",
  userType: 0
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
