import {USER_SAVE} from "@/constants";

export interface IUserState {
  nickName: string;
  realName: string;
  id: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  language:string;
  identified: '未认证' | '已认证' | '认证失败' | '认证中';
  school: string;
  studentNumber: string;
  phoneNumber: string;

  faculty: string;
  createTime?: number;

  openid?: string;
  sessionKey?: string;
  binded?: boolean;

  login: boolean;
}

const INITIAL_STATE: IUserState = {
  faculty: "",
  phoneNumber: "",
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
  school: ""
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
