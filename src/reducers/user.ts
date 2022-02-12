import {USER_SAVE, USER_LOGOUT} from "../constants";

export interface IUserState {
  nickName: string;
  id: string;
  // anonymousAvatar?: string;
  avatarUrl?: string;
  gender?: number;

  openid?: string;
  sessionKey?: string;

  school?: string;
  role: 'guest' | 'admin' | 'user' | 'root';

  login: boolean;
  identified: boolean; // 是否完成认证
  binded: boolean;
}

const INITIAL_STATE: IUserState = {
  id: "",
  identified: false,
  login: false,
  nickName: "",
  role: "guest",
  school: "",
  binded: false
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
