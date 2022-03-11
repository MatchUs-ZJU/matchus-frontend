import {USER_SAVE, USER_LOGOUT} from "../constants";

export interface IUserState {
  nickName: string;
  realName: string;
  id: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  language:string;

  openid?: string;
  sessionKey?: string;
  binded?: boolean;

  school?: string;
  faculty?: string;
  role: 'guest' | 'admin' | 'user' | 'root';

  login: boolean;
  identified: number; // 是否完成认证
  createTime?: Date;
}

const INITIAL_STATE: IUserState = {
  avatarUrl: "",
  country: "",
  gender: 0,
  language: "",
  province: "",
  realName: "",
  id: "",
  identified: 3,
  login: false,
  nickName: "",
  role: "guest",
  school: ""
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_LOGOUT:
      return INITIAL_STATE
    case USER_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
